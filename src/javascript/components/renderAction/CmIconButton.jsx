import React from 'react';
import {withStyles, Button} from "@material-ui/core";
import {compose} from "react-apollo/index";
import {translate} from "react-i18next";
import {MoreHoriz, MoreVert} from "@material-ui/icons";

const styles = theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        transition: "left 0.5s ease 0s",
    },
    cmIcon: {
        color: theme.palette.primary.contrastText
    },
    button: {
        padding: 0,
        margin: '0!important'
    },
    VerticalList: {
        color: theme.palette.background.default,
        paddingTop: '6px!important',
    },
    VerticalPreview: {
        color: theme.palette.background.default,
    },
    buttonFooter: {
        padding: 0,
        margin: '0!important',
    }
});

class CmIconButton extends React.Component {

    //listTable is an attribute to know if it's a button used into list table (true) or in preview (false)
    render() {
        const {classes, onClick, labelKey, t, footer, children, cmRole, className, disableRipple, horizontal, listTable} = this.props;
        let childrenCount = React.Children.count(children);
        if (horizontal) {
            return (
                <Button className={
                    listTable ? classes.buttonFooter + " " + className + " " + classes.VerticalPreview :
                        classes.buttonFooter + " " + className + " " + classes.VerticalList
                }
                        disableRipple={disableRipple ? disableRipple : false} aria-haspopup="true"
                        onClick={(event) => onClick(event)} data-cm-role={cmRole}>
                    {childrenCount > 0
                        ? <React.Fragment>{children}</React.Fragment>
                        : <MoreVert/>
                    }
                </Button>
            )
        }
        else {
            return (
                <Button className={classes.button + " " + className}
                        disableRipple={disableRipple ? disableRipple : false} aria-haspopup="true"
                        onClick={(event) => onClick(event)} data-cm-role={cmRole}>
                    {childrenCount > 0
                        ? <React.Fragment>{children}</React.Fragment>
                        : <MoreHoriz/>
                    }
                </Button>
            )
        }
    }
}

CmIconButton = compose(
    translate(),
    withStyles(styles, { withTheme: true })
)(CmIconButton);

export default CmIconButton;

