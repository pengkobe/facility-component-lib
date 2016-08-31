var Class = require("../base/class.js");
var Base = require("../base/base.js");
var NXTComp = require("../base/nxtcomp.js");

var proto_tpl = __inline('_param-display.handlebars');

var _paramDisplay = Class.create({
    Extends: Base,
    constructor: function (properties) {
        this.id = NXTComp.getUid("_param-display");
        this.deviceId = this.deviceId || properties.deviceId || NXTComp.getUid("_param-display_Id");

        _paramDisplay.superclass.constructor.call(this, properties);

        this.setTemplate(properties);
    },
    deviceId: null,
    template: "",
    typeCode: "_paramDisplay",
    datacodes: [],
    /**
    * 设置模板
    */
    setTemplate: function (data) {
        this.datacodes = [];
        var params = [];
        var raw_params = data.params;
        for (var i = 0; i < raw_params.length; i++) {
            var temp = raw_params[i];
            var dcodes = [];
            for (var j = 0; j < temp.PointKey.length; j++) {
                dcodes.push({ datacode: temp.PointKey[j].split("_")[1] });
                this.datacodes.push(temp.PointKey[j].split("_")[1]);
            }

            params.push({ name: temp.Title, dcodes: dcodes });
        }
        var data = {
            id: this.typeCode + "_" + this.id,
            params: params
        };
        this.template = proto_tpl(data);
    },
    setDeviceStatus: function () {

    }
});

module.exports = _paramDisplay;
