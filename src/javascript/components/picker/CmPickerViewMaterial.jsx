import React from 'react';
import {
    IconButton,
    List,
    ListItem,
    Button,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    SvgIcon,
    withStyles,
    withTheme
} from '@material-ui/core';
import {KeyboardArrowDown, KeyboardArrowRight} from '@material-ui/icons';
import PropTypes from 'prop-types';
import defaultIconRenderer from './iconRenderer';
import {lodash as _} from "lodash";
import UploadWrapperComponent from '../fileupload/UploadTransformComponent';

let styles = (theme) => ({
    root: {
        position: "relative",
        padding: '0 !important',
        width: '100%'
    },
    loading: {
        opacity: 0.8
    },
    listItemSelected: {
        background: theme.palette.primary.main,
        color:  theme.palette.primary.contrastText +'!important'
    },
    listItemSelectedDeletion: {
        background: theme.palette.error.dark,
        color: theme.palette.primary.contrastText +'!important',
    },
    listItem: {
        fontFamily: '"Nunito sans", sans-serif',
        backgroundPosition: 'left 10px center',
        backgroundRepeat: 'no-repeat',
        padding: '0 !important',
        fontWeight: 300,
        fontSize: '0.928rem',
        whiteSpace: 'nowrap',
        color: '#5E6565'
    },
    listItemDeletion:{
        fontFamily: '"Nunito sans", sans-serif',
        backgroundPosition: 'left 10px center',
        backgroundRepeat: 'no-repeat',
        padding: '0 !important',
        fontWeight: 300,
        fontSize: '0.928rem',
        whiteSpace: 'nowrap',
        color: '#5E6565',
        textDecoration: 'line-through',
    },
    listItemLabel: {
        userSelect: 'none',
        fontWeight: '300',
        fontSize: '0.928rem',
        padding: '0 !important',
        '& h3': {
            fontSize: '0.875rem',
            color: '#5E6565',
            fontWeight: '100'
        }
    },
    listItemToggle: {
        marginRight: '0px',
        borderRadius: '0',
        width: 'auto'
    },
    listItemNodeTypeIcon: {
        marginRight: '5px',
        color: '#5c6164'
    },
    selectedText: {
        color: 'whitesmoke !important'
    },
    loadingContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 999
    },
    toggleUnSelected: {
        color: '#00a0e3'
    },
    toggleSelected: {
        color: 'whitesmoke'
    },
    buttonContainer: {
        '&:hover': {
            backgroundColor: 'transparent'
        },
        minHeight: 20,
        minWidth: 18
    },
    triangle: {
        width: 0,
        height: 0,
        padding: 0,
        borderStyle: 'solid',
        borderWidth: '4px 0 4px 6.5px',
        borderColor: 'transparent transparent transparent #5c6164'
    },
    triangle_bottom: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '6.5px 4px 0 4px',
        borderColor: '#5c6164 transparent transparent transparent'
    },
    test: {
        fontFamily: '"Nunito sans", sans-serif',
        backgroundSize: '20px',
        backgroundPosition: 'left 10px center',
        backgroundRepeat: 'no-repeat',
        fontWeight: 300,
        fontSize: '0.928rem',
        whiteSpace: 'nowrap',
        color: '#F5F5F5'
    },
    treeEntry: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer !important'
    }
});

class CmPickerViewMaterial extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hover: false
        }
    }

    hoverOn = (path) => {
        this.setState({ hover: path });
    };

    hoverOff = () => {
        this.setState({ hover: false });
    };

    render() {

        let {classes, pickerEntries, onOpenItem, onSelectItem, textRenderer, actionsRenderer, iconRenderer, loading} = this.props;

        //Sorts entries that are folder types
        let sortedEntries = this.sortFoldersAlphabetical(pickerEntries);

        return <div className={classes.root}>
            {loading &&
                <div className={classes.loadingContainer}/>
            }
            <List disablePadding classes={{root: loading ? (classes.root + ' ' + classes.loading) : classes.root}}>
                {
                    sortedEntries.map((entry) => {
                        let hasDeletionMixin = false;
                        entry.node.mixinTypes.map((mixin) =>{
                            if(mixin.displayName === 'markedForDeletion' || mixin.displayName === 'markedForDeletionRoot'){
                                hasDeletionMixin = true;
                            }
                        });
                        let selectionClass = hasDeletionMixin ? classes.listItemSelectedDeletion : classes.listItemSelected;
                        let itemClass = hasDeletionMixin ? classes.listItemDeletion : classes.listItem;
                        return <UploadWrapperComponent
                            uploadTargetComponent={ ListItem }
                            uploadPath={ entry.path }
                            onMouseEnter={() => this.hoverOn(entry.path)}
                            onClick={() => this.hoverOn(entry.path)}
                            onMouseLeave={this.hoverOff}
                            onDoubleClick={() => onOpenItem(entry.path, !entry.open)}
                            key={entry.path}
                            divider={true}
                            className={entry.selected ? (itemClass + ' ' + selectionClass) : itemClass}
                            data-jrm-role={'picker-item'}
                        >
                            <div
                                className={entry.selected ? (classes.listItemToggle + ' ' + classes.selectedText) : classes.listItemToggle}
                                style={{
                                    paddingLeft: (entry.depth + 0) * 20,
                                    opacity: (entry.openable && entry.hasChildren ? 1 : 0)
                                }}
                            >
                                <Button
                                    className={classes.buttonContainer}
                                    onClick={(event) => {
                                        onOpenItem(entry.path, !entry.open);
                                        event.stopPropagation()
                                    }}
                                    disabled={!(entry.openable && entry.hasChildren)}
                                    data-jrm-role={'picker-item-toggle'}
                                    data-jrm-state={entry.open ? 'open' : 'closed'}
                                >
                                    <div className={entry.open ? (classes.triangle_bottom) : classes.triangle}/>
                                </Button>
                            </div>
                            <span className={classes.treeEntry}
                                  onClick={() => entry.selectable ? onSelectItem(entry.path, !entry.selected) : null}>
                                <ListItemIcon
                                    className={entry.selected ? (classes.listItemNodeTypeIcon + ' ' + classes.selectedText) : classes.listItemNodeTypeIcon}>
                                    {iconRenderer ? iconRenderer(entry) : defaultIconRenderer(entry)}
                                </ListItemIcon>
                                <ListItemText
                                    inset
                                    classes={entry.selected ? {
                                        root: classes.listItemLabel,
                                        primary: classes.selectedText
                                    } : {
                                        root: classes.listItemLabel
                                    }}
                                    disableTypography={true}
                                    primary={textRenderer ? textRenderer(entry) : entry.name}
                                    data-jrm-role={'picker-item-text'}
                                />
                            </span>
                            {actionsRenderer &&
                            <ListItemText>
                                {this.state.hover === entry.path && actionsRenderer(entry)}
                            </ListItemText>
                            }
                        </UploadWrapperComponent>
                    })
                }
            </List>
        </div>;
    }

    sortFoldersAlphabetical(pickerEntries) {
        if (pickerEntries.length !== 0 && pickerEntries[0] && (pickerEntries[0].node.primaryNodeType.name === "jnt:contentFolder" || pickerEntries[0].node.primaryNodeType.name === "jnt:folder")) {
            const rootNode = this.reconstructNodeHierarchy(JSON.parse(JSON.stringify(pickerEntries)));
            return this.sortAndFlatten(rootNode);
        }
        else {
            return pickerEntries;
        }
    }

    reconstructNodeHierarchy(pickerEntriesSortedByPath) {
        const hierarchyStack = [];
        //Add root node to stack
        hierarchyStack.push(pickerEntriesSortedByPath.splice(0, 1)[0]);

        while(pickerEntriesSortedByPath.length !== 0 && hierarchyStack.length !== 0) {
            const currentPickerEntry = pickerEntriesSortedByPath[0];
            const top = hierarchyStack[hierarchyStack.length - 1];

            //Add children to top of the stack if current entry is child of top
            if (currentPickerEntry.path.indexOf(top.path) !== -1 && currentPickerEntry.path.replace(top.path, "")[0] === "/") {
                if (!top.children) {
                    top.children = [];
                }
                top.children.push(currentPickerEntry);
                hierarchyStack.push(currentPickerEntry);
                pickerEntriesSortedByPath.splice(0, 1);
            }
            else {
                hierarchyStack.pop();
            }
        }
        return hierarchyStack[0];
    }

    sortAndFlatten(rootNode) {
        const flatArray = [];

        DFS(rootNode);
        function DFS(node) {
            flatArray.push(node);
            if (node.children) {
                node.children.sort(function (a, b) {
                    const A = a.node.displayName.toLocaleLowerCase();
                    const B = b.node.displayName.toLocaleLowerCase();
                    if (A < B) {
                        return -1;
                    }
                    if (A > B) {
                        return 1;
                    }
                    return 0;
                });

                for(let i = 0; i < node.children.length; i++) {
                    DFS(node.children[i]);
                }
            }
        }
        return flatArray;
    }
}

CmPickerViewMaterial.propTypes = {
    pickerEntries: PropTypes.array.isRequired,
    onSelectItem: PropTypes.func,
    onOpenItem: PropTypes.func,
    textRenderer: PropTypes.func
};

CmPickerViewMaterial = withTheme()(withStyles(styles, {name: "DxPickerViewMaterial"})(CmPickerViewMaterial));

export {CmPickerViewMaterial};
