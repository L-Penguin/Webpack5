
module.exports = function (content, map, meta) {
    // 清除文件内容中console.log(xxx)
    return content.replace(/console\.log\(.*\);?/g, "");
}