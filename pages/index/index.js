/* 商城首页 js */

// 导入 路由配置 模块
import request from "../../utils/request.js"

// 商城 首页实例
Page({
    // 指定 商城首页 数据
    data: {
        banners: [],  // 接收 轮播图 数据
        menus: [],    // 接收 分类菜单 数据
        floors: []    // 接收 商品楼层 数据
    },

    // 页面加载 完毕执行
    onLoad() {
        // 请求 首页数据 
        request({
            url: "/api/public/v1/home/swiperdata"  // 请求 数据接口
        }).then(res => {
            const { message } = res.data;  // 解构 响应数据
            this.setData({
                banners: message           // 保存 首页数据
            })
        });

        // 请求 分类菜单数据
        request({
            url: "/api/public/v1/home/catitems"   // 请求 数据接口
        }).then(res => {
            const { message } = res.data;   // 解构 响应数据
            this.setData({
                menus: message              // 保存 菜单数据
            })
        })
        
        // 请求 商品楼层数据
        request({
            url: "/api/public/v1/home/floordata"   // 请求 数据接口
        }).then(res => {
            const { message } = res.data;   // 解构 响应数据
            this.setData({
                floors: message             // 保存 商品楼层数据
            })
        })
    }
})