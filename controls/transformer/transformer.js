var Class = require("../base/class.js");
var Base = require("../base/base.js");
var NXTComp = require("../base/nxtcomp.js");

var proto_tpl = __inline('transformer.handlebars');

var Transformer = Class.create({
    Extends: Base,
    constructor: function (properties) {
        this.id = this.id || properties.id || NXTComp.getUid("Transformer");
        this.deviceId = this.deviceId || properties.deviceId || NXTComp.getUid("Transformer_deviceId");
        properties.type = this.type || properties.type;

        Transformer.superclass.constructor.call(this, properties);

        this.setTemplate(properties);
    },
    deviceId:null,
    template: "",
    // 控件类型
    typeCode: 1,
    typeName: '变压器',
    datacodes: [1, 2, 3, 4, 5],

    /**
    * 设置模板
    */
    setTemplate: function (data) {
         var data = {
             id:this.id,
             img: __uri('./img/green.png')
         };
         this.template = proto_tpl(data);
    },
    /**
     * TODO:做一个公用的
     * 设置值
     */
    setData: function (data) {
        // deviceName
        for(var i= 0; i<data.Data.length; i++){
             $("#transformer_"+ this.id).find("[datacode="+data.Data[i].DataCode+"]").html(data.Data[i].CollectData);
        }
    }
});

module.exports= Transformer;
