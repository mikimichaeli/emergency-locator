import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class HomePage extends React.Component {
    render() {
        let button = <RaisedButton label="Log In" secondary={true} href="/login" />;

        return <div>
            <h1>Home page!</h1>
            {button}
        </div>
    }
}