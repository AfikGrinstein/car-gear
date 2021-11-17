class Fsm {

    constructor(config) {
        this.config = config;
        this._currentState = this.config.initialState;
    }

    get currentState() {
        return this._currentState;
    }

    dispatch(eventName, payload = null) {
        const actions = this.config.states[this._currentState].when;
        if (eventName in actions) { // event exist for this state
            const nextState = actions[eventName].call(this, payload);
            if (nextState) {
                // Validate if state exists
                this.setState(nextState);
            }
        } else {
            console.log(`Event ${eventName} is not exist for state ${this._currentState}`);
        }
    }

    setState(state) {
        this.config.stateChanged.call(this, this._currentState, state);
        this._currentState = state;
    }
}

export default Fsm;
