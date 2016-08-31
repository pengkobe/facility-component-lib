'use strict';

var Transformer = require('./transformer/transformer.js');
var high_voltage_switchgear = require('./high-voltage-switchgear/high-voltage-switchgear.js');
var low_voltage_switchgear = require('./low-voltage-switchgear/low-voltage-switchgear.js');
var Transformer = require('./transformer/transformer.js');

var _param_display = require('./_param-display/_param-display.js');

/**
 * 控件工厂
 */
var ctlFactory = {
    /**
    * getDevice 参数控件
    * @param  {[Object]} options 配置
    */
    getParam_display: function (options) {
        return new _param_display(options);
    },

    /**
    * getDevice 获取变压器控件
    * @param  {[Object]} options 配置
    */
    getTransformer: function (options) {
        return new Transformer(options);
    },
     /**
    * getDevice 获取高压开关柜控件
    * @param  {[Object]} options 配置
    */
    gethigh_voltage_switchgear: function (options) {
        return new high_voltage_switchgear(options);
    },
     /**
    * getDevice 获取低压开关柜控件
    * @param  {[Object]} options 配置
    */
    getlow_voltage_switchgear: function (options) {
        return new low_voltage_switchgear(options);
    },

    /** TODO:动态构建
     * getControlByType 按设备类型获取控件
     * @param  {[String]}  type    控件类型
     * @param  {[Object]}  options 定位配置
     * @return {[Object]}          控件对象
     */
    getControlByType: function (type, options) {
        var ctrl;
        switch (type) {
            // 变压器
            case 1:
                ctrl = this.getTransformer(options);
                break;
            // 高压开关柜
            case 2:
                ctrl = this.gethigh_voltage_switchgear(options);
                break;
            // 低压开关柜
            case 3:
                ctrl = this.getlow_voltage_switchgear(options);
                break;

            // 参数控件
            case 'param':
                ctrl = this.getParam_display(options);
                break;
            default: return;
        }
        return ctrl;
    }
}

module.exports = ctlFactory;
