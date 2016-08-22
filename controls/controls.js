'use strict';

var transformer = require('./transformer/transformer.js');

/**
 * 控件工厂
 */
var ctlFactory = {
    /**
    * getDevice 获取设备控件
    * @param  {[Object]} options 配置
    */
    getTransformer: function (options) {
        return transformer(options);
    },

    /**
     * getControlByType 按类型获取控件
     * @param  {[String]}  type    控件类型
     * @param  {[Object]}  options 定位配置
     * @return {[Object]}          控件对象
     */
    getControlByType: function (type, options) {
        var ctrl;
        switch (type) {
            case "transformer":
                ctrl = this.getTransformer(options);
                break;
            default: return;
        }
        return ctrl;
    }
}

module.exports = ctlFactory;
