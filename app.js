/* 项目入口模块 */

// 导入 路由模块 配置
import request from "./utils/request.js"

// 项目 入口实例
App({
    // 页面 加载执行
    onLaunch: function () {
        request.defaults.baseURL = "https://api.zbztb.cn"    // 指定 基准路径
    },

    // 配置 测试环境
    globalData: {}
})