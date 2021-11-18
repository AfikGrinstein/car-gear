import React from 'react';
import {Button} from 'react-bootstrap';
import Fsm from "../../fsm-library/fsm.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import './Gear.css';
import LogService from "../../services/LogService.jsx";

class Gear extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            machine: new Fsm({
                initialState: 'PARKING',
                states: {
                    PARKING: {
                        when: {
                            SHIFT_DOWN: () => {
                                return 'REVERSE';
                            }
                        }
                    },
                    REVERSE: {
                        when: {
                            SHIFT_DOWN: () => 'NEUTRAL',
                            SHIFT_UP: () => 'PARKING'
                        }
                    },
                    NEUTRAL: {
                        when: {
                            SHIFT_DOWN: () => 'DRIVE',
                            SHIFT_UP: () => 'REVERSE'
                        }
                    },
                    DRIVE: {
                        when: {
                            SHIFT_UP: () => 'NEUTRAL'
                        }
                    }
                },
                stateChanged: this.stateChanged.bind(this)
            }),
            currentState: 'PARKING',
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
                    <span className={`transmission p ${this.state.currentState === 'PARKING' ? 'active': ''}`}>P</span>
                    <span className={`transmission r ${this.state.currentState === 'REVERSE' ? 'active': ''}`}>R</span>
                    <span className={`transmission n ${this.state.currentState === 'NEUTRAL' ? 'active': ''}`}>N</span>
                    <span className={`transmission d ${this.state.currentState === 'DRIVE' ? 'active': ''}`}>D</span>
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
