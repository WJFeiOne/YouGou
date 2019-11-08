/* 登录授权页面 js */

// 导入 路由配置 模块
import request from "../../utils/request.js"

// 登录授权 页面实例
Page({
    // 用户点击 授权后的事件方法
    handleGetUserInfo(res) {
        // 解构 token 所需要的4个参数
        const { encryptedData, rawData, iv, signature } = res.detail;
        // 解构 用户信息
        const { userInfo } = res.detail;
        // 将 用户信息 保存到本地
        wx.setStorageSync("userInfo", userInfo);

        // 获取 code 登录认证
        wx.login({
            // 调用 成功回调函数
            success(res) {
                // 解构 登录认证
                const { code } = res;

                // 请求 支付授权 认证
                request({
                    url: "/api/public/v1/users/wxlogin",  // 请求 授权接口
                    method: "POST",     // 请求 数据方式
                    data: {
                        encryptedData,  // 完整 用户信息的加密 数据
                        rawData,        // 原始数据 字符串
                        iv,             // 加密算法的 初始向量
                        signature,      // 用于 校验用户信息
                        code            // 用户 登录凭证
                    }
                }).then(res => {
                    const { token } = res.data.message;  // 解构授权认证 token 
                    wx.setStorageSync("token", token);   // 把 token 保存到本地
                    wx.navigateBack();                   // 返回上一个页面
                })
            }
        })
    }
})