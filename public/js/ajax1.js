function ajax(options) {
    //默认值
    var defaults = {
        type: 'get',
        url: '',
        //async 设置为 false，则所有的请求均为同步请求，在没有返回值之前，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。async. 默认是 true，即为异步方式.
        async: true,
        data: {},
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function () { },
        error: function () { }
    }
    //使用用户传递的参数替换默认值参数
    //Object.assign方法实行的是浅拷贝,一旦遇到同名属性，Object.assign的处理方法是替换
    Object.assign(defaults, options);
    //创建ajax对象
    var xhr = new XMLHttpRequest();
    //参数拼接变量
    var params = '';
    //循环参数
    for (var attr in defaults.data) {
        //拼接参数
        params += attr + '=' + defaults.data[attr] + '&';
        //去掉参数中最后一个& substr(开始位置,结束位置)
        params = params.substr(0, params.length - 1)
    }
    //如果请求方式为get
    if (defaults.type == 'get') {
        //讲参数拼接在url地址的后面
        defaults.url += '?' + params;
    }
    //配置ajax请求
    xhr.open(defaults.type, defaults.url, defaults.async);
    //如果请求方式为post
    if (defaults.type == 'post') {
        //设置请求头
        xhr.setRequestHeader('Content-Type', defaults.header
        ['Content-Type']);
        //如果想服务器传递的参数类型为json
        if (defaults.header['Content-Type'] == 'application/json') {
            //将json对象转化为json字符串
            xhr.send(JSON.stringify(defaults.data))
        } else {
            //发送请求
            xhr.send(params)
        }
    } else {
        xhr.send()
    }
    //请求加载完成
    xhr.onload = function () {
        //获取服务器端返回数据的类型
        //getResponseHeader()：返回指定的 HTTP 响应头部的值
        var contentType = xhr.getResponseHeader('content-type');
        //获取服务器端返回的响应数据
        var responseText = xhr.responseText;
        //如果服务器端返回的数据是json数据类型
        //includes() 方法用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false
        if (contentType.includes('application/json')) {
            //将json字符串转换为json对象
            responseText = JSON.parse(responseText);
        }
        //如果请求成功
        if (xhr.status == 200) {
            //调用成功回调函数,并且向服务器返回成功的结果传递给回调函数
            defaults.success(responseText, xhr)
        } else {
            defaults.error(responseText, xhr);
        }
    }
    //当网络中断时
    xhr.onerror=function(){
        //调用失败回调函数并且将xhr对象传递给回调函数
        defaults.error(xhr);
    }

}