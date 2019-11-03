/* 搜索商品 js */

// 商品 搜索实例
Page({
    // 指定 商品搜索 数据
    data: {
        showCancel: false,   // 接收 显示取消按钮 参数
        searchValue: "",     // 接收 输入框的 数据
        keywords: [],        // 接收 搜素历史 列表
    },

    // 页面显示 时候执行
    onShow() {

        // 每次显示页面 清空输入框的 数据
        this.setData({
            searchValue: ""
        })

        // 每次显示页面 都从本地获取搜素历史
        this.setData({
            keywords: wx.getStorageSync("search") || []
        })
    },

    // 监听 输入框输入 时候的事件
    handleInput(event) {
        const { value } = event.detail;  // 获取 输入框的 数据
        let showCancel;                  // 定义 取消按钮 参数

        // 判断输入框有没值, value.trim()去除前后空格
        showCancel = value ? true : false

        // 设置 搜索参数
        this.setData({
            showCancel,         // 保存 取消按钮 状态
            searchValue: value  // 保存 输入框的 数据
        })
    },

    // 点击 取消按钮时候触发
    handleCancel() {
        // 设置 输入框参数
        this.setData({
            showCancel: false,  // 隐藏 取消按钮 
            searchValue: ""     // 清空 输入框 数据
        })
    },

    // 点击 键盘确定按钮时候触发
    handlleConfirm() {
        // 从本地存储 获取搜索历史 数据
        const arr = wx.getStorageSync('search') || [];
        
        // 判断 输入框的值是否为空
        if (!this.data.searchValue) {
            return;     // 退出
        } 

        let lisi = [];  // 定义 搜索历史数组

        const iten = this.data.searchValue    // 获取 输入框的值

        // 判断 搜索历史不为空
        if (arr.length != 0) {
            // 遍历 搜索历史
            arr.forEach(v => {
                // 判断 是否已有搜索历史
                if (v != iten){
                    lisi.push(v);   // 去除 相同的搜索历史
                }
            })
            lisi.unshift(iten);     // 添加 搜索历史数据
        }else{
            lisi.unshift(iten);     // 添加 搜索历史数据
        }

        // 将搜索参数 保存到本地
        wx.setStorageSync('search', lisi.slice(0, 10));

        // 跳转 到商品列表页面
        wx.navigateTo({
            url: "/pages/goods_list/index?searchValue=" + this.data.searchValue
        })
    },

    // 清除所有 的搜索历史数据
    handleClear() {
        // 清除 搜索历史数据
        wx.removeStorageSync('search');

        // 清空 搜索历史列表
        this.setData({
            keywords: []
        })
    }
})