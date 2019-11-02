/* 商品列表 js */

// 导入 路由配置 模块
import request from "../../utils/request.js"

// 商品列表实例
Page({
    // 指定 商品列表 数据
    data: {
        query: "",      // 接收 url搜索 关键字
        goods: [],      // 接收 商品列表 数据
        hasMore: true,  // 接收 加载更多 状态
        pagenum: 1,     // 接收 当前商品 页数
        loading: false  // 接收 函数节流 数据
    },

    // 页面加载 完毕执行
    onLoad: function (options) {
        // 从 options 解构搜索关键词参数
        const { query } = options;
        
        // 设置 关键词参数
        this.setData({
            query
        });

        // 请求 列表数据
        this.getList();
    },

    // 请求 列表数据 方法
    getList() {
        // 判断 第二次请求是否 正在加载
        if (this.data.loading === true) {
            return;   // 退出请求
        }

        // 第一次 加载数据
        this.setData({
            loading: true
        });
        
        // 请求 商品列表 数据
        request({
            url: "/api/public/v1/goods/search",  // 请求 数据接口
            data: {
                query: this.data.query,          // 请求 关键字 
                pagenum: this.data.pagenum,      // 请求 当前页数
                pagesize: 10                     // 请求 当前条数
            }
        }).then(res => {
            //  解构 是商品列表 goods
            const { goods } = res.data.message;

            // 判断 是否到最后一页
            if (goods.length < 10) {
                // 设置 加载更多 参数
                this.setData({
                    hasMore: false  // 不显示 加载更多
                })
            }

            // 循环遍历 商品价格
            const newGoods = goods.map(v => {
                // 给每个商品价格保留两位小数点
                v.goods_price = Number(v.goods_price).toFixed(2); 
                return v;   // 返回 新商品列表 
            })
            
            // 合并 商品列表 数据
            this.setData({
                goods: [...this.data.goods, ...newGoods],  // 展开 商品列表 数据
                pagenum: this.data.pagenum + 1,            // 当前 页数加 1  
                loading: false                             // 设置 加载更多 状态
            })
        })
    },

    // 触底事件
    onReachBottom() {
        // 判断 有更多数据时候才请求下一页的数据
        if (this.data.hasMore) {
            // 请求 下一页的数据
            this.setData({
                pagenum: this.data.pagenum + 1  // 当前 页数加 1
            })
            this.getList();   // 请求 商品列表数据
        }
    }

})