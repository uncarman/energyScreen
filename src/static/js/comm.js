/* normal functions and settings include by each page */
var settings = {
    AMAP_SRC : 'https://webapi.amap.com/maps?v=1.3&key=02fc113eb5fa70cbaabd7b94b106244f&plugin=AMap.ToolBar',
    is_debug : true,
    ajax_base_url: "",
    ajax_func: {
        "ajaxTotal" : "/ajax/ajaxTotal",
        "ajaxDevices" : "/ajax/ajaxDevices",
        "ajaxEnergyData" : "/ajax/ajaxEnergyData",
        
    },
    WEATHER : {
        UNSET: { text: 'unset', class: 'default' },
        UNKNOWN: { text: '获取异常', class: 'default' },
        SUNNY: { text: '晴', class: 'sunny' },
        SNOW: { text: '雪', class: 'snow' },
        SNOW1: { text: '雨夹雪', class: 'snow' },
        RAIN: { text: '雨', class: 'rainy' },
        RAIN1: { text: '中雨', class: 'rainy' },
        RAIN2: { text: '小雨', class: 'rainy' },
        SMOG: { text: '雾霾', class: 'smog' },
        SMOG1: { text: '雾', class: 'smog' },
        SMOG1: { text: '霾', class: 'smog' },
        SLEET: { text: '雨夹雪', class: 'sleet' },
        CLOUDY: { text: '多云', class: 'cloudy' },
        OVERCAST: { text: '阴', class: 'overcast' },
        OVERCAST1: { text: '浮尘', class: 'overcast' },
        SAND_STORM: { text: '沙尘暴', class: 'sandstorm' },
        SAND_STORM1: { text: '扬沙', class: 'sandstorm' },
        THUNDER_SHOWER: { text: '雷阵雨', class: 'thunderstorm' },
        THUNDER_SHOWER1: { text: '阵雨', class: 'thunderstorm' },
    },

    maintanceColors: ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728",
        "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f",
        "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"],
}

var global = {
    //读取共享存储区域的session字段
    read_storage: function(field){
        //read data from window.localStorage['field']
        field = field || "session";
        var res = {};
        if(settings.can_localStorage){
            var d = window.localStorage[field];
            try{
                res = JSON.parse(d);
            }catch(e){ res = d; }
        }
        return res || {};
    },
    //默认修改localStorage的session字段
    write_storage: function(field, data){
        var k = null, v = null;
        if(typeof field == "string"){
            k = field;
            v = data;
        }
        else if(typeof field == "object"){
            //only pass a value, write to window.localStorage.session
            k = "session";
            v = field
        }
        else{
            k = "session";
            v = window.session;
        }
        if(settings.can_localStorage){
            window.localStorage[k] = (typeof v == "string") ? v : JSON.stringify(v);
        }
    },
    //为localStorage的field字段添加新的键值对key-data
    set_storage_key: function(field, array){
        if(typeof field == "string" && typeof array == "object"){
            var res = global.read_storage(field);
            for(var item in array){
                var temp_key = array[item].key;
                var temp_val = array[item].val;
                if(typeof temp_key == "string" && typeof temp_val != "undefined"){
                    res[temp_key] = temp_val;
                }
            }
            global.write_storage(field, JSON.stringify(res));
        }

    },

    loading_num: 0,    // for ajax loading number record

    default_ajax_error_func: function(data) {
        if (data != '' && data != null) {
            if(angular.isObject(data))
            {
                if(angular.isString(data.message) && data.message != "")
                {
                    var msg = data.message;
                }
                else
                {
                    var msg = '连接失败...';
                }
                MyAlert(msg, 'warning');
                /*
                new MyMsg({
                    str: msg,
                    classtype: 'warning',
                    time: settings.msg_duration
                });
                */
                return msg;
            }
            else if(angular.isString(data))
            {
                MyAlert(data, 'warning');
                /*
                new MyMsg({
                    str: data,
                    classtype: 'warning',
                    time: settings.msg_duration
                });
                */
                return data;
            }
        }
        else {
            MyAlert('连接失败...', 'warning');
            /*
            new MyMsg({
                str: '连接失败...',
                classtype: 'warning',
                time: settings.msg_duration
            });
            */
            return '连接失败...';
        }
    },

    //校验手机号码
    check_mobile_number: function(mobile_number){
        //var re = /^1[3|4|5|6|7|8]\d{9}$/;
        var re = /^1[0-9]{10}$/;
        if (!mobile_number || !re.test(mobile_number)) {
            //alert('您输入的手机号码有误，请重新输入');
            return false;
        }
        return true;
    },

    //校验手机验证码
    check_sms: function(sms){
        var codeRe = /^\d{6}$/;
        if (!codeRe.test(sms)) {
            //alert('您尚未通过手机号码验证，请先提交6位数字验证码');
            return false;
        }
        return true;
    },

    // 解析url字符串
    request: function(str_parame) {
        var args = new Object( );
        var query = location.search.substring(1); //location.pathname
        var arr = new Array();
        arr = query.split("&");
        for(var i = 0; i < arr.length; i++) {
            var pos = arr[i].indexOf('=');
            if (pos == -1) continue;
            var argname = arr[i].substring(0,pos);
            var value = arr[i].substring(pos+1);
            value = decodeURIComponent(value);
            args[argname] = value;
        }
        return str_parame ? args[str_parame] : args;
    },

    // 校验登录密码规则
    // 返回：
    //    成功： null
    //    失败： 错误信息
    check_login_pwd: function(pwd) {
        if(pwd)
        {
            var fail = !/(?!^\d+$)(?!^[A-z]+$)(?!^[^A-z\d]+$)^.{6,16}$/.test(pwd) || /[\u4E00-\u9FA5]/.test(pwd);
            return fail ? '密码为6~16位的数字和字母组合' : null;
        }
        else
        {
            return "登录密码不能为空";
        }
    },

    // 替换敏感字符串
    crossfade_str:function (str) {
        if(str == '')
        {
            return '';
        }
        else if(str.length>7)
        {
            var strLeft = str.substr(0, 3);
            var strRight = str.substr(str.length-4, str.length);
            return strLeft + "****" + strRight;
        }
        else
        {
            var strLeft = str.substr(0, str.length/2);
            return strLeft + "****";
        }
    },

    return_promise : function ($scope, param) {
        return new Promise(function(resolve, reject) {
            global.ajax_data($scope, param,
                function (data) {
                    //接口调用成功
                    if(data) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
        });
    },

    ajax:function($scope, param, success_func, error_func) {
        // setTimeout(function(){
        //     //var res = {"code":0,"msg":"","result":[{"build":{"id":1,"code":"110101A181","name":"浙江省海盐电力局","type":"H","province":null,"city":null,"build_year":"2014","floor_num":20,"area":792000,"refrigeration_area":792000,"heating_area":792000,"air_conditioning":"B","heating":"D","coefficient":null,"ratio":null,"structure":"C","wall_material":"D","wall_warm":"B","window":"B","glass":"D","window_frame":"D","longitude":"东经116.440","latitude":"北纬39.870","address":"浙江省海盐电力局","owner":"浙江省海盐电力局","intro":"ghjgh","photo_url":"/buildingPhoto/1520317838599.jpg","insert_date":"2017-05-23T03:24:51.000Z","monitoring":0,"person":500},"energyTotalElec":{"tt":3301501.64},"energyTotalWater":{"tt":0},"energyTodayElec":{"tt":16189.66},"energyMonthElec":{"tt":168340.61},"energyMonthWater":{"tt":0},"energyYearElec":{"tt":168340.61},"energyYearWater":{"tt":0},"energyListElec":[{"tt":16183.76,"date_time":"2020-03-01"},{"tt":16198.78,"date_time":"2020-03-02"},{"tt":16201.66,"date_time":"2020-03-03"},{"tt":16198.36,"date_time":"2020-03-04"},{"tt":19426.62,"date_time":"2020-03-05"},{"tt":25885.82,"date_time":"2020-03-06"},{"tt":19412.69,"date_time":"2020-03-07"},{"tt":22643.26,"date_time":"2020-03-08"},{"tt":16189.66,"date_time":"2020-03-09"}],"energyListWater":[]},{"build":{"id":56,"code":"110105C001","name":"嘉兴市融通商务中心4号楼","type":"A","province":null,"city":null,"build_year":"2017","floor_num":10,"area":10932,"refrigeration_area":7920,"heating_area":7920,"air_conditioning":"B","heating":"A","coefficient":null,"ratio":null,"structure":"B","wall_material":"A","wall_warm":"A","window":"A","glass":"A","window_frame":"A","longitude":"东经116.44","latitude":"北纬39.87","address":"浙江省嘉兴市南湖区文桥路505号融通商务中心4号楼","owner":"人民卫生出版社有限公司","intro":"","photo_url":null,"insert_date":"2017-05-23T03:24:51.000Z","monitoring":0,"person":500},"energyTotalElec":{"tt":1538513.79},"energyTotalWater":{"tt":8320.68},"energyTodayElec":{"tt":1325.97},"energyTodayWater":{"tt":15.5},"energyMonthElec":{"tt":16231.65},"energyMonthWater":{"tt":140.9},"energyYearElec":{"tt":16231.65},"energyYearWater":{"tt":140.9},"energyListElec":[{"tt":1407.1,"date_time":"2020-03-01"},{"tt":2093.72,"date_time":"2020-03-02"},{"tt":2068.22,"date_time":"2020-03-03"},{"tt":2156.68,"date_time":"2020-03-04"},{"tt":2218.96,"date_time":"2020-03-05"},{"tt":2162.5,"date_time":"2020-03-06"},{"tt":1370.1,"date_time":"2020-03-07"},{"tt":1428.4,"date_time":"2020-03-08"},{"tt":1325.97,"date_time":"2020-03-09"}],"energyListWater":[{"tt":0.8,"date_time":"2020-03-01"},{"tt":27.8,"date_time":"2020-03-02"},{"tt":23.2,"date_time":"2020-03-03"},{"tt":23,"date_time":"2020-03-04"},{"tt":21.2,"date_time":"2020-03-05"},{"tt":23.6,"date_time":"2020-03-06"},{"tt":5.4,"date_time":"2020-03-07"},{"tt":0.4,"date_time":"2020-03-08"},{"tt":15.5,"date_time":"2020-03-09"}]},{"build":{"id":1,"code":"110573X001","name":"嘉兴市电力局秀洲分局","type":"A","province":null,"city":null,"build_year":"2014","floor_num":20,"area":792000,"refrigeration_area":792000,"heating_area":792000,"air_conditioning":"C","heating":"A","coefficient":null,"ratio":null,"structure":"A","wall_material":"D","wall_warm":"B","window":"B","glass":"D","window_frame":"D","longitude":"东经116.440","latitude":"北纬39.870","address":"嘉兴市秀洲区长虹路376号","owner":"秀洲电力分局","intro":"ghjgh","photo_url":"/buildingPhoto/1520317838599.jpg","insert_date":"2017-05-23T03:24:51.000Z","monitoring":0,"person":500},"energyTotalElec":{"tt":5821.14},"energyTotalWater":{"tt":0},"energyTodayElec":{"tt":40.97},"energyMonthElec":{"tt":540.07},"energyMonthWater":{"tt":0},"energyYearElec":{"tt":540.07},"energyYearWater":{"tt":0},"energyListElec":[{"tt":43.38,"date_time":"2020-03-01"},{"tt":73.3,"date_time":"2020-03-02"},{"tt":75.18,"date_time":"2020-03-03"},{"tt":73.36,"date_time":"2020-03-04"},{"tt":73.38,"date_time":"2020-03-05"},{"tt":74.73,"date_time":"2020-03-06"},{"tt":44.38,"date_time":"2020-03-07"},{"tt":41.39,"date_time":"2020-03-08"},{"tt":40.97,"date_time":"2020-03-09"}],"energyListWater":[]},{"build":{"id":1,"code":"110101A025","name":"测试建筑","type":"F","province":null,"city":null,"build_year":"2014","floor_num":20,"area":792000,"refrigeration_area":792000,"heating_area":792000,"air_conditioning":"C","heating":"C","coefficient":"","ratio":"","structure":"C","wall_material":"D","wall_warm":"B","window":"B","glass":"D","window_frame":"D","longitude":"东经116.440","latitude":"北纬39.870","address":"北京市朝阳区潘家园南里19号","owner":"人民卫生出版社有限公司0","intro":"ghjgh","photo_url":"/buildingPhoto/1520317838599.jpg","insert_date":"2017-05-23T03:24:51.000Z","monitoring":0,"person":500},"energyTotalElec":{"tt":356926.18},"energyTotalWater":{"tt":0},"energyTodayElec":{"tt":932.82},"energyMonthElec":{"tt":9830.1},"energyMonthWater":{"tt":0},"energyYearElec":{"tt":9830.1},"energyYearWater":{"tt":0},"energyListElec":[{"tt":986.18,"date_time":"2020-03-01"},{"tt":1144.32,"date_time":"2020-03-02"},{"tt":1174.77,"date_time":"2020-03-03"},{"tt":1173.27,"date_time":"2020-03-04"},{"tt":1165.1,"date_time":"2020-03-05"},{"tt":1126.02,"date_time":"2020-03-06"},{"tt":1010.71,"date_time":"2020-03-07"},{"tt":1116.91,"date_time":"2020-03-08"},{"tt":932.82,"date_time":"2020-03-09"}],"energyListWater":[]},{"build":{"id":1,"code":"110573B001","name":"嘉兴市电力局滨海分局","type":"F","province":null,"city":null,"build_year":"2014","floor_num":20,"area":792000,"refrigeration_area":792000,"heating_area":792000,"air_conditioning":"C","heating":"C","coefficient":null,"ratio":null,"structure":"C","wall_material":"D","wall_warm":"B","window":"B","glass":"D","window_frame":"D","longitude":"东经116.440","latitude":"北纬39.870","address":"","owner":"人民卫生出版社有限公司0","intro":"ghjgh","photo_url":"/buildingPhoto/1520317838599.jpg","insert_date":"2017-05-23T03:24:51.000Z","monitoring":0},"energyTotalElec":{"tt":8749.28},"energyTotalWater":{"tt":0},"energyTodayElec":{"tt":94.02},"energyMonthElec":{"tt":1309.37},"energyMonthWater":{"tt":0},"energyYearElec":{"tt":1309.37},"energyYearWater":{"tt":0},"energyListElec":[{"tt":124.86,"date_time":"2020-03-01"},{"tt":121.88,"date_time":"2020-03-02"},{"tt":130.06,"date_time":"2020-03-03"},{"tt":168.48,"date_time":"2020-03-04"},{"tt":171.13,"date_time":"2020-03-05"},{"tt":169.4,"date_time":"2020-03-06"},{"tt":165.72,"date_time":"2020-03-07"},{"tt":163.82,"date_time":"2020-03-08"},{"tt":94.02,"date_time":"2020-03-09"}],"energyListWater":[]},{"build":{},"energyTotalElec":{"tt":0},"energyTotalWater":{"tt":0},"energyTodayElec":{"tt":0},"energyTodayWater":{"tt":0},"energyMonthElec":{"tt":0},"energyMonthWater":{"tt":0},"energyYearElec":{"tt":0},"energyYearWater":{"tt":0},"energyListElec":[],"energyListWater":[]}]};
        //     success_func(res);
        // }, 100);

        var np = angular.copy(param);
        var method = (np._method != 'post' && np._method != 'get') ? 'get' : np._method;
        var url = settings.ajax_base_url + np._url;
        var timeout = (angular.isNumber(np._timeout)) ? np._timeout : settings.ajax_timeout;
        var cache = !!np._cache;

        var _param = param._param;

        if(url){
            for(var key in _param) {
                if(url.indexOf(key) > -1) {
                    url = url.replace("{"+key+"}", _param[key]);
                }
            }
        }

        var _headers = {
            ...param._headers,
        };

        var req = {
            method : method,
            url: url,
            cache : param._cache,
            timeout: timeout,
            data : _param,
            params : _param,
            headers: _headers,
            crossDomain: true,
            success : function(data)
            {
                try{
                    data =     JSON.parse(data);
                    data =     JSON.parse(data);
                } catch(e) {}
                success_func(data);
                global.loading_num -= 1;
                global.loading_hide();
                $(".loading").css("display", "none");
            },
            // beforeSend : function(data)
            // {
            //     $(".loading").css("display","block");
            // },

            error: function(data){
                console.log(data);
                global.loading_num -= 1;
                global.loading_hide();
            }
        }
        jQuery.ajax(req);

        global.loading_num += 1;
        global.loading_show();
    },

    // 和服务器交互接口，做code=0检查，忽略包含success_code错误码的结果
    // success_code 为避免报错的自定义code, 可以为 string, list
    ajax_data: function($scope, params, success_func, success_code, error_func) {
        console.log("ajax_data is called");
        if(!angular.isFunction(error_func))
        {
            error_func = global.default_ajax_error_func
        }
        global.ajax($scope, params, function(data){
            console.log("controllers ajax_data result: " + JSON.stringify(data));

            if ($scope) {
                $scope.$apply(function(){
                    // 尝试去掉按钮loading状态
                    $scope.is_loading = false;
                });
            }

            if (!success_code) {
                success_code = "";
            }
            try{
                success_code = success_code.join(',');
            }
            catch(e){}
            console.log("success_code = " + success_code);

            try{
                //接口调用成功
                if (data.code == 0)
                {
                    success_func(data);
                }
                //未登录（接口需要登陆）
                else if (data.code == -200)
                {
                    MyAlert("您离开页面很久了，请重新登录。", function(){
                        window.session = {
                            mobile: "",
                            password: "",
                            from:""
                        };
                        // 清除本地缓存
                        if(settings.can_localStorage)
                        {
                            window.localStorage.session = JSON.stringify(window.session);
                        }
                        window.location.href = "login.html";
                    }, "warning");
                }
                else if(success_code.indexOf(data.code) >= 0)    // 指定code码,不报错
                {
                    success_func(data);
                }
                else     //接口调用失败
                {
                    // 查询错误码, 找到对应错误描述, 如果没有, 返回 Undefind
                    var msg = settings.error_code[data.code];

                    // 如果没有对应错误码, 从已有报错信息字典中获取, 如果没有, 返回 Undefind
                    if(angular.isUndefined(msg) || msg == "")
                    {
                        msg = settings.error_code[data.message];
                    }
                    // 如果都找不到, 直接返回错误信息
                    if(angular.isUndefined(msg) || msg == "")
                    {
                        if(angular.isUndefined(data.code))
                        {
                            msg = "服务器错误，请稍后重试或联系客服。";
                        }
                        else
                        {
                            msg = "错误编号：" + data.code + " ，请重试或联系客服。";
                        }
                    }
                    new MyMsg({
                        str: msg,
                        classtype: "warning",
                        time: settings.msg_duration
                    });
                }
            }
            catch(e)
            {
                new MyMsg({
                    str: "系统错误："+e.message,
                    classtype: "warning",
                    time: settings.msg_duration
                });
            }
        }, error_func);
    },

    // 请求该方法的接口不做code=0检查，直接执行回调函数
    cal_data: function($scope, params, success_func, success_code) {
        global.ajax($scope, params, function(data){
            console.log("controllers cal_data result: " + JSON.stringify(data));
            //接口调用成功
            success_func(data);
        }, global.default_ajax_error_func);
    },

    // 该方法发送ajax为了做心跳请求，即使ajax超时或异常也忽略错误。
    heathit_data: function($scope, Ajax, params, success_func, success_code) {
        global.ajax($scope, params, function(data){
            console.log("controllers heathit_data result: " + JSON.stringify(data));
            //接口调用成功
            success_func(data);
        }, function(data){
            // ajax 失败, 忽略错误
            console.log("controllers heathit_data result: " + JSON.stringify(data));
            //接口调用失败, 继续回调
            success_func({});
        });
    },

    /**
     * ajax等待层处理
     * @param showFlag true/false： 显示/隐藏，传false时，以下两个参数省略
     * @param tipWords 可不传，默认显示器"请等待..."
     * @param isShowOverLay 是否显示遮罩层，默认显示
     */
    iloading : function(showFlag, tipWords, isShowOverLay)
    {
        if (showFlag) {
            var iloadingDom = $("#iloadingbox");
            if (iloadingDom.length > 0) {
                $("#iloadingbox").show();
            } else {
                $('body').append(
                    '<div style="z-index: 20000; left: 0; width: 100%; height: 100%; top: 0; margin-left: 0;" id="iloadingbox" class="xubox_layer" type="page">' +
                    '<div style="z-index: 20000; height: 0; background-color: rgb(255, 255, 255);" class="xubox_main">' +
                    '<div class="xubox_page">' +
                    '<div class="xuboxPageHtml">' +
                    '<div id="iLoading_overlay" class="iLoading_overlay" style="display: block;"></div>' +
                    '<div class="iLoading_showbox" style="display: block; opacity: 1;">' +
                    '<div class="iLoading_pic">' +
                    '<div class="iLoading_loading_pic"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<span class="xubox_botton"></span>' +
                    '</div>' +
                    '<div id="xubox_border2" class="xubox_border" style="z-index: 19891015; opacity: 0; top: 0px; left: 0px; width: 0px; height: 0px; background-color: rgb(255, 255, 255);"></div>' +
                    '</div>'
                );
            }
        } else {
            $("#iloadingbox").hide();
        }
    },

    // 在屏幕中间显示loading图标
    loading_show: function() {
        global.iloading (true, '', false);
    },

    // 在屏幕中间隐藏loading图标
    loading_hide: function() {
        if(global.loading_num <= 0)
        {
            global.loading_num = 0;
            global.iloading (false, '', false);
        }
    },

    get_current_page: function(){
        // 根据页面名字修改body的class
        var url_list = window.location.href.split("#").pop();
        var page = url_list.split("/")[1];
        if(page.indexOf("?") > 0)
        {
            page = page.split("?")[0];
        }
        console.log(page);
        return page;
    },

    "goto": function(page){
        if(!page || page == '#' || page == '/'){ return; }
        // 当前页面
        var cur_page = global.get_current_page();
        // 需要跳转的页面
        var new_page = page+ ".html";
        if(page.indexOf("http://")<0 && page.indexOf("https://")<0)//page中既没有http也没有https:非直接跳转的情况
        {
            if(page.indexOf("./") < 0)
            {
                new_page = page + ".html";
            }
        }

        // 如果是因为需要登录跳转的 login 页面，替换 history 页面中的登录/注册记录
        if(cur_page == "register")
        {
            // 替换当前history entry的页面跳转
            window.location.replace(new_page);
        }
        else
        {
            //html page
            window.location.href = new_page;
        }
    },

    on_load_func: function () {

    },

    on_loaded_func: function ($scope) {
        // 复用 goto 函数到每个页面, 因统计代码所需, 挪至最前面
        $scope["goto"] = global["goto"];
    },

    // 过期可选，毫秒数
    "setLocalObject": function(key, value, exp) {
        if(exp) {
            value = {
                val: value,
                _exp: new Date().getTime() + exp,
           }
        }
        window.localStorage[key] = JSON.stringify(value);
    },

    "getLocalObject": function(key) {
        var vals = window.localStorage.getItem(key) || false;
        try{
            vals = JSON.parse(vals);
        } catch(e) {
            //
        }
        if(vals.hasOwnProperty("_exp")) {
            if(new Date().getTime() > vals._exp) {
                return false;
            } else {
                if(typeof vals.val == "string") {
                    return JSON.parse(vals.val);
                }
                return vals.val;
            }
        } else {
            if(typeof vals == "string") {
                return JSON.parse(vals);
            }
            return vals;
        }
    },

    "LHsetObject": function(key, value) {
        console.log("LHsetObject called");
        window.localStorage[key] = JSON.stringify(value);
    },

    "LHgetObject": function(key) {
        console.log(window.localStorage[key]);
        return JSON.parse(window.localStorage[key] || '{}');
    },

    "LHremove": function(key) {
        window.localStorage.removeItem(key);
    },

    "LHclear": function() {
        for (var key in this.localStorage) {
            window.localStorage.removeItem(key);
        }
    }
}