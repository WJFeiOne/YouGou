/* 商城首页 js */

// 导入 路由配置 模块
import request from "../../utils/request.js"

// 商城 首页实例
Page({

    // 页面加载 完毕执行
    onLoad() {

        // 请求 首页数据 
        request({
            url: "/api/public/v1/home/swiperdata"   // 请求 数据接口
        }).then(res => {
            console.log(res)    // 打印 响应结果
        })
    }

})
