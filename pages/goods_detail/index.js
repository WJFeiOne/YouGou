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
    },

    // 点击 添加到本地的购物车
    handleAddCart(event) {
        // 从本地获取 购物车列表
        const goods = wx.getStorageSync("goods") || {};
        
        // 从商品详情 解构购物车数据
        const { goods_id, goods_name, goods_small_logo, goods_price } = this.data.detail;

        // 判断 商品是否已经在购物车中 有则数量加 1
        let number = goods[goods_id] ? goods[goods_id].number + 1 : 1;

        // 判断 是否为立即购买
        if (event.currentTarget.dataset.purchase === "purchase") {
            // 判断 商品是否已经在购物车中 有则数量相等
            number = goods[goods_id] ? goods[goods_id].number : 1;
        }

        // 拼接购物车参数 使用对象的方式存储是方便快速查找属性
        goods[goods_id] = {
            goods_id,           // 商品 id  参数
            goods_name,         // 商品 描述 参数
            goods_small_logo,   // 商品 图片 参数
            goods_price,        // 商品 价格 参数
            number,             // 商品 数量 参数
            selected: true      // 商品 默认选中 状态
        }

        // 将购物车数据 保存到本地
        wx.setStorageSync("goods", goods)
        
        // 判断 是否为立即购买
        if (event.currentTarget.dataset.purchase === "purchase"){

            // 跳转 到购物车页面
            wx.switchTab({
                url: "/pages/cart/index"  // 跳转接口
            })
        }else{
            // 弹出添加成功提示
            wx.showToast({
                title: '添加购物车成功',   // 提示内容
                icon: 'success',          // 提示图标
                duration: 2000            // 提示时长
            })
        }
    }
})
