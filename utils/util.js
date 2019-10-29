/* 工具封装模块 */

// 封装 时间格式化 方法
const formatTime = date => {
    const year = date.getFullYear()    // 获取 系统年份
    const month = date.getMonth() + 1  // 获取 系统月份
    const day = date.getDate()         // 获取 系统日期
    const hour = date.getHours()       // 获取 系统小时
    const minute = date.getMinutes()   // 获取 系统分钟
    const second = date.getSeconds()   // 获取 系统秒钟

    // 拼接 格式化 时间
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 定义 获取时间 方法
const formatNumber = n => {
    n = n.toString()             // 将日期数据 转化成字符串
    return n[1] ? n : '0' + n    // 当日期格式 为一项的时候 在前面添加 "0"
}

// 导出 时间格式化 模块
module.exports = {
    formatTime: formatTime
}
