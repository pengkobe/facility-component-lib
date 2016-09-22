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
    typeCode: null,
    // 控件模板
    template: null,
    // 数据标识
    datacodes: [],
    // 位置
    position: null,

    /**
    * 获取参数
    */
    getReqParam: function () {
        //{ ComponentID: "20", DataKey: req2 }
        var retObj = {};
        var requestParam = [];
        for (var i = 0; i < this.datacodes.length; i++) {
            var tep =
                requestParam.push(this.deviceId + "_" + this.datacodes[i]);
        }
        retObj.ComponentID = this.id;
        retObj.DataKey = requestParam;
        return retObj;
    },

    /**
     * 赋值
     * @param {Object} data 值对象。
     */
    setData: function (data) {
        // deviceName
        for (var i = 0; i < data.length; i++) {
            if (data[i].DataCode == 1) {
                this.setDeviceStatus(data[i].CollectData);
            } else {
                $("#" + this.typeCode + "_" + this.id).find("[datacode=" + data[i].DataCode + "]").html(data[i].CollectData);
            }
        }
    },

    /**
    * 设置设备状态
    * @param {Object} 启停值。
    */
    setDeviceStatus: function (datavalue) {
        var devobj = $("#" + this.typeCode + "_" + this.id);
        if (datavalue == 0) {
            devobj.find("img").attr("src", this.state["0"]);
            devobj.find("[datacode=1]").html("停止");
        } else {
            devobj.find("img").attr("src", this.state["1"]);
            devobj.find("[datacode=1]").html("运行");
        }
    }
});

module.exports = Base;