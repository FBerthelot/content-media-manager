import React from 'react';
import PropTypes from 'prop-types';
import iconRenderer from './iconRenderer';
import {Menu, MenuItem, withStyles} from '@material-ui/core';
import {Typography, Button, IconButton} from '@jahia/ds-mui-theme';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import * as _ from 'lodash';
import {ChevronRight as ChevronRightIcon, MoreHoriz} from '@material-ui/icons';

const styles = theme => ({
    contentLabel: {
        paddingLeft: theme.spacing.unit
    },
    icon: {
        color: theme.palette.font.alpha
    },
    chevronSvg: {
        verticalAlign: 'middle',
        color: theme.palette.text.disabled
    },
    button: {
        minWidth: 0
    }
});

export class Breadcrumb extends React.Component {
    render() {
        let {
            node, showLabel, classes, selectItem, display, hiddenParents, hiddenContents,
            openHiddenParents, openHiddenContents, handleClick, handleClose, mode
        } = this.props;
        if (display) {
            return (
                <Button
                    disableRipple
                    className={classes.button}
                    variant="ghost"
                    size="compact"
                    aria-haspopup="true"
                    aria-owns={'breadcrumbMenu_' + node.uuid}
                    onClick={() => selectItem(node.path)}
                >
                    {iconRenderer(node, classes.icon, !showLabel)}
                    {showLabel &&
                    <Typography noWrap variant="iota" data-cm-role="breadcrumb-name" classes={{root: classes.contentLabel}}>
                        {node.name}
                    </Typography>
                    }
                </Button>
            );
        }
        if (!_.isEmpty(hiddenParents) && _.find(hiddenParents, (parent, i) =>
            parent.uuid === node.uuid && i === hiddenParents.length - 1) !== undefined) {
            return (
                <React.Fragment>
                    <IconButton icon={<MoreHoriz className={classes.chevronSvg} data-sel-role="hidden-parents"/>}
                                onClick={e => handleClick(e, 'parent')}/>
                    <Menu
                        anchorEl={openHiddenParents}
                        open={Boolean(openHiddenParents)}
                        data-sel-role="hidden-parents-menu"
                        onClose={handleClose}
                    >
                        {hiddenParents.map(parent => {
                            return (
                                <MenuItem
                                    key={parent.uuid}
                                    disableRipple
                                    onClick={() => selectItem(mode, parent.path, {sub: false})}
                                >
                                    {iconRenderer(parent)}
                                    <Typography variant="iota"
                                                data-cm-role="breadcrumb-name"
                                                classes={{root: classes.contentLabel}}
                                    >
                                        {parent.name}
                                    </Typography>
                                </MenuItem>
                            );
                        })}
                    </Menu>
                    <ChevronRightIcon fontSize="small" classes={{root: classes.chevronSvg}}/>
                </React.Fragment>
            );
        }
        if (!_.isEmpty(hiddenContents) && _.find(hiddenContents, (content, i) =>
            content.uuid === node.uuid && i === hiddenContents.length - 1) !== undefined) {
            return (
                <React.Fragment>
                    <IconButton icon={<MoreHoriz className={classes.chevronSvg} data-sel-role="hidden-contents"/>}
                                onClick={e => handleClick(e, 'content')}/>
                    <Menu
                        anchorEl={openHiddenContents}
                        open={Boolean(openHiddenContents)}
                        data-sel-role="hidden-contents-menu"
                        onClose={handleClose}
                    >
                        {hiddenContents.map(content => {
                            return (
                                <MenuItem
                                    key={content.uuid}
                                    disableRipple
                                    onClick={() => selectItem(mode, content.path, {sub: false})}
                                >
                                    {iconRenderer(content)}
                                    <Typography variant="iota"
                                                data-cm-role="breadcrumb-name"
                                                classes={{root: classes.contentLabel}}
                                    >
                                        {content.name}
                                    </Typography>
                                </MenuItem>
                            );
                        })}

                    </Menu>
                    <ChevronRightIcon fontSize="small" classes={{root: classes.chevronSvg}}/>
                </React.Fragment>
            );
        }
        return null;
    }
}

Breadcrumb.propTypes = {
    classes: PropTypes.object.isRequired,
    selectItem: PropTypes.func.isRequired,
    node: PropTypes.object.isRequired,
    showLabel: PropTypes.bool.isRequired,
    display: PropTypes.bool.isRequired,
    hiddenParents: PropTypes.array.isRequired,
    hiddenContents: PropTypes.array.isRequired,
    openHiddenParents: PropTypes.object,
    openHiddenContents: PropTypes.object,
    handleClick: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired
};

export default compose(translate(), withStyles(styles))(Breadcrumb);
