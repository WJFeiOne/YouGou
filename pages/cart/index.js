/* 购物车页面 */

// 导入 路由配置 模块
import request from "../../utils/request.js"

// 购物车页面 实例
Page({
    // 指定 购物车 数据
    data: {
        address: {},       // 接收 收货地址 数据
        goods: false,      // 接收 购物车数据 列表
        allPrice: 0,       // 接收 商品总价格 参数
        allSelected: true, // 接收 是否全选 参数
        totalNum: 0        // 接收 结算商品数量 参数
    },

    // 点击 获取收货地址
    handleAddress() {
        
        // 调用 微信获取地址 接口
        wx.chooseAddress({
            // 获取 成功的方法
            success: (res) => {
                // 设置 收货地址
                this.setData({
                    // 拼接 收货地址信息
                    address: {
                        userName: res.userName,
                        telNumber: res.telNumber,
                        detail: res.provinceName + res.cityName + res.countyName + res.detailInfo
                    },
                })
                // 把收获地址保存到本地
                wx.setStorageSync("address", this.data.address);
            }
        })
    },

    // 封装 保存购物车参数方法
    saveGoods(goods) {

        // 判断 购物车列表是否为空
        if (Object.keys(goods).length === 0) {
            // 保存 购物车 列表信息
            this.setData({
                goods: false
            });

            wx.setStorageSync("goods", goods);  // 将购物车列表 保存到本地
            this.handleAllPrice();              // 调用 计算总价格 方法
            return;       // 退出
        }
        
        let quantity = 0  // 定义 计算商品数量变量
        
        // 遍历 商品选择数量
        Object.keys(goods).forEach(v => {
            // 判断 该商品是否选中
            if (goods[v].selected){
                quantity += goods[v].number    // 将 商品选择数量 相加
            }
        })

        // 重新修改 商品结算数量
        this.setData({
            totalNum: quantity
        });

        // 重新修改 购物车列表
        this.setData({
            goods
        });

        wx.setStorageSync("goods", goods);  // 将购物车列表 保存到本地
        this.handleAllPrice();              // 调用 计算总价格 方法
    },

    // 页面显示 时候执行
    onShow() {
        // 每次打开页面的时候 都获取本地购物车数据
        let goods = wx.getStorageSync("goods") || null

        this.saveGoods(goods)      // 调用 保存购物车参数方法
        this.handleAllSelected();  // 调用 判断全选状态 方法
    },

    // 点击 数量减 1 时候触发 
    handleReduce(event) {
        const { id } = event.target.dataset;  // 从 event 中解构该商品的 id
        let { goods } = this.data;            // 获取 购物车 列表     
        // 判断 数量是否小于 1
        if (goods[id].number <= 1) {
            // 小于 1 时弹出是否删除提示
            wx.showModal({
                title: '提示',
                content: '是否要删除商品？',
                success: (res) => {
                    // 判断 用户是否选中确认按钮
                    if (res.confirm) {
                        delete goods[id];     // 根据 id 删除该商品
                        this.saveGoods(goods) // 调用 保存购物车参数方法
                    }
                }
            })
        } else {
            goods[id].number -= 1;  // 大于 1 数量正常减 1
            this.saveGoods(goods)   // 调用 保存购物车参数方法
        }
    },

    // 转换 带小数点数量
    bindInput(event) {
        const value = +event.detail.value;    // 获取 输入框的值
        const { id } = event.target.dataset;  // 从 event 中解构该商品的 id
        const { goods } = this.data;          // 获取 购物车 列表

        // 将带有小数点的 数值取整
        goods[id].number = Math.floor(value);

        // 重新修改 购物车列表
        this.setData({
            goods
        });
    },

    // 点击 输入商品数量
    bindChange(event) {
        const value = +event.detail.value;    // 获取 输入框的值
        const { id } = event.target.dataset;  // 从 event 中解构该商品的 id
        const { goods } = this.data;          // 获取 购物车 列表

        // 判断 非空或为 0 输入
        goods[id].number = value === 0 ? 1 : value;

        // 调用 保存购物车参数方法
        this.saveGoods(goods)
    },

    // 点击 数量加 1 时候触发 
    handleAdd(event) {
        const { id } = event.target.dataset;  // 从 event 中解构该商品的 id
        const { goods } = this.data;          // 获取 购物车 列表

        goods[id].number += 1;   // 商品数量加 1
        this.saveGoods(goods)    // 调用 保存购物车参数方法
    },

    // 商品选中 状态取反
    handleSelected(event) {
        const { id } = event.target.dataset;  // 从 event 中解构该商品的 id
        const { goods } = this.data;          // 获取 购物车 列表     

        //将 选中状态 取反
        goods[id].selected = !goods[id].selected;

        this.saveGoods(goods)      // 调用 保存购物车参数方法
        this.handleAllSelected();  // 调用 判断全选状态 方法
    },

    // 封装 计算总价格 函数
    handleAllPrice() {
        const { goods } = this.data;  // 获取 购物车 列表  
        let price = 0;                // 定义 总价格 初始值

        // 遍历 购物车 列表
        Object.keys(goods).forEach(v => {
            // 判断 当前商品必须是选中的
            if (goods[v].selected) {
                // 计算总价格 单价乘以数量
                price += (goods[v].goods_price * goods[v].number)
            }
        })

        // 设置 商品结算价格
        this.setData({
            allPrice: price
        })
    },

    // 点击 删除按钮时候触发
    handleDele(event) {
        const { id } = event.target.dataset;  // 从 event 中解构该商品的 id
        const { goods } = this.data;          // 获取 购物车 列表

        // 弹出 是否删除提示 
        wx.showModal({
            title: '提示',                                
            content: '是否要删除商品？',
            success: (res) => {
                // 判断 用户是否选中确认按钮
                if (res.confirm) {
                    delete goods[id];         // 根据 id 删除该商品
                    this.saveGoods(goods)     // 调用 保存购物车参数方法
                }
            }
        })
    },

    // 判断 是否为全选状态
    handleAllSelected() {
        const { goods } = this.data;   // 获取 购物车 列表  
        let isSelect = true;           // 定义 全选状态 参数

        // 遍历 购物车列表
        Object.keys(goods).forEach(v => {
            // 判断 是否有一项没有选中
            if (!goods[v].selected) {
                isSelect = false;      // 将 全选状态 设为false
            }
        })

        // 设置 全选状态 参数
        this.setData({
            allSelected: isSelect
        })
    },

    // 点击 全选按钮时候触发
    handleAllSelectedEvent() {
        // 获取 购物车列表与全选状态
        const { goods, allSelected } = this.data;

        // 循环 商品选中状态
        Object.keys(goods).forEach(v => {
            goods[v].selected = !allSelected  // 根据 allSelected 状态取反
        })

        // 调用 保存购物车参数方法
        this.saveGoods(goods)

        // 设置 商品全选状态
        this.setData({
            allSelected: !allSelected
        });

    },

    handleSubmit() {
        // 判断本地是否有token，有token就跳转到订单支付页，没有跳转到登录页
        if(wx.getStorageSync("token")){
            wx.navigateTo({
            url: '/pages/order_enter/index',
        })}else {
            wx.navigateTo({
                url: '/pages/auth/index',
            })
        }
    }
})