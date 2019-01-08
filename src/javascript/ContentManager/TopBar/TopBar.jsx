import React from 'react';
import {withStyles, Typography, Grid} from '@material-ui/core';
import {translate} from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import SiteSwitcher from '../siteSwitcher/SiteSwitcher';
import {compose} from 'react-apollo';
import CmSearchBar from '../searchBar/CmSearchBar';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    typoTitle: {
        width: '260px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    },
    head: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginRight: 'auto'
    },
    search: {
        marginLeft: 'auto',
        width: '80%'
    },
    topBar: {
        width: 'min-content',
        alignSelf: 'flex-end',
        paddingTop: theme.spacing.unit * 3
    },
    topBarGrid: {
        marginBottom: theme.spacing.unit * 2,
        '& button': {
            margin: '0px'
        }
    }
});

export class TopBar extends React.Component {
    render() {
        const {classes, mode, t} = this.props;
        let modeTitle = t('label.contentManager.title.' + (mode || 'browse'));

        return (
            <div className={classes.root} data-cm-role="cm-top-bar">
                <Grid container spacing={0} alignItems="center">
                    <Grid item xs={2} className={classes.topBarGrid}>
                        <SiteSwitcher/>
                        <Typography variant="h5" color="inherit" className={classes.typoTitle} data-cm-role="cm-mode-title">
                            {modeTitle}
                        </Typography>

                        <LanguageSwitcher/>
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={9} className={classes.topBar}>
                        <CmSearchBar/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default compose(
    translate(),
    withStyles(styles)
)(TopBar);
