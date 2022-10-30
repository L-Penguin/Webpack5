const schema = require("./schema.json")

module.exports = function (content) {
    // schema对options的规则验证
    // schema符合JSON Schema的规则
    const options = this.getOptions(schema);
    const prefix = `
        /**
         * Author: ${options.author}
        */
    `;

    return prefix + content;
}