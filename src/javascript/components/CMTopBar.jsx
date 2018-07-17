import React from "react";
import {withStyles, Toolbar, Typography} from '@material-ui/core';
import {translate} from 'react-i18next';
import {LanguageSwitcher, SearchBar} from '@jahia/react-material';
import SiteSelector from './SiteSelector';
import BurgerMenuButton from './BurgerMenuButton';
import Sql2SearchInputForm from './Sql2SearchInputForm';
import {compose} from "react-apollo/index";
import CmRouter from "./CmRouter";

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    head: {
        display: "inline-block",
        verticalAlign: "top"
    },
    search: {
        margin: theme.spacing.unit
    }
});

class CMTopBar extends React.Component {

    render() {

        const { dxContext, classes, t } = this.props;

        return (
            <div className={classes.root}>
                <Toolbar color={'secondary'}>
                    <BurgerMenuButton/>
                    <div className={classes.head}>
                        <SiteSelector/>
                        <Typography variant="display1" color="inherit">{t('label.contentManager.title')}</Typography>
                        <LanguageSwitcher/>
                    </div>
                    <div className={classes.search}>
                        <SearchBar placeholderLabel={t('label.contentManager.search')} onChangeFilter={""} onFocus={""} onBlur={""}/>
                        <CmRouter render={({params}) => (
                            <Sql2SearchInputForm siteKey={dxContext.siteKey} open={params.sql2SearchFrom != null} from={params.sql2SearchFrom} where={params.sql2SearchWhere}/>
                        )}/>
                    </div>
                </Toolbar>
            </div>
        );
    }
}

CMTopBar = compose(
    translate(),
    withStyles(styles)
)(CMTopBar);

export default CMTopBar;