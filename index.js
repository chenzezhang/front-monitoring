!(function (root) {

    var w = root;
    /**
     * @param 记录日期
     */

    var oldTime = new Date() - 0;

    var getTime = new Date(),
        m = getTime.getMonth() + 1;

    var t = getTime.getFullYear() + '-' + m + '-' +
        getTime.getDate() + ' ' + getTime.getHours() + ':' +
        getTime.getMinutes() + ':' + getTime.getSeconds();

    /**
     * @param 配置文件
     */

    var packJSON = {
        'jfVersion': '1.0.0',
        'openTime': t,
        'httpUrlBasic': '/plugin/api/setBasic',
        'httpUrl': '/plugin/api/setHtmlError',
        'rendTimeUrl': '/plugin/api/setRendTime',
        'departmentId': 1
    };

    var _maq = window._maq || [];

    /**
     *  @param 判断解析_maq 配置
     */

    if (_maq) {
        for (var i in _maq) {
            switch (_maq[i][0]) {
            case '_setAccount':
                packJSON.account = _maq[i][1];
                packJSON.source = _maq[i][2];
                break;
            case '_getMessage':
                packJSON.getMessageUrl = '/plugin/api/getMessageByStatus?plant=' + _maq[i][2];
                break;
            default:
                break;
            }
        }
    }

    /**
     *  @param document对象数据
     */

    if (document) {
        packJSON.domain = document.domain || '';
        packJSON.localUrl = document.URL || '';
        packJSON.title = document.title || '';
        packJSON.referrer = document.referrer || '';
    }

    /**
     *  @param 判断网站语言
     */

    if (navigator) {
        packJSON.lang = navigator.language || '';
        packJSON.userAgent = navigator.userAgent || '',
        packJSON.appVersion = navigator.appVersion || '',
        packJSON.appName = navigator.appName || '',
        packJSON.platform = navigator.platform || '';
    }

    /**
     *  @param 获取网站分辨率
     */

    if (w && w.screen) {
        packJSON.sh = w.screen.height || 0;
        packJSON.sw = w.screen.width || 0;
        packJSON.cd = w.screen.colorDepth || 0;
    }

    /**
     * @param {object}  传入的值
     */

    var ls = {
        set: function (key, value) {
            //在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误
            //这时一般在setItem之前，先removeItem()就ok了
            if (this.get(key) !== null) {
                this.remove(key, false);
            }
            localStorage.setItem(key, value);
        },
        //查询不存在的key时，有的浏览器返回undefined，这里统一返回null
        get: function (key) {
            var v = localStorage.getItem(key);
            return v === undefined ? null : v;
        },
        remove: function (key) {
            if (!key)
                return;
            clearlocal(key);
        },
        clear: function () {
            localStorage.clear();
        }
    };

    /**
     * @param {String}  sMsg   错误信息
     * @param {String}  sUrl   出错的文件
     * @param {Long}    sLine  出错代码的行号
     * @param {Long}    sColu  出错代码的列号
     * @param {Object}  eObj   错误的详细信息，Anything
     */

    var geterrorTrap = function (sMsg, sUrl, sLine, sColu, eObj) {

        if (!sUrl) {
            return;
        }

        //没有URL不上报！上报也不知道错误
        if (sMsg === 'Script error.' || !sUrl) {
            return;
        }

        var eMs = undefined;

        eObj = !eObj ? {} : eObj;
        if (!eObj && !eObj.stack) {
            eMs = eObj.stack.toString();
        } else if (arguments.callee) {
            //尝试通过callee拿堆栈信息
            var ext = [];
            var f = arguments.callee.caller,
                c = 3;
            //这里只拿三层堆栈信息
            while (f && (--c > 0)) {
                ext.push(f.toString());
                if (f === f.caller) {
                    break; //如果有环
                }
                f = f.caller;
            }
            ext = ext.join(',');

            if (typeof eObj.stack == 'undefined') {
                eObj.stack = '';
            }
            eMs = eObj.stack.toString();
        }

        var data = {
            type: eObj.__proto__.name,
            sMsg: eMs,
            sUrl: sUrl,
            sLine: sLine,
            sColu: sColu,
            eObj: eObj ? eObj.stack : '',
            sTime: getTime.getTime()
        };
        var d = JSON.stringify(data);
        var t = !sMsg ? '' : sMsg.split(':')[1].replace(/\s+/g, '');
        t = t.substr(0, t.length / 2);

        /**
         * 这里有个问题，已经存在的、相同的问题也统计了（）
         */

        ls.set('err_' + t, d);
    };
    /**
     * @param request 
     */

    var Ajax = function (options) {
        options = options || {};
        options.type = (options.type || 'GET').toUpperCase();
        options.dataType = options.dataType || 'json';
        var params = options.data;
        var xhr;

        if (w.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else { 
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        };

        if (options.type == 'GET') {
            xhr.open('GET', options.url + '?' + params, true);
            xhr.send(null);
        } else if (options.type == 'POST') {
            xhr.open('POST', options.url, true);
           //设置表单提交时的内容类型
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(params);
        }
    };
    /**
     * @param 处理上传数据
     */

    function screening(obj) {

        var o = {};
        if (obj === 'undefied' && typeof obj !== 'object') {
            return;
        }
        for (var i in obj) {
            if (i.charAt(1) === 'r') {
                o[i] = obj[i];
            }
        }
        return o;
    }

    /**
     * @param 清除已经上传的数据
     */

    var clearlocal = function (key) {
        if (key === 'undefied' && typeof key !== 'object') {
            return;
        }
        for (var i in key) {
            localStorage.removeItem(i);
        }
    };

    /**
     * @param 数据交互，前端发送的
     */

    var localData = screening(localStorage);

    var dataBody = {
        'account': packJSON.account,
        'jfVersion': packJSON.jfVersion,
        'openTime': packJSON.openTime,
        'source': packJSON.source,
        'userAgent': packJSON.userAgent,
        'appName': packJSON.appName,
        'platform': packJSON.platform,
        'appVersion': packJSON.appVersion,
        'domain': packJSON.domain,
        'localUrl': packJSON.localUrl,
        'title': packJSON.title,
        'referrer': packJSON.referrer,
        'lang': packJSON.lang,
        'sh': packJSON.sh,
        'sw': packJSON.sw,
        'cd': packJSON.cd,
        'departmentId': packJSON.departmentId
    };
    dataBody = JSON.stringify(dataBody);

    Ajax({
        url: packJSON.httpUrlBasic,      //请求地址
        type: 'POST',         //请求方式
        data: dataBody,     //请求参数
        dataType: 'json',
        success: function (response, xml) {
        },
        fail: function (status) {
        }
    });

    if (JSON.stringify(localData) !== '{}') {
        localData.deactivated = packJSON.deactivated;
        var dataErrorBody = JSON.stringify(localData);
        Ajax({
            url: packJSON.httpUrl,      //请求地址
            type: 'POST',         //请求方式
            data: dataErrorBody,     //请求参数
            dataType: 'json',
            success: function (data) {
                var date = JSON.parse(data);
                if (date.success) { //成功以后删除相应的文件
                    ls.remove(localData);
                }
            },
            fail: function (status) {
            }
        });
    }

    w.addEventListener('error', function (e) {
        geterrorTrap(e.message, e.filename, e.lineno, e.colno, e.error);
    }, true);

    // 实验性的统计前端加载错误信息。window.performance 
    // 目前的兼容性不是很好。

    var downTime = function () {
        
        var _PerforMance = window.performance;
        var _Timing = _PerforMance.timing;

        if (!performance) {
            // 当前浏览器不支持  
            console.log('你的浏览器不支持 performance 接口');
            return;
        }
        var loadAcData = {};

        loadAcData.url = w.location.href;
        //DNS查询时间
        loadAcData.DNS = _Timing.domainLookupEnd - _Timing.domainLookupStart;
        //TCP连接耗时
        loadAcData.TCP = _Timing.connectEnd - _Timing.connectStart;
        //白屏时间
        loadAcData.WT = _Timing.responseStart - _Timing.navigationStart;
        //dom ready时间，脚本加载完成时间
        loadAcData.DR = _Timing.domContentLoadedEventEnd - _Timing.navigationStart;
        //执行onload事件耗时
        loadAcData.ONL = _Timing.loadEventEnd - _Timing.navigationStart;
        //所有请求耗时
        loadAcData.ALLRT = _Timing.responseEnd - _Timing.redirectStart;
        //dom解析耗时
        loadAcData.PRDOM = _Timing.domComplete - _Timing.domInteractive;
        //第一个请求发起时间
        loadAcData.FXHR = _Timing.fetchStart - _Timing.navigationStart;

        return loadAcData;
    };  

    w.addEventListener('load', function () {
        var tDate = downTime();
        var newTime = new Date() - 0;
        if (JSON.stringify(localData) === '{}') return;

        tDate.loadTime = newTime - oldTime; // 暂时作为页面渲染的时间
        tDate.deactivated = packJSON.deactivated;

        Ajax({
            url: packJSON.rendTimeUrl,      //请求地址
            type: 'POST',         //请求方式
            data: JSON.stringify(tDate),     //请求参数
            dataType: 'json',
            success: function (response, xml) {
            },
            fail: function (status) {
            }
        });
    });

})(window);