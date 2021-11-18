import React from 'react';
import {Button} from 'react-bootstrap';
import Fsm from "../../fsm-library/fsm.jsx";
import './Gear.css';
import LogService from "../../services/LogService.jsx";

const TRANSMISSION = {
    PARKING: 'PARKING',
    REVERSE: 'REVERSE',
    NEUTRAL: 'NEUTRAL',
    DRIVE: 'DRIVE'
}

class Gear extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            machine: new Fsm({
                initialState: TRANSMISSION.PARKING,
                states: {
                    PARKING: {
                        when: {
                            SHIFT_DOWN: () => {
                                return TRANSMISSION.REVERSE;
                            }
                        }
                    },
                    REVERSE: {
                        when: {
                            SHIFT_DOWN: () => TRANSMISSION.NEUTRAL,
                            SHIFT_UP: () => TRANSMISSION.PARKING
                        }
                    },
                    NEUTRAL: {
                        when: {
                            SHIFT_DOWN: () => TRANSMISSION.DRIVE,
                            SHIFT_UP: () => TRANSMISSION.REVERSE
                        }
                    },
                    DRIVE: {
                        when: {
                            SHIFT_UP: () => TRANSMISSION.NEUTRAL
                        }
                    }
                },
                stateChanged: this.stateChanged.bind(this)
            }),
            currentState: TRANSMISSION.PARKING,
            logs: []
        };

        this.shiftUp = this.shiftUp.bind(this);
        this.shiftDown = this.shiftDown.bind(this);
        this.deleteAllEvents = this.deleteAllEvents.bind(this);
    }

    componentDidMount() {
        this.fetchLogs();
    }

    render() {
        return <div data-testid="Gear" className="gear-container">
            <div className="gear-shift-container">
                <div className="transmission-container">
                    <span
                        className={`transmission p ${this.state.currentState === TRANSMISSION.PARKING ? 'active' : ''}`}>P</span>
                    <span
                        className={`transmission r ${this.state.currentState === TRANSMISSION.REVERSE ? 'active' : ''}`}>R</span>
                    <span
                        className={`transmission n ${this.state.currentState === TRANSMISSION.NEUTRAL ? 'active' : ''}`}>N</span>
                    <span
                        className={`transmission d ${this.state.currentState === TRANSMISSION.DRIVE ? 'active' : ''}`}>D</span>
                </div>
                <div className="shift-icons-container">
                    <i className="fas fa-caret-up shift-icon fa-7x" onClick={this.shiftUp}></i>
                    <i className="fas fa-caret-down shift-icon fa-7x" onClick={this.shiftDown}></i>
                </div>
            </div>
            <div className="events">
                <h3 className="events-title">Events <Button variant="link" onClick={this.deleteAllEvents}>Clear</Button>
                </h3>
                <ul className="events-list">
                    {this.state.logs.map(log => <li>{log}</li>)}
                </ul>
            </div>
        </div>
    }

    deleteAllEvents() {
        LogService.deleteLogs().then(() => this.fetchLogs());
    }

    shiftUp() {
        this.state.machine.dispatch('SHIFT_UP');
    }

    shiftDown() {
        this.state.machine.dispatch('SHIFT_DOWN');
    }

    stateChanged(oldState, newState) {
        LogService.saveLog(`State has changed from ${oldState} to ${newState}`)
            .then(() => this.fetchLogs());
        this.setState({currentState: newState});
    }

    fetchLogs() {
        LogService.getLogs().then(logs => this.setState(logs));
    }
}

export default Gear;
