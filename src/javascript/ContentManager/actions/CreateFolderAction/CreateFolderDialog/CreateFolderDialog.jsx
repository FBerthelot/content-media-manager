import PropTypes from 'prop-types';
import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Input,
    withStyles
} from '@material-ui/core';
import {Button} from '@jahia/ds-mui-theme';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';

let styles = {
    root: {
        minWidth: '600px'
    }
};

const CreateFolderDialog = ({open, handleClose, handleCreate, classes, t, name, onChangeName}) => {
    let textField = React.createRef();

    return (
        <Dialog open={open}
                aria-labelledby="form-dialog-title"
                classes={{paper: classes.root}}
                onClose={handleClose}
        >
            <DialogTitle id="form-dialog-title">{t('label.contentManager.createFolderAction.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('label.contentManager.createFolderAction.text')}
                </DialogContentText>
                <Input
                    autoFocus
                    fullWidth
                    inputRef={textField}
                    value={name}
                    id="fileName"
                    margin="dense"
                    onChange={onChangeName}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="secondary" data-cm-role="create-folder-as-cancel" onClick={handleClose}>
                    {t('label.contentManager.createFolderAction.cancel')}
                </Button>
                <Button variant="primary" data-cm-role="create-folder-as-confirm" onClick={handleCreate}>
                    {t('label.contentManager.createFolderAction.create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CreateFolderDialog.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onChangeName: PropTypes.func.isRequired
};

export default compose(
    translate(),
    withStyles(styles)
)(CreateFolderDialog);
