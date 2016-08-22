/**
 * NXT DEVICE COMPONENTS LIB
 * Copyright 2016 NXT
 * Licensed under the MIT License
 */
var Class = require("./Class.js");
var uuid=0;
/**
 * @class Base组件基类。
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module Base
 * @requires Class
 * @property {Number} id 属性编号
 * @property {String} type 设备类型
 */
var Base = Class.create(/** @lends Base.prototype */{
    constructor:function(properties){
        this.id = uuid;
        this.type = 'unset';
        copy(this, properties);
    },
    /**
    * 获取参数
    */
    getParam:function(){
    },
    /**
    * 设置值
    * @param {Object} val 值对象。
    */
    setValue:function(val){
    },
    /**
    * 获取模板
    */
    getTpl:function(){
    }
});

/**
 * 属性拷贝
 */
function copy(target, source, strict){
        for(var key in source){
            if(!strict || target.hasOwnProperty(key) || target[key] !== undefined){
                target[key] = source[key];
            }
        }
        return target;
}

module.exports = Base;