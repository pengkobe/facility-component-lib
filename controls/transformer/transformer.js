var Class = require("../base/Class.js");
var Base = require("../base/Base.js");

var Bird = Class.create({
    Extends: Base,
    
    constructor: function (opts) {
        this.id = opts.id;
    },
    getParam: function () {
        console.log('getParam');
    },
    setValue: function () {
        console.log('setValue');
    },
    getTpl: function () {
        console.log('getTpl');
    }
});