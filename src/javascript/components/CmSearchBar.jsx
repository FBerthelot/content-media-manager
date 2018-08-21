import React from "react";
import {withStyles, Typography, Button, Input, Paper, IconButton, Grid} from "@material-ui/core";
import Search from '@material-ui/icons/Search';
import ContentTypeSelect from './ContentTypeSelect';
import {translate, Trans} from 'react-i18next';
import {compose} from "react-apollo/index";
import CmRouter from "./CmRouter";
import {SITE_ROOT} from "./CmRouter";

const styles = theme => ({
    sql2Form: {
        padding: theme.spacing.unit,
        color: theme.palette.text.secondary,
        fontFamily: 'monospace'
    },
    sql2Input : {
        margin: 0,
        padding: 0,
        fontFamily: 'monospace'
    },
    footer: {
        display: 'flex',
        marginTop: theme.spacing.unit
    },
    actionButton: {
        textTransform: 'none'
    },
    link: {
        color: 'inherit'
    }
});

class CmSearchBar extends React.Component {

    constructor(props) {

        super(props);

        this.getBasePath = this.getBasePath.bind(this);
        this.onSql2Click = this.onSql2Click.bind(this);
        this.onNormalClick = this.onNormalClick.bind(this);
        this.onClear = this.onClear.bind(this);

        let {dxContext, urlParams} = props;
        this.normal = <CmSearchBarNormal dxContext={dxContext} contentType={urlParams.searchContentType} onSql2Click={this.onSql2Click} onClear={this.onClear}/>;
        this.sql2 = <CmSearchBarSql2 dxContext={dxContext} onNormalClick={this.onNormalClick} onClear={this.onClear}/>;
        this.state = {
            current: (urlParams.sql2SearchFrom == null ? this.normal : this.sql2)
        };
    }

    getBasePath(type) {
        switch(type) {
            case 'contents': return 'browse';
            case 'files': return 'browse-files';
            case 'pages': return 'browse';
        }
    }

    onSql2Click() {
        this.setState({
            current: this.sql2
        });
    }

    onNormalClick() {
        this.setState({
            current: this.normal
        });
    }

    onClear(path, params, goto) {
        goto(SITE_ROOT + '/' + this.getBasePath(params.type) + path, params);
    }

    render() {
        return (
            <div>
                {this.state.current}
            </div>
        )
    }
}

class CmSearchBarNormal extends React.Component {

    constructor(props) {
        super(props);
        this.search = React.createRef();
        this.state = {
            contentType: (props.contentType !== undefined ? props.contentType : null)
        }
    }

    onContentTypeChange(path, params, contentType, goto) {
        this.setState({
            contentType: contentType
        });
        this.onSearch(path, params, contentType, goto);
    }

    onSearchInputChange(path, params, goto) {
        // Perform search only when the user has paused changing search terms for a second.
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(function() {
            this.onSearch(path, params, this.state.contentType, goto);
        }.bind(this), 1000);
    }

    onSearchInputKeyDown(e, path, params, goto) {
        if (e.key === 'Enter') {
            this.onSearch(path, params, this.state.contentType, goto);
        }
    }

    onSearch(path, params, contentType, goto) {

        let searchTerms = this.search.current.value;
        if (!searchTerms) {
            return;
        }
        searchTerms = searchTerms.trim();
        if (searchTerms == '') {
            return;
        }

        _.assign(params, contentType ? {
            searchContentType: contentType,
            searchTerms: searchTerms
        } : {
            searchTerms: searchTerms
        });

        goto(SITE_ROOT + '/search' + path, params);
    }

    onClear(path, params, goto) {

        this.setState({
            contentType: null
        });
        this.search.current.value = '';

        _.unset(params, 'searchContentType');
        _.unset(params, 'searchTerms');

        this.props.onClear(path, params, goto);
    }

    render() {

        let {dxContext, onSql2Click, classes, t} = this.props;

        return (
            <CmRouter render={({path, params, goto}) => (
                <SearchBarLayout onSearch={() => this.onSearch(path, params, this.state.contentType, goto)}
                    rightFooter={
                        <React.Fragment>
                            {(params.searchTerms != null) &&
                                <ActionButton label={'label.contentManager.search.clear'} variant={'contained'} onClick={() => this.onClear(path, params, goto)} cmRole={'search-clear'}/>
                            }
                            {(params.searchTerms == null) &&
                                <ActionButton label={'label.contentManager.search.sql2'} onClick={onSql2Click} cmRole={'search-type-sql2search'}/>
                            }
                        </React.Fragment>
                    }
                >
                    <ContentTypeSelect
                        siteKey={dxContext.siteKey}
                        displayLanguage={dxContext.uilang}
                        contentType={this.state.contentType}
                        onSelectionChange={(contentType) => this.onContentTypeChange(path, params, contentType, goto)}
                    />
                    <Input
                        inputProps={{maxLength: 2000, 'data-cm-role': 'search-input-term'}}
                        defaultValue={params.searchTerms}
                        placeholder={t('label.contentManager.search.normalPrompt')}
                        inputRef={this.search}
                        style={{flexGrow: 10}}
                        onChange={() => this.onSearchInputChange(path, params, goto)}
                        onKeyDown={(e) => this.onSearchInputKeyDown(e, path, params, goto)}
                    />
                </SearchBarLayout>
            )}/>
        );
    }
}

class CmSearchBarSql2 extends React.Component {

    constructor(props) {
        super(props);
        this.from = React.createRef();
        this.where = React.createRef();
    }

    onSearch(path, params, goto) {
        goto(SITE_ROOT + '/sql2Search' + path, (this.where.current.value !== "") ? {
            sql2SearchFrom: this.from.current.value,
            sql2SearchWhere: this.where.current.value
        } : {
            sql2SearchFrom: this.from.current.value
        });
    }

    onClear(path, params, goto) {

        this.from.current.value = '';
        this.where.current.value = '';

        _.unset(params, 'sql2SearchFrom');
        _.unset(params, 'sql2SearchWhere');
        this.props.onClear(path, params, goto);
    }

    render() {

        let {dxContext, onNormalClick, classes, t} = this.props;

        return (
            <CmRouter render={({path, params, goto}) => (
                <SearchBarLayout onSearch={() => this.onSearch(path, params, goto)}
                    leftFooter={
                        <Trans
                            i18nKey={'label.contentManager.search.sql2Prompt'}
                            components={[<a href={dxContext.config.sql2CheatSheetUrl} target={'_blank'} className={classes.link}>univers</a>]}
                        />
                    }
                    rightFooter={
                        <React.Fragment>
                            {(params.sql2SearchFrom != null) &&
                                <ActionButton label={'label.contentManager.search.clear'} variant={'contained'} onClick={() => this.onClear(path, params, goto)} cmRole={'search-clear'}/>
                            }
                            {(params.sql2SearchFrom == null) &&
                                <ActionButton label={'label.contentManager.search.normal'} onClick={onNormalClick} cmRole={'search-type-normal'}/>
                            }
                        </React.Fragment>
                    }
                >
                    <Grid container alignItems={'center'} classes={{container: classes.sql2Form}}>
                        SELECT * FROM [
                        <Sql2Input maxLength={100} size={15} defaultValue={params.sql2SearchFrom} inputRef={this.from} onSearch={() => this.onSearch(path, params, goto)} cmRole={'sql2search-input-from'}/>
                        ] WHERE ISDESCENDANTNODE('{path}') AND (
                        <Sql2Input maxLength={2000} style={{flexGrow: 10}} defaultValue={params.sql2SearchWhere} inputRef={this.where} onSearch={() => this.onSearch(path, params, goto)} cmRole={'sql2search-input-where'}/>
                        )
                    </Grid>
                </SearchBarLayout>
            )}/>
        );
    }
}

class Sql2Input extends React.Component {

    constructor(props) {
        super(props);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(e) {
        if (e.key === 'Enter') {
            this.props.onSearch();
        }
    }

    render() {

        let {maxLength, size, defaultValue, inputRef, classes, style, cmRole} = this.props;

        return (
            <Input
                inputProps={{maxLength: maxLength, size: size, 'data-cm-role': cmRole}}
                defaultValue={defaultValue}
                inputRef={inputRef}
                classes={{root: classes.sql2Input, input: classes.sql2Input}}
                style={style}
                onKeyDown={(e) => this.onKeyDown(e)}
            />
        );
    }
}

class SearchBarLayout extends React.Component {

    render() {

        let {children, leftFooter, rightFooter, onSearch, classes} = this.props;

        return (
            <React.Fragment>
                <Paper square>
                    <Grid container wrap={'nowrap'}>
                        {children}
                        <IconButton color={'secondary'} onClick={onSearch} data-cm-role={'search-submit'}>
                            <Search/>
                        </IconButton>
                    </Grid>
                </Paper>
                <Grid container>
                    <Grid item xs={8}>
                        <Typography color="inherit" variant="body1" gutterBottom align="left">
                            {leftFooter}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography  color="inherit" variant="body1" gutterBottom align="right">
                            {rightFooter}
                        </Typography>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

class ActionButton extends React.Component {

    render() {

        let {label, variant, onClick, classes, t, cmRole} = this.props;

        return (
            <Button variant={variant} size={'small'} onClick={onClick} classes={{root: classes.actionButton}} data-cm-role={cmRole}>
                {t(label)}
            </Button>
        );
    }
}

CmSearchBarNormal = compose(
    translate(),
    withStyles(styles)
)(CmSearchBarNormal);

CmSearchBarSql2 = compose(
    translate(),
    withStyles(styles)
)(CmSearchBarSql2);

Sql2Input = withStyles(styles)(Sql2Input);

SearchBarLayout = withStyles(styles)(SearchBarLayout);

ActionButton = compose(
    translate(),
    withStyles(styles)
)(ActionButton);

CmSearchBar = compose(
    translate(),
    withStyles(styles)
)(CmSearchBar);

export {CmSearchBar};