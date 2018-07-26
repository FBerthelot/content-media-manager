import React from "react";
import PropTypes from "prop-types";
import {Button, Menu, MenuItem} from "@material-ui/core";
import styled from "styled-components/dist/styled-components";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Folder from '@material-ui/icons/Folder';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {PageIcon} from '@jahia/icons';
import { withStyles } from '@material-ui/core/styles';
import * as _ from 'lodash';

const styles = theme => ({
    root: {
        color: theme.palette.text.primary,
    },
    menuItemHeader: {
        display: "inline-block",
        outline: "none"
    },
    menuItem: {
        width: "100%",
        display: "inline-block",
        '&:hover': {
            backgroundColor: "#e3e1e1 !important",
        },
    },
    menuButton: {
        '&:hover': {
            backgroundColor: "transparent !important",
        },
    },
    contentIcon: {
        paddingRight: "10px"
    },
    chevronIcon: {
        verticalAlign: "bottom",
        position: "relative",
        bottom: "6px"
    },
    menu: {
        background: 'red'
    }
});

const MenuItemContainer = styled.div`
    width:100%;
    outline: none;
`;
const MenuItemLabel = styled.div`
    bottom: 7px;
    display: inline;
    position: relative;
    `;
class BreadcrumbDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.addMenuExitListener = this.addMenuExitListener.bind(this);
        this.onMenuButtonActivatorEnter = this.onMenuButtonActivatorEnter.bind(this);
        this.onMenuExit = this.onMenuExit.bind(this);
        this.onMenuItemSelected = this.onMenuItemSelected.bind(this);

        this.menu = React.createRef();
        this.anchorButton = React.createRef();

        this.state = {
            menuActive: false,
            anchorPosition: {
                top: 5,
                left: 50
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let {nodes} = nextProps;
        let anchorEl = document.getElementById("menuToggleButton_" + nodes.uuid);
        if (anchorEl != null) {
            let anchorElPosition = anchorEl.getBoundingClientRect();
            return {
                anchorPosition: {
                    top: anchorElPosition.top - 5,
                    left: anchorElPosition.left
                }
            }
        }
        return {}
    }

    componentDidMount() {
        let {nodes} = this.props;
        let position = document.getElementById("menuToggleButton_" + nodes.uuid).getBoundingClientRect();
        this.setState({
            anchorPosition: {
                top: position.top - 5,
                left: position.left
            }
        });
    }

    addMenuExitListener() {
        let {nodes} = this.props;
        setTimeout(() => {
            let backdropEl = document.getElementById("breadcrumbMenu_" + nodes.uuid).children[0];
            //backdrop
            backdropEl.addEventListener("mouseover", this.onMenuExit);
        }, 50);

    }

    onMenuExit(event) {
        setTimeout(() => {
            this.setState((prevState, props) => ({
                menuActive: false,
            }));
        }, 100);
    }

    onMenuButtonActivatorEnter(event) {
        this.setState({menuActive: true, menuEntered: false});
    };

    onMenuItemSelected(event, path) {
        this.props.handleSelect(path);
        this.onMenuExit(event);
    }

    generateMenu(nodes) {
        let {classes, type} = this.props;
        if (nodes.siblings.length > 1) {
            return <span>
                <MenuItemContainer key={nodes.uuid}>
                    <ArrowDropDown className={classes.chevronIcon}/>
                    <MenuItem className={classes.menuItemHeader}
                              disableRipple={true}
                              onClick={(event) => {event.preventDefault()}}>
                        {nodes.name}
                    </MenuItem>
                </MenuItemContainer>
                {nodes.siblings.map((node, i) => {
                    return <MenuItemContainer key={node.uuid}>
                        <MenuItem className={classes.menuItem}
                                 onClick={(event) => this.onMenuItemSelected(event, node.path, type)}>
                            {this.renderIcon(node)}
                            <MenuItemLabel>{node.name}</MenuItemLabel>
                        </MenuItem>
                    </MenuItemContainer>
                })}
            </span>
        }
        return null;
    }

    generateMenuButton(nodes) {
        let {classes, type} = this.props;
        if (nodes.siblings.length > 1) {
            return <Button
                id={"menuToggleButton_" + nodes.uuid}
                ref={this.anchorButton}
                className={classes.menuButton}
                disableRipple={true}
                aria-owns={"breadcrumbMenu_" + nodes.uuid}
                aria-haspopup="true"
                onMouseEnter={this.onMenuButtonActivatorEnter}>
                {this.renderIcon(nodes, type)}
                {nodes.name}
            </Button>
        } else {
            return <Button
                id={"menuToggleButton_" + nodes.uuid}
                ref={this.anchorButton}
                className={classes.menuButton}
                disableRipple={true}
                aria-owns={"breadcrumbMenu_" + nodes.uuid}
                aria-haspopup="true"
                onClick={() => this.props.handleSelect(nodes.siblings[0].path)}>
                {this.renderIcon(nodes, type)}
                {nodes.name}
            </Button>
        }
    }

    renderIcon(node, type) {
        let {classes} = this.props;
        switch(node.type) {
            case "jnt:virtualsite" :
                switch (type) {
                    case "pages" :
                    case "files" :
                        return <PageIcon className={classes.contentIcon}/>;
                    case "contents" :
                        return <Folder className={classes.contentIcon}/>
                }
            case "jnt:folder":
            case "jnt:contentFolder":
                return <Folder className={classes.contentIcon}/>;
            case "jnt:page" :
            default:
                return <PageIcon className={classes.contentIcon}/>;
        }
    }

    render() {
        let {menuActive, anchorPosition} = this.state;
        let {nodes} = this.props;
        return (<span ref={this.menu} id={"breadcrumbSpan_" + nodes.uuid}>
            {this.generateMenuButton(nodes)}
            <Menu disableAutoFocusItem={true}
                  container={this.menu.current}
                  anchorPosition={anchorPosition}
                  key={nodes.uuid}
                  id={"breadcrumbMenu_" + nodes.uuid}
                  anchorReference={"anchorPosition"}
                  open={menuActive}
                  onEnter={this.addMenuExitListener}>
                {this.generateMenu(nodes)}
            </Menu>
        </span>)
    }
}

const StyledBreadcrumbDisplay = withStyles(styles)(BreadcrumbDisplay);

class Breadcrumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbs: []
        }
    }

    componentDidMount() {
        this.setState({
            breadcrumbs: Breadcrumb.parseEntries(this.props)
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            breadcrumbs: Breadcrumb.parseEntries(nextProps)
        };
    }

    render() {
        let {path, link, type, classes} = this.props;
        let {breadcrumbs} = this.state;
        return (<div>
            {breadcrumbs.map((breadcrumb, i) => {
               return <span key={breadcrumb.uuid}>
                    <StyledBreadcrumbDisplay
                        id={breadcrumb.uuid}
                        handleSelect={this.props.handleSelect}
                        nodes={breadcrumb}
                        path={path}
                        link={link}
                        type={type}/>
                   {i < breadcrumbs.length-1 ? <ChevronRightIcon className={classes.chevronIcon}/> : null}
                   </span>
            })}
        </div>)
    }

    static parseEntries(props) {
        let {pickerEntries:entries, path:selectedPath, type, rootLabel} = props;
        //Process these nodes
        let breadcrumbs = [];
        let selectedPathParts = selectedPath.replace("/sites/", "").split("/");
        for (let i in entries) {
            let entry =  entries[i];
            let entryPathParts = entry.path.replace("/sites/", "").split("/");
            if (entryPathParts.length > selectedPathParts.length) {
                //skip, our selections does not go this deep.
                continue;
            }
            //Verify this is the same path along the tree that is currently selected.
            //We are checking parent of current entry
            let parentIndex = entryPathParts.length -2;

            if (entryPathParts[parentIndex] !== undefined && selectedPathParts[parentIndex] !== entryPathParts[parentIndex]) {
                //This is a different path, we will skip it as it is not part of our current breadcrumb!
                continue;
            }
            let breadcrumb = breadcrumbs[entryPathParts.length-1];
            if (breadcrumb === undefined) {
                //Start new object, we are at a deeper level then before.
                breadcrumb = {};
                breadcrumb.name = breadcrumbs.length === 0 ? rootLabel : entry.node.displayName;
                breadcrumb.uuid = entry.node.uuid;
                breadcrumb.type = entry.node.primaryNodeType.name;
                breadcrumb.siblings = [];
            }
            //Add sibling to list (including first entry)
            let sibling = {
                uuid: entry.node.uuid,
                name: entry.node.displayName,
                path: entry.path,
                type: entry.node.primaryNodeType.name
            };
            breadcrumb.siblings.push(sibling);
            //If this path is the selected path, then update root breadcrumb with this entries information.
            if (selectedPathParts.slice(0, entryPathParts.length).join("/") === entryPathParts.join("/")) {
                breadcrumb.name = breadcrumbs.length === 0 ? rootLabel : entry.node.displayName;
                breadcrumb.uuid = entry.node.uuid;
                breadcrumb.type = entry.node.primaryNodeType.name;
            }
            breadcrumbs[entryPathParts.length-1] = breadcrumb;
        }
        return breadcrumbs;
    }
 }

Breadcrumb.propTypes = {
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    dxContext: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired,
    rootLabel: PropTypes.string
};
export default withStyles(styles)(Breadcrumb);