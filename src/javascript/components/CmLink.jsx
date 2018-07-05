import React from "react";
import PropTypes from 'prop-types';
import CmRouter from "./CmRouter";

class CmLink extends React.Component {

    static propTypes = {
        goto: PropTypes.func,
        to: PropTypes.string.isRequired,
    };

    render() {
        const { to, params } = this.props;
        return (<CmRouter render={({goto}) => (<a href={'#'}{...this.props} onClick={() => goto(to, params)}/>)}/>)
    }
}

export default CmLink;

