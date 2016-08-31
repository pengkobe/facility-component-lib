var Class = require("../base/class.js");
var Base = require("../base/base.js");
var NXTComp = require("../base/nxtcomp.js");

var proto_tpl = __inline('transformer.handlebars');

var Transformer = Class.create({
    Extends: Base,
    constructor: function (properties) {
        this.id = NXTComp.getUid("Transformer");
        this.deviceName = this.deviceName || properties.deviceName;

        this.deviceId = this.deviceId || properties.deviceId || NXTComp.getUid("Transformer_deviceId");
        properties.type = this.type || properties.type;

        Transformer.superclass.constructor.call(this, properties);

        this.setTemplate(properties);
    },
    deviceId: null,
    deviceName: null,
    template: "",
    // 控件类型
    typeCode: 1,
    typeName: '变压器',
    datacodes: [1, 47,48,49, 5],
     //状态图片
    state:{
        // 停止
        "0":__uri('./img/stop.png'),
        // 运行
        "1":__uri('./img/run.png'),
    },

    /**
    * 设置模板
    */
    setTemplate: function (data) {
        var data = {
            id: this.typeCode + "_" + this.id,
            deviceName:this.deviceName,
            img: __uri('./img/stop.png')
        };
        this.template = proto_tpl(data);
    }
});

module.exports = Transformer;
