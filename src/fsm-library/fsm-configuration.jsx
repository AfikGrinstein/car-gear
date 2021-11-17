export interface FsmConfiguration {
    /**
     * Initial state
     */
    initialState: string;
    /**
     * Key - State name<br>
     * Value - State options
     */
    states: { [stateName: string]: StateActions };
    /**
     * Event for notified when moving between states
     * @param oldState - Old state
     * @param newState - New state
     */
    stateChanged: (oldState: string, newState: string) => void;
}

interface StateActions {
    /**
     * Key - State name<br>
     * Value - A function that return the next state base on the current state and payload.<br>
     * Returning the name of the state you want to move to or null for staying in the current state
     */
    when: { [eventName: string]: (payload?: any) => string };
}
