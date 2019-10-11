class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.currentState = config.initial;
        this.indexOfHistory = 0;
        this.history = [{'0': 'normal'}];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        let allStates = this.config.states;

        if (state in allStates) {
            this.currentState = state;
            this.indexOfHistory = this.history.length;
            this.history.push({[this.indexOfHistory]: state});
        } else new Throw('State isn\'t exist');
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let allStates = this.config.states;
        let eventsForCurrentState = allStates[this.currentState].transitions;

        if (event in eventsForCurrentState) {
            if (this.indexOfHistory === this.history.length - 1 ) {
                this.currentState = eventsForCurrentState[event];
                ++this.indexOfHistory;
                this.history.push({[this.indexOfHistory]: this.currentState});
            } else {
                ++this.indexOfHistory;
                this.currentState = this.history[this.indexOfHistory][this.indexOfHistory];
            }
        } else new Throw('Event in current state isn\'t exist');
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.config.initial;
        this.history.push({[++this.indexOfHistory]: this.currentState});
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let allStates = this.config.states;

        if (!event) {
            return Object.keys(allStates);
        } else {
            return Object.keys(allStates).filter((item) =>
                allStates[item].transitions[event] !== undefined
            )
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.indexOfHistory > 0) {
            --this.indexOfHistory;
            this.currentState = this.history[this.indexOfHistory][this.indexOfHistory];
            return true;
        }
        return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.indexOfHistory < this.history.length - 1) {
            ++this.indexOfHistory;
            this.currentState = this.history[this.indexOfHistory][this.indexOfHistory];
            return true;
        }
        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [{'0': 'normal'}];
        this.indexOfHistory = 0;
    }

}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
