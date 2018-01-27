(function(object){
    function isFunc(obj) {
        return typeof obj == 'function';
    }
    function initializeInput(input, triggers, onChange) {
        if (null === input) {
            return;
        }
        if (typeof input == 'string') {
            input = document.getElementById(input);
            if (!input) {
                input = document.querySelector(input);
            }
        } else if (typeof input == 'object' && typeof input[0] != 'undefined' && typeof input[0].value == 'string') {
            input = input[0];
        }
        var changed = function() {
            if (isFunc(onChange)) {
                onChange(this.value);
            }
        };
        if (typeof triggers == 'string') {
            triggers = [triggers];
        }
        for (var event in triggers) {
            input.removeEventListener(triggers[event], function(){});
            input.addEventListener(triggers[event], changed, false);
        }

        return input;
    }

    function TypAsync(options) {
        var me = this;
        var baseOpts = {
            input: null,
            timeout: 500, 
            processing: false,
            triggers: ['keyup', 'blur'],
            change: function(value) {
                me.change.call(me, value);
            }
        };
        if (typeof options != 'object') {
            options = {};
        }

        for (var opt in baseOpts) {
            if (typeof options[opt] == 'undefined') {
                options[opt] = baseOpts[opt];
            }
        }
        
        initializeInput(options.input, options.triggers, options.change);

        this.options = options;
        this.increment = 0;
        this.processing = false;
        this.oldValue = '';
        this.value = '';
        this.timeout = undefined;
        this._events = {
            change: function() {},
            empty: function() {},
            skip: function() {},
            process: function() {},
            complete: function() {},
            value: function(val) {
                return val;
            }
        };
    }

    TypAsync.prototype.on = function(event, callback) {
        var me = this;
        if (isFunc(callback) && isFunc(this._events[event])) {
            this._events[event] = function() {
                return callback.apply(me, arguments);
            };
        }

        return me;
    };

    TypAsync.prototype.change = function(value) {
        try {
            this._events.skip(value);
            clearTimeout(this.timeout);
        } catch(e){}
        var me = this;
        this.timeout = setTimeout(function() {
            me.value = me._events.value(typeof value == 'string' ? value : '');
            if ((me.increment < 1 || me.oldValue != '') && value == '') {
                me._events.empty();
            }
            switch (me.value) {
                case '':
                    me._events.skip(me.value);
                break;
                case me.oldValue:
                break;
                default:
                    if (!me.options.processing || (me.options.processing && !me.processing)) {
                        if (me.options.processing) {
                            me.processing = true;
                            me._events.process();
                        }
                        ++me.increment;
                        me._events.change(value, function() {
                            me.processing = false;
                            me._events.complete.call(me);
                        });
                    } else {
                        return me._events.skip(me.value);
                    }
                break;
            }
            me.oldValue = me.value;
        }, this.options.timeout);
    };

    object.TypAsync = TypAsync;
})(typeof module != 'undefined' && module.exports ? module.exports : window);