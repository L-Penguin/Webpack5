const loaderUtils = require("loader-utils");

module.exports = function(content) {
    // 1、根据文件内容生成带hash值文件名
    let  interpolateNmae = loaderUtils.interpolateName(
        this,
        "[hash].[ext][query]",
        { content }
    )
    interpolateNmae = `images/${interpolateNmae}`
    // 2、将文件输出去
    this.emitFile(interpolateNmae, content);
    // 3、返回：module.exports = "文件路径（文件名）"
    return `module.exports = "${interpolateNmae}"`;
}

// 需要处理图片、字体等文件，它们都是buffer数据
// 需要使用raw loader才能处理

module.exports.raw = true;