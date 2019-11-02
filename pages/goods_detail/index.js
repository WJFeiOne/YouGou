/* 商品详情 js */

// 导入 路由配置 模块
import request from "../../utils/request.js"

// 商品 详情实例
Page({
    // 指定 商品详情 数据
    data: {
        detail: {}   // 接收 商品详情 数据
    },
    
    // 页面加载 完毕执行
    onLoad: function (options) {
        // 从 options 解构商品 id
        const { goods_id } = options;

        // 请求 商品详情 数据
        request({
            url: "/api/public/v1/goods/detail",  // 请求 数据接口
            data: {
                goods_id   // 请求 商品id
            }
        }).then(res => {
            // 解构 商品详情 数据
            const { message } = res.data;

            // 设置 商品详情 参数
            this.setData({
                detail: message
            })
        })
    }
})
