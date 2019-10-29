/* 路由配置模块 */

/**
 * @desc
 * @param 请求对象 | Object
 * @return Promise 对象
 */

// 指定 路由配置函数
const request = (config) => {

    // 判断 config 是否是一个对象
    if (!(config && typeof config === "object" && !Array.isArray(config))) {
        console.error("参数不是对象 ！");    // 打印 参数错误 提示
        return;    // 退出函数                         
    }

    // 判断 参数中必须包含 url
    if (!config.url) {
        console.error("URL不能为空 ！");    // 打印 路由为空 提示 
        return;    // 退出函数 
    }

    // 判断 url 前面是否带有http，如果有不加上基准路径，反之就加上
    const reg = /^http/

    // 判断非 http 开头
    if (!reg.test(config.url)) {
        config.url = request.defaults.baseURL + config.url;  // 添加 基准路径
    }

    // 返回请求 promise
    return new Promise((resolve, reject) => {
        // 发起 数据请求
        wx.request({
            ...config,         // 解构 请求参数

            // 请求成功执行
            success(res) {
                resolve(res)   // 执行 resolve，并且返回成功的结果
            },

            // 请求失败执行
            fail(res) {
                reject(res);   // 执行 reject，并且返回成功的结果
            },

            // 执行错误拦截
            complete(res) {
                // 判断 是否为错误函数
                if (typeof request.errors === 'function') {
                    request.errors(res)    // 执行错误 的拦截器
                }
            }
        })
    })
}

// 指定 request 默认配置
request.defaults = {
    baseURL: ""    // 定义 基准路径
};

// 缓存 拦截器函数
request.errors = null;

// 调用 request 拦截器函数
request.onError = (callback) => {
    request.errors = callback;    // 
}

// 导出 路由配置 模块
export default request;