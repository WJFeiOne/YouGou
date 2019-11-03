/* 搜索栏封装 JS */

// 搜索栏封装 实例
Page({
    // 点击 搜索按钮时候触发
    Search() {
        // 跳转 到商品列表页面
        wx.navigateTo({
            url: "/pages/search/index" 
        })
    }
})