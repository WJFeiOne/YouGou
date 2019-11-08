/* 个人中心页面 js */

// 个人中心实例
Page({
    // 指定 个人中心 数据
    data: {
        userInfo: {},   // 接收 用户信息 数据
    },

    // 页面加载 完成执行
    onShow() {
        // 从本地获取 用户信息数据
        const userInfo = wx.getStorageSync('userInfo');
        
        // 判断 如果没有用户信息
        if (!userInfo) {
            // 跳转到 登录页面
            wx.navigateTo({
                url: '/pages/login/index'
            });
            return  // 退出
        }
        
        // 保存 用户信息
        this.setData({
            userInfo
        })
    }
})