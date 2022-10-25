module.exports = {
    // 智能预设，能够编译ES6语法
    presets: [
        ["@babel/preset-env", {
            // 没有打包成js文件：回去查看package中浏览器是否支持
            useBuiltIns: 'usage',   // 按需加载自动引入
            corejs: 3
        }]
    ],
}