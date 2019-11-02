/* 分类页面 js */


// 导入 路由配置 模块
import request from "../../utils/request.js"

// 分类页面 实例
Page({
    // 指定 分类页面 数据
    data: {
        current: 0,  // 接收 当前选中 索引
        list: []     // 接收 分类列表 数据
    },
 
    // 页面加载 完毕执行
    onLoad: function (options) {
        // 请求 分类页面 数据
        request({
            url: "/api/public/v1/categories"   // 请求 数据接口
        }).then(res => {
            const { message } = res.data;      // 解构 响应数据
            this.setData({
                list: message                  // 保存 分类数据
            })
        })
    },

    // 点击 左侧的菜单 时候触发
    handleChange(event) {
        // 获取 当前选中 索引值
        const { index } = event.target.dataset;
        
        this.setData({
            current: index   // 设置 当前选中 索引值
        })
    }
})