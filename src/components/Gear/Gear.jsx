import React from 'react';
import {Button} from 'react-bootstrap';
import Fsm from "../../fsm-library/fsm.jsx";
import './Gear.css';
import LogService from "../../services/LogService";

class Gear extends React.Component {
    state = {machine: null, currentState: null, logs: []};

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
            currentState: 'PARKING'
        };

        this.shiftUp = this.shiftUp.bind(this);
        this.shiftDown = this.shiftDown.bind(this);
    }

    componentDidMount() {
        this.fetchLogs();
    }

    render() {
        return <div data-testid="Gear">
            <Button variant="outline-primary" onClick={this.shiftUp}>UP</Button>
            <Button variant="outline-primary" onClick={this.shiftDown}>DOWN</Button>

            <div className="mt-4">
                <span className="form-label">Current state: <span
                    className="state-text">{this.state.currentState}</span></span>
            </div>

            <ul className="mt-5">
                ({this.state.logs.map(log => <li>{log}</li>)})
            </ul>
        </div>
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
