var customEvent = function() {
    this.actions = [];
    this.next = function(data) {
        this.actions.forEach(action => {
            action(data);
        });
    }
    this.subscribe = function(action) {
        this.actions.push(action);
    }
}