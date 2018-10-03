import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {
    blue700, cyan700, pinkA200, grey100, grey400, grey500
} from 'material-ui/styles/colors';

import CreatePhoneCall from './createPhoneCall'

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blue700,
        primary2Color: cyan700,
        primary3Color: grey400,
        accent1Color: pinkA200,
        accent2Color: grey100,
        accent3Color: grey500
    }
});

export default class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = { drawerOpen: false };
    }
    handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

    handleClose = () => this.setState({ drawerOpen: false });

    render() {
        return <MuiThemeProvider muiTheme={muiTheme}>
            <div>
                <div>
                    <CreatePhoneCall />
                </div>
            </div>
        </MuiThemeProvider>
    }
}