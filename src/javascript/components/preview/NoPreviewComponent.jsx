import React from 'react';
import classNames from 'classnames';
import {Paper, Typography} from '@material-ui/core';

export class NoPreviewComponent extends React.Component {
    render() {
        const {classes, t} = this.props;
        return (
            <div className={classNames(classes.noPreviewContainer, classes.contentContainer)}>
                <Paper elevation={1} className={classes.contentContainer} classes={{root: classes.contentPaper}}>
                    <Typography variant="h5">
                        {t('label.contentManager.contentPreview.noViewAvailable')}
                    </Typography>
                </Paper>
            </div>
        );
    }
}
