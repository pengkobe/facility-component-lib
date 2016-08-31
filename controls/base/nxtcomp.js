/**
 * NXT DEVICE COMPONENTS LIB
 * Copyright 2016 NXT
 * Licensed under the MIT License
 */

/**
 * @language=zh
 * @namespace NXTComp的基础核心方法集合。
 * @static
 * @module NXTComp
 */
var NXTComp = (function(){

var win = window, doc = document, docElem = doc.documentElement,
    uid = 0;

return {
    /**
     * @language=zh
     * 获取一个全局唯一的id。。
     * @param {String} prefix 生成id的前缀。
     * @returns {String} 全局唯一id。
     */
    getUid: function(prefix){
        var id = ++uid;
        if(prefix){
            var charCode = prefix.charCodeAt(prefix.length - 1);
            if (charCode >= 48 && charCode <= 57) prefix += "_"; //0至9之间添加下划线
            return prefix + id;
        }
        return id;
    },

    /**
     * @language=zh
     * 简单的浅复制对象。
     * @param {Object} target 要复制的目标对象。
     * @param {Object} source 要复制的源对象。
     * @param {Boolean} strict 指示是否复制未定义的属性，默认为false，即不复制未定义的属性。
     * @returns {Object} 复制后的对象。
     */
    copy: function(target, source, strict){
        for(var key in source){
            if(!strict || target.hasOwnProperty(key) || target[key] !== undefined){
                target[key] = source[key];
            }
        }
        return target;
    },
};

})();

module.exports = NXTComp;