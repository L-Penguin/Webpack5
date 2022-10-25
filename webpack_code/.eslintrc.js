module.exports = {
    // 解析选项
    parserOptions: {
        ecmaVersion: 6, // es6
        sourceType: "module",   // es module
    },
    // 具体检查规则
    rules: {
        "no-var": 2,    // 不能使用var定义变量
    },
    // 继承其他规则
    /**
     * "off"或0 —— 关闭规则
     * "warn"或1 —— 开启规则，使用警告级别的错误：warn（不会导致程序退出）
     * "error"或2 —— 开启规则，使用错误级别的错误：error（当被触发的时候，程序会退出）
     */
    // 继承 Eslint规则
    extends: ["eslint:recommended"],
    env: {
        node: true, // 启用node中全局变量
        browser: true,  // 启用浏览器中全局变量
    },
    plugins: ["import"],    // 解决动态导入语法
}