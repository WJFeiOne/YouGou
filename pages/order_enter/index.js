/* 订单支付页面 js */

// 导入 路由配置 模块
import request from "../../utils/request.js"

// 订单 支付页面 实例
Page({
    // 指定 支付页面 数据
    data: {
        address: {},    // 接收 订单地址 信息
        goods: {},      // 接收 订单详情 信息
        allPrice: 0     // 接收 总价格 参数
    },
    
    // 页面加载完成 执行
    onLoad: function (options) {
        // 获取 订单详情 信息
        this.setData({
            address: wx.getStorageSync("address") || {}
        })

        // 获取 总价格 参数
        this.setData({
            goods: wx.getStorageSync("goods") || {}
        })

        this.handleAllPrice();   // 调用 计算总价格 方法
    },

    // 封装 计算总价格 函数
    handleAllPrice() {
        // 获取 商品信息列表
        const { goods } = this.data;
        // 定义 初始总价
        let price = 0;

        // 循环计算商品列表 v就是key 也就是商品id
        Object.keys(goods).forEach(v => {
            // 判断 当前商品必须是 选中的
            if (goods[v].selected) {
                // 计算商品总价格 单价乘以数量
                price += (goods[v].goods_price * goods[v].number)
            }
        })

        // 保存 总价格 参数
        this.setData({
            allPrice: price
        })
    },

    // 点击 立即支付 触发
    handlePay() {
        // 获取 订单支付参数
        const { allPrice, address, goods } = this.data;

        // 将商品列表 goods 对象遍历成数组
        const newGoods = Object.keys(goods).map(v => {
            goods[v].goods_number = goods[v].number;  // 添加 goods_number 属性
            return goods[v];   // 返回 商品列表对象
        })
        
        // 发起 创建订单 请求
        request({
            url: "/api/public/v1/my/orders/create",   // 请求 数据接口
            method: "POST",    // 请求 数据方式 
            data: {
                order_price: allPrice,            // 请求 商品总价 参数
                consignee_addr: address.detail,   // 请求 收货地址 参数
                goods: newGoods                   // 请求 商品信息 参数
            },
            header: {
                Authorization: wx.getStorageSync('token')  // 添加 授权认证
            }
        }).then(res => {
            // 解构 响应订单编号
            const { order_number } = res.data.message;

            // 发起 支付订单 请求
            request({
                url: "/api/public/v1/my/orders/req_unifiedorder",  // 请求 数据接口
                method: "POST",   // 请求 数据方式 
                data: {
                    order_number  // 请求 订单编号 参数
                },
                header: {
                    Authorization: wx.getStorageSync('token')     // 添加 授权认证
                }
            }).then(res => {
                // 解构 所有支付参数 pay是对象
                const { pay } = res.data.message;
                // 调用 微信原生 支付窗口
                wx.requestPayment({
                    ...pay,         // 展开 支付参数
                    success: (res) => {
                        // 把本地的goods列表中selected为true的商品删除掉 
                    }
                })
            })
        })
    }
})