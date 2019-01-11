import React from 'react';
import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';
import {withApollo, compose} from 'react-apollo';
import {uploadFile, updateFileContent} from './UploadItem.gql-mutations';
import {Button, CircularProgress, ListItem, ListItemText, Avatar, ListItemSecondaryAction, Popover, TextField} from '@material-ui/core';
import {CheckCircle, Info, FiberManualRecord, InsertDriveFile} from '@material-ui/icons';
import {connect} from 'react-redux';
import {uploadStatuses, NUMBER_OF_SIMULTANEOUS_UPLOADS, RENAME_MODE} from '../Upload.constants';
import {updateUpload, removeUpload, takeFromQueue} from '../Upload.redux-actions';
import {batchActions} from 'redux-batched-actions';
import {isImageFile} from '../../FilesGrid/FilesGrid.utils';
import {translate} from 'react-i18next';
import {ellipsizeText} from '../../../ContentManager.utils';

const styles = theme => ({
    progressText: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        alignContent: 'center',
        justifyItems: 'center'
    },
    fileNameText: {
        width: 350,
        '& span': {
            color: theme.palette.text.secondary
        }
    },
    statusIcon: {
        marginRight: theme.spacing.unit
    },
    statusIconRed: {
        marginRight: theme.spacing.unit,
        color: theme.palette.error.main
    },
    statusIconGreen: {
        marginRight: theme.spacing.unit,
        color: theme.palette.valid.main
    },
    statusIconOrange: {
        marginRight: theme.spacing.unit,
        color: theme.palette.secondary.main
    },
    renameField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 250,
        '& label': {
            color: theme.palette.text.secondary
        }
    },
    actionButton: {
        margin: theme.spacing.unit,
        color: theme.palette.text.secondary
    }
});

const UPLOAD_DELAY = 500;

export class UploadItem extends React.Component {
    constructor(props) {
        super(props);
        this.client = null;
        this.state = {
            userChosenName: null,
            anchorEl: null
        };

        this.showChangeNamePopover = this.showChangeNamePopover.bind(this);
        this.hideChangeNamePopover = this.hideChangeNamePopover.bind(this);
        this.rename = this.rename.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.status === uploadStatuses.UPLOADING && prevProps.status !== uploadStatuses.UPLOADING) {
            this.doUploadAndStatusUpdate(false);
            this.props.updateUploadsStatus();
        }
    }

    render() {
        const {classes, file, t} = this.props;
        const open = Boolean(this.state.anchorEl);
        return (
            <ListItem className={classes.listItem}>
                { this.avatar() }
                <ListItemText className={classes.fileNameText} primary={ellipsizeText(this.getFileName(), 60)}/>
                <ListItemText className={classes.fileNameText} primary={this.statusText()}/>
                <ListItemSecondaryAction>
                    { this.secondaryActionsList() }
                </ListItemSecondaryAction>
                <Popover
                    open={open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    onClose={this.hideChangeNamePopover}
                >
                    <TextField
                        label={t('label.contentManager.fileUpload.newName')}
                        className={classes.renameField}
                        type="text"
                        name="newName"
                        margin="normal"
                        variant="outlined"
                        defaultValue={file.name}
                        onKeyUp={this.rename}
                    />
                </Popover>
            </ListItem>
        );
    }

    rename(e) {
        if (RENAME_MODE === 'AUTOMATIC') {
            const {file} = this.props;
            // Note that this may have issues, better strategy would be to generate name first
            this.setState({
                userChosenName: file.name.replace('.', '-1.')
            }, () => {
                this.changeStatusToUploading();
            });
        } else if (RENAME_MODE === 'MANUAL') {
            if (e.keyCode === 13) {
                this.setState({
                    userChosenName: e.target.value,
                    anchorEl: null
                }, () => {
                    this.changeStatusToUploading();
                });
            }
        }
    }

    doUploadAndStatusUpdate(replace) {
        let promise = (replace ? this.updateFileContent() : this.uploadFile());
        promise.then(() => {
            const upload = {
                id: this.props.id,
                status: uploadStatuses.UPLOADED,
                error: null,
                path: this.props.path
            };
            setTimeout(() => {
                this.props.dispatchBatch([
                    updateUpload(upload),
                    takeFromQueue(NUMBER_OF_SIMULTANEOUS_UPLOADS)
                ]).then(() => {
                    this.props.updateUploadsStatus();
                });
            }, UPLOAD_DELAY);
        }).catch(e => {
            const upload = {
                id: this.props.id,
                status: uploadStatuses.HAS_ERROR,
                error: null,
                path: this.props.path
            };

            if (e.message.indexOf('ItemExistsException') !== -1) {
                upload.error = 'FILE_EXISTS';
            }

            if (e.message.indexOf('FileSizeLimitExceededException') !== -1) {
                upload.error = 'INCORRECT_SIZE';
            }

            setTimeout(() => {
                this.props.dispatchBatch([
                    updateUpload(upload),
                    takeFromQueue(NUMBER_OF_SIMULTANEOUS_UPLOADS)
                ]).then(() => {
                    this.props.updateUploadsStatus();
                });
            }, UPLOAD_DELAY);
        });
    }

    uploadFile() {
        const {file, path, client} = this.props;
        const variables = {
            fileHandle: file,
            nameInJCR: this.getFileName(),
            path: path,
            mimeType: file.type
        };

        return client.mutate({
            mutation: uploadFile,
            variables: variables
        });
    }

    updateFileContent() {
        const {file, path, client} = this.props;

        return client.mutate({
            mutation: updateFileContent,
            variables: {
                path: `${path}/${this.getFileName()}`,
                mimeType: file.type,
                fileHandle: file
            }
        });
    }

    getFileName() {
        return (this.state.userChosenName ? this.state.userChosenName : this.props.file.name);
    }

    statusText() {
        const {classes, status, error, t} = this.props;
        let text;

        if (status === uploadStatuses.QUEUED) {
            text = (
                <span className={classes.progressText}>
                    <FiberManualRecord className={classes.statusIcon}/>
                    {t('label.contentManager.fileUpload.queued')}
                </span>
            );
        } else if (status === uploadStatuses.UPLOADED) {
            text = (
                <span className={classes.progressText}>
                    <CheckCircle className={classes.statusIconGreen}/>
                    {t('label.contentManager.fileUpload.uploaded')}
                </span>
            );
        } else if (status === uploadStatuses.HAS_ERROR && error === 'FILE_EXISTS') {
            text = (
                <span className={classes.progressText}>
                    <Info className={classes.statusIconRed}/>
                    {t('label.contentManager.fileUpload.exists')}
                </span>
            );
        } else if (status === uploadStatuses.HAS_ERROR && error === 'INCORRECT_SIZE') {
            text = (
                <span className={classes.progressText}>
                    <Info className={classes.statusIconRed}/>
                    {t('label.contentManager.fileUpload.cannotStore', {maxUploadSize: contextJsParameters.maxUploadSize})}
                </span>
            );
        } else if (status === uploadStatuses.HAS_ERROR) {
            text = (
                <span className={classes.progressText}>
                    <Info className={classes.statusIconRed}/>
                    {t('label.contentManager.fileUpload.failed')}
                </span>
            );
        } else if (status === uploadStatuses.UPLOADING) {
            text = (
                <span className={classes.progressText}>
                    <CircularProgress size={20} className={classes.statusIconOrange}/>
                    {t('label.contentManager.fileUpload.uploading')}
                </span>
            );
        }

        return text;
    }

    secondaryActionsList() {
        const {status, error, removeFile, index, dispatch, t, classes} = this.props;
        const actions = [];
        if (status === uploadStatuses.QUEUED) {
            actions.push(
                <Button
                    key="dontupload"
                    className={classes.actionButton}
                    component="a"
                    onClick={() => {
                        removeFile(index);
                        dispatch(removeUpload(index));
                        this.props.updateUploadsStatus();
                    }}
                >
                    {t('label.contentManager.fileUpload.dontUpload')}
                </Button>
            );
        }
        if (status === uploadStatuses.HAS_ERROR) {
            if (error === 'FILE_EXISTS') {
                if (RENAME_MODE === 'AUTOMATIC') {
                    actions.push(
                        <Button
                            key="rename"
                            className={classes.actionButton}
                            component="a"
                            onClick={e => {
                                this.rename(e);
                            }}
                        >
                            {t('label.contentManager.fileUpload.rename')}
                        </Button>
                    );
                } else if (RENAME_MODE === 'MANUAL') {
                    actions.push(
                        <Button
                            key="rename"
                            className={classes.actionButton}
                            component="a"
                            onClick={e => {
                                this.showChangeNamePopover(e);
                            }}
                        >
                            {t('label.contentManager.fileUpload.rename')}
                        </Button>
                    );
                }
                actions.push(
                    <Button
                        key="overwrite"
                        className={classes.actionButton}
                        component="a"
                        onClick={() => {
                            this.doUploadAndStatusUpdate(true);
                        }}
                    >
                        {t('label.contentManager.fileUpload.replace')}
                    </Button>,
                    <Button
                        key="dontupload"
                        className={classes.actionButton}
                        component="a"
                        onClick={() => {
                            removeFile(index);
                            dispatch(removeUpload(index));
                        }}
                    >
                        {t('label.contentManager.fileUpload.dontUpload')}
                    </Button>
                );
            } else {
                actions.push(
                    <Button
                        key="dontupload"
                        className={classes.actionButton}
                        component="a"
                        onClick={() => {
                            removeFile(index);
                            dispatch(removeUpload(index));
                        }}
                    >
                        {t('label.contentManager.fileUpload.dontUpload')}
                    </Button>,
                    <Button
                        key="retry"
                        className={classes.actionButton}
                        component="a"
                        onClick={() => {
                            this.doUploadAndStatusUpdate(false);
                        }}
                    >
                        {t('label.contentManager.fileUpload.retry')}
                    </Button>
                );
            }
        }

        return actions;
    }

    showChangeNamePopover(e) {
        this.setState({
            anchorEl: e.currentTarget
        });
    }

    hideChangeNamePopover() {
        this.setState({
            anchorEl: null
        });
    }

    changeStatusToUploading() {
        const upload = {
            id: this.props.id,
            status: uploadStatuses.UPLOADING,
            error: null,
            path: this.props.path
        };
        this.props.dispatch(updateUpload(upload));
    }

    avatar() {
        const {file} = this.props;
        if (isImageFile(file.name)) {
            return <Avatar alt={file.name} src={file.preview}/>;
        }
        return (
            <Avatar>
                <InsertDriveFile/>
            </Avatar>
        );
    }
}

UploadItem.propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    removeFile: PropTypes.func.isRequired,
    updateUploadsStatus: PropTypes.func.isRequired,
    file: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return state.fileUpload.uploads[ownProps.index];
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch,
        dispatchBatch: actions => {
            return new Promise(resolve => {
                dispatch(batchActions(actions));
                resolve();
            });
        }
    };
};

export default compose(
    withStyles(styles),
    translate(),
    withApollo,
    connect(mapStateToProps, mapDispatchToProps)
)(UploadItem);
