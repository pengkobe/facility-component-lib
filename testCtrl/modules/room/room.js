/**
 * 渲染房间
 */
var controls = require("../../../controls/controls.js");

exports.render = function (dom) {
    var tpl = __inline("room.handlebars");
    var tpldata = {
    };
    var sysparams = {
        projectCode: '1',
        systemCode: '1'
    }
    var CtrlList = [];
    var reqparams_c = [];
    var reqparams = {};

    var room_devicetype = [];
    requestRoom(sysparams, setRoomData);
    // 生成控件页面
    function setRoomData(data) {
        var rooms = data.data;
        for (var i = 0; i < rooms.length; i++) {
            var room = rooms[i];
            var RoomID = room.RoomID;
            var roomname = room.RoomName;
            var r_dt = {};
            r_dt.id = RoomID;
            r_dt.roominfo = "_room" + RoomID;
            r_dt.name = roomname;
            r_dt.types = [];
            var Params = JSON.parse(room.Params);
            // 加载房间参数控件
            if (Params.length > 0) {
                var room_ctrl = controls.getControlByType('param',
                    { deviceId: Params[0].PointKey[0].split('_')[0], params: Params });
                room_ctrl.position = "_room" + RoomID;
                CtrlList.push(room_ctrl);
                // 获取请求参数
                var room_req = room_ctrl.getReqParam();
                reqparams_c.push(room_req);
            }

            var deviceTypes = room.RoomType;
            for (var m = 0; m < deviceTypes.length; m++) {
                var deviceType = deviceTypes[m];
                var typeParams = JSON.parse(deviceType.Params);
                var TypeName = deviceType.TypeName;
                var devices = deviceType.Device;
                var typeCode = deviceType.DeviceType;

                // 加载设备类型参数控件
                if (Params.length > 0) {
                    var type_ctrl = controls.getControlByType('param',
                        { deviceId: typeParams[0].PointKey[0].split('_')[0], params: typeParams });
                    type_ctrl.position = "_devicetype"+ "_" + typeCode;
                    CtrlList.push(type_ctrl);
                    // 获取请求参数
                    var type_req = type_ctrl.getReqParam();
                    reqparams_c.push(type_req);
                }

                r_dt.types.push({ name: TypeName, typeid: "_" + RoomID + "_" + typeCode,
                typeinfo: "_devicetype"+ "_" + typeCode});

                for (var n = 0; n < devices.length; n++) {
                    var device = devices[n];
                    var DeviceID = device.DeviceID;
                    var DeviceName = device.DeviceName;
                    var IsMeter = device.IsMeter;
                    var Sort = device.Sort;
                    // 创建控件
                    var dev_ctrl = controls.getControlByType(typeCode, { deviceId: DeviceID, deviceName: DeviceName });
                    if (!dev_ctrl) {
                        //alert(typeCode + '控件暂未开发！')
                    } else {
                        dev_ctrl.position = "_" + RoomID + "_" + typeCode;
                        CtrlList.push(dev_ctrl);
                        // 获取请求参数
                        var req = dev_ctrl.getReqParam();
                        reqparams_c.push(req);
                    }
                }
            }
            room_devicetype.push(r_dt);
        }

        tpldata.room_devicetype = room_devicetype;
        var html = tpl(tpldata);
        // 渲染主页面
        dom.innerHTML = html;
        // 渲染设备
        for (var j = 0; j < CtrlList.length; j++) {
            $("[typeid=" + CtrlList[j].position + "]").append(CtrlList[j].template);
        }

        // 加载设备控件数据（房间/设备类型导航也算控件）
        loadDeviceData();
    }

    /**
     * 刷新加载数据
     */
    function loadDeviceData() {
        reqparams.componentParams = JSON.stringify(reqparams_c);
        reqparams.projectCode = "1";

        // 定时刷新数据
        requestdeviceData(reqparams, setData);
        setInterval(function () {
            requestdeviceData(reqparams, setData);
        }, 2000);
        function setData(data) {
            data = data.data;
            for (var i = 0; i < CtrlList.length; i++) {
                if (CtrlList[i] && data["" + CtrlList[i].id]) {
                    CtrlList[i].setData(data["" + CtrlList[i].id]);
                }
            }
        }
    }
}

/**
 * 房间数据
 * @param {Object} params 请求参数。
 * @param {Object} callback 回调
 */
function requestRoom(params, callback) {
    $.ajax({
        url: '/Action.ashx?Name=EFOS.PCApply.Business.RealDataBLL.GetRoom',
        data: params,
        type: 'POST',
        dataType: "json",
        success: function (data) {
            callback(data);
        }
    });
}

/**
 * 设备数据
 * @param {Object} params 请求参数。
 * @param {Object} callback 回调
 */
function requestdeviceData(params, callback) {
    $.ajax({
        url: '/Action.ashx?Name=EFOS.PCApply.Business.RealDataBLL.GetDeviceParams',
        data: params,
        type: 'POST',
        dataType: "json",
        success: function (data) {
            callback(data);
        }
    });
}


