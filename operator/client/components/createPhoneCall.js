import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import axios from 'axios'

import MapHolder from './mapHolder';

const openMapEvent = new CustomEvent("openMap");
const closeMapEvent = new CustomEvent("closeMap");

const axiosInstance = axios.create({
    baseURL: 'https://wll4mj4ekd.execute-api.eu-west-1.amazonaws.com/v1/',
    credentials: false
});

const PULL_RATE = 1000;
const MAX_RETRIES = 60;
const STATUS = {
    INIT: 'init',
    SENDING: 'SENDING',
    WAITING: 'waiting',
    OPENED: 'opened',
    REJECTED: 'rejected',
    CONNECTING: 'connecting',
    ERROR: 'error',
    TIMEOUT: 'timeout'
}
const buttonStyle = {
    minWidth: 190
}
const LOCK_STATUS = [STATUS.SENDING, STATUS.WAITING, STATUS.OPENED, STATUS.CONNECTING];

export default class CreatePhoneCall extends React.Component {
    constructor(props) {
        super(props);

        this.state = { phoneNumber: '+972', status: STATUS.INIT, disabledPhoneNumber: false, location: {} };
        window.phoneCallID = null;
        window.checkInterval = null;
        window.retriesCount = 0;
    }

    sendSMS = () => {
        let me = this;
        this.setState({ status: STATUS.SENDING }, () => {
            axiosInstance.post('/api/incident', { phone: this.state.phoneNumber }).then((response) => {
                window.phoneCallID = response.data.id;
                window.checkInterval = setInterval(() => me.checkStatus(), PULL_RATE);
            }).catch(() => {
                this.setState({ status: STATUS.ERROR });
            });
        });
    }

    checkStatus() {
        window.retriesCount++;
        
        if (window.retriesCount >= MAX_RETRIES) {
            clearInterval(window.checkInterval);
            this.setState({ status: STATUS.TIMEOUT });
            return;
        }

        axiosInstance.get('/api/incident/', { params: { id: window.phoneCallID } }).then((response) => {
            switch (response.data.status) {
                case 'location_waiting':
                    this.setState({ status: STATUS.WAITING });
                    break;
                case 'location_denied':
                    this.setState({ status: STATUS.REJECTED });
                    clearInterval(window.checkInterval);
                    break;
                case 'location_approved':
                    this.setState({ status: STATUS.OPENED, location: response.data.location });
                    clearInterval(window.checkInterval);
                    break;
            }
        }).catch(() => {
            this.setState({ status: STATUS.ERROR });
            clearInterval(window.checkInterval);
        });
    }

    cancelWhileRunning = () => {
        if (window.checkInterval) {
            clearInterval(window.checkInterval);
            window.checkInterval = null;
        }

        this.setState({ status: STATUS.INIT });
        window.dispatchEvent(closeMapEvent);
    }

    handleChange = (event) => {
        this.setState({
            phoneNumber: event.target.value
        });
    };

    componentWillUnmount() {
        if (window.checkInterval) {
            clearInterval(window.checkInterval);
            window.checkInterval = null;
        }
    }

    render() {
        let button, map;
        switch (this.state.status) {
            case STATUS.INIT:
                button = <RaisedButton label="Send Link" primary={true} onClick={this.sendSMS} buttonStyle={buttonStyle} />;
                map = undefined;
                break;
            case STATUS.SENDING:
                button = <RaisedButton label="Cancel - Sending" secondary={true} icon={<CircularProgress size={25} />} onClick={this.cancelWhileRunning} />;
                map = undefined;
                break;
            case STATUS.WAITING:
                button = <RaisedButton label="Cancel - Waiting" secondary={true} icon={<CircularProgress size={25} />} onClick={this.cancelWhileRunning} />;
                map = undefined;
                break;
            case STATUS.OPENED:
                button = <RaisedButton label="Close" primary={true} onClick={this.cancelWhileRunning} buttonStyle={buttonStyle} />;
                map = <MapHolder location={this.state.location} />;
                window.dispatchEvent(openMapEvent);
                break;
            case STATUS.REJECTED:
                button = <RaisedButton label="Rejected" secondary={true} onClick={this.sendSMS} buttonStyle={buttonStyle} />;
                map = undefined;
                break;
            case STATUS.CONNECTING:
                button = <RaisedButton label="Connecting" backgroundColor={"#AED581"} buttonStyle={buttonStyle} />;
                map = undefined;
                break;
            case STATUS.TIMEOUT:
                button = <RaisedButton label="Timeout - Retry" secondary={true} onClick={this.sendSMS} buttonStyle={buttonStyle} />;
                map = undefined;
                break;
            case STATUS.ERROR:
                button = <RaisedButton label="Error" secondary={true} onClick={this.sendSMS} buttonStyle={buttonStyle} />;
                map = undefined;
                break;
            default:
                button = <RaisedButton label="Error" secondary={true} onClick={this.sendSMS} buttonStyle={buttonStyle} />;
                map = undefined;
                break;
        }

        return <div>
            <Paper zDepth={1}>
                <TextField
                    style={{ marginRight: 10, marginLeft: 10, width: 280 }}
                    value={this.state.phoneNumber}
                    onChange={this.handleChange}
                    disabled={LOCK_STATUS.includes(this.state.status)}
                    floatingLabelText="Enter a phone number"
                />
                {button}
                {map}
            </Paper>
        </div>
    }
}