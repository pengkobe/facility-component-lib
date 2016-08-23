/**
 * NXT DEVICE COMPONENTS LIB
 * Copyright 2016 NXT
 * Licensed under the MIT License
 */
var Class = require("./class.js");
var NXTComp = require("./nxtcomp.js");
/**
 * @class Base组件基类。
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module Base
 * @requires Class
 * @property {Number} id 属性编号
 * @property {String} type 设备类型
 */
var Base = Class.create(/** @lends Base.prototype */{
    constructor: function (properties) {
        properties = properties || {};
        this.id = this.id || properties.id || NXTComp.getUid("Base");
        NXTComp.copy(this, properties);
    },
    // 控件编号
    id: null,
    // 设备编号
    deviceId: null,
    // 控件类型
    type: null,
    // 控件模板
    template: null,
    // 数据标识
    datacodes: [],

    /**
    * 获取参数
    */
    getReqParam: function () {
        var requestParam = [];
        for (var i = 0; i < this.datacodes.length; i++) {
            var tep =
                requestParam.push(this.deviceId + "_" + this.datacodes[i]);
        }
        return requestParam;
    },

    /**
    * 设置值
    * @param {Object} data 值对象。
    */
    setValue: function (data) {
    },

});

module.exports = Base;