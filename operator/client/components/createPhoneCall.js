import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import axios from 'axios'


const PULL_RATE = 5000;
const STATUS = {
    INIT: 'init',
    WAITING: 'waiting',
    OPENED: 'opened',
    REJECTED: 'rejected',
    CONNECTING: 'connecting',
    ERROR: 'error',
}

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { phoneNumber: '', status: STATUS.INIT };
        this.phoneCallID = null;
        window.checkInterval = null;
    }

    sendSMS = () => {
        let me = this;
        this.setState({ status: STATUS.WAITING }, () => {
            axios.post('/api/incident', { phone: this.state.phoneNumber }).then((response) => {
                window.phoneCallID = response.id; // TODO
                window.checkInterval = setInterval(() => me.checkStatus(), PULL_RATE);
            }).catch(() => {
                me.setState({ status: STATUS.ERROR });
            });
        });
    }

    checkStatus() {
        axios.get('/api/incident/' + window.phoneCallID).then((response) => {
            switch (response.status) {
                case 'location_waiting':
                    me.setState({ status: STATUS.WAITING });
                    break;
                case 'location_denied':
                    me.setState({ status: STATUS.REJECTED });
                    break;
                case 'location_approved':
                    me.setState({ status: STATUS.OPENED });
                    window.open('/showMap?id=' + window.phoneCallID);
                    clearInterval(window.checkInterval);
                    break;
            }
        }).catch(() => {
            me.setState({ status: STATUS.ERROR });
            clearInterval(window.checkInterval);
        });
    }

    handleChange = (event) => {
        this.setState({
            phoneNumber: event.target.value
        });
    };

    componentWillUnmount() {
        if(window.checkInterval) {
            clearInterval(window.checkInterval);
            window.checkInterval = null;
        }
    }

    render() {
        let button;
        switch (this.state.status) {
            case STATUS.INIT:
                button = <RaisedButton label="Send Link" primary={true} onClick={this.sendSMS} />;
                break;
            case STATUS.WAITING:
                button = <RaisedButton label="Cancel - Sending" secondary={true} icon={<CircularProgress size={25} />} />;
                break;
            case STATUS.OPENED:
                button = <RaisedButton label="Cancel - Opened" secondary={true} icon={<CircularProgress size={25} />} />;
                break;
            case STATUS.REJECTED:
                button = <RaisedButton label="Rejected" secondary={true} onClick={this.sendSMS} />;
                break;
            case STATUS.CONNECTING:
                button = <RaisedButton label="Connecting" backgroundColor={"#AED581"} />;
                break;
            case STATUS.ERROR:
                button = <RaisedButton label="Error" secondary={true} onClick={this.sendSMS} />;
                break;
            default:
                button = <RaisedButton label="Error" secondary={true} onClick={this.sendSMS} />;
                break;
        }

        return <div>
            <TextField
                value={this.state.phoneNumber}
                onChange={this.handleChange}
                floatingLabelText="Enter a phone number"
            />
            {button}
        </div>
    }
}