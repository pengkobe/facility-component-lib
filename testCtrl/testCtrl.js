/**
 * 渲染页面骨架
 * @param {HTMLElement} dom
 */
var room = require("./modules/room/room.js");

exports.render = function (dom) {
    

    var tpl = __inline("testCtrl.handlebars");
    var eletricSystem = __uri('./img/供配电系统.png');
    var waterSystem = __uri('./img/给排水系统.png');
    var elevatorSystem = __uri('./img/电梯系统.png');
    var intelligentSystem = __uri('./img/智能化系统.png');
    var tpldata = {
        devicesystems: [
            { src: eletricSystem, name: "供配电系统" },
            { src: waterSystem, name: "给排水系统" },
            { src: elevatorSystem, name: "电梯系统" },
            { src: intelligentSystem, name: "智能化系统" }
        ]
    };

    requestDeviceSystem({ projectCode: 1 });

    var html = tpl(tpldata);
    // 渲染主页面
    dom.innerHTML = html;
    // 渲染房间
    room.render(document.getElementsByClassName("data-view")[0]);
    // 注册dom事件
    registerDomEvt();
};

/**
 * 设备系统
 * @param {Object} params 请求参数。
 * @param {Object} callback 回调
 */
function requestDeviceSystem(params, callback) {
    $.ajax({
        url: '/Action.ashx?Name=EFOS.PCApply.Business.RealDataBLL.GetSystem',
        data: params,
        type: 'POST',
        dataType: "json",
        success: function (data) {
            var data = data.data;
            // debugger;
        }
    });
}


function registerDomEvt() {
    $(".device-system").on('click', function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });
}