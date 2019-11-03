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
        loading: false,      // 接收 函数节流 数据
        showCancel: false,   // 接收 显示取消按钮 参数
        searchValue: "",     // 接收 输入框的 数据
    },

    // 页面加载 完毕执行
    onLoad: function (options) {
        // 从 options 解构搜索关键词参数
        const { searchValue } = options;
        
        // 设置 输入框 参数
        this.setData({
            searchValue
        });

        // 设置 关键词 参数
        this.setData({
            query:searchValue
        });

        // 请求 列表数据
        this.getList();
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
                if (v != iten) {
                    lisi.push(v);   // 去除 相同的搜索历史
                }
            })
            lisi.unshift(iten);     // 添加 搜索历史数据
        } else {
            lisi.unshift(iten);     // 添加 搜索历史数据
        }

        // 将搜索参数 保存到本地
        wx.setStorageSync('search', lisi.slice(0, 10));

        // 设置 关键词 参数
        this.setData({
            query: iten
        });

        // 设置 加载更多 参数
        this.setData({
            pagenum: 1 // 不显示 加载更多
        })

        // 设置 加载更多 参数
        this.setData({
            goods:[] // 不显示 加载更多
        })

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