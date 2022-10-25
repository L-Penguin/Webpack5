const os = require("os");
const path = require("path");   // nodejs核心模块，专门来处理路径问题
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const threads = os.cpus().length;

/**
 * 针对js兼容性处理，使用Babel来完成；
 * 针对代码格式，使用Eslint来完成；
 * 先完成Eslint，检测代码格式无误之后，再使用Babel做代码兼容性处理。 
 */
module.exports = {
    // 入口（相对路径）
    entry: './src/main.js',
    // 输出
    output: {
        // 所有文件的输出名称（绝对路径）
        // __dirname nodejs的变量，代表当前文件的文件夹目录
        // 开发模式没有输出
        path: undefined,
        // 入口文件打包输出文件名
        filename: 'static/js/[name].js',
        // 给打包输出的其他文件命名
        chunkFilename: 'static/js/[name].chunk.js',
        // 图片、字体通过type:asset处理资源命名
        assetModuleFilename: "static/media/[name].[hash:7][ext][query]",
        // 自动清空上次打包的内容
        // 原理：在打包前，将path整个目录内容清空，再进行打包
        // clean: true,
        // 可以将type为asset资源保存路径改变，优先级没有在loader中设置高
        // assetModuleFilename: '/static/images/[name].[hash:7][ext][query]'
    },
    // 加载器
    module: { 
        rules: [
            // loader的配置
            {
                // 每个文件只能被其中一个loader配置处理
                oneOf: [
                    {
                        test: /\.css$/,    // 正则匹配.css结尾文件
                        use: [  // 执行顺序，从右到左（从下到上）
                            MiniCssExtractPlugin.loader,    // 提取css成单独文件
                            // "style-loader", // 将js中css通过创建style标签添加到html文件中生效
                            "css-loader",   // 将css资源编译成commonjs的模块到js中
                        ],
                    },
                    // less资源
                    {
                        test: /\.less$/,
                        // loader: "",  // 只能使用1个loader
                        use: [
                            // 使用多个loader
                            MiniCssExtractPlugin.loader,    // 提取css成单独文件
                            // "style-loader",
                            "css-loader",
                            "less-loader",  // 将less编译成css文件
                        ],
                    },
                    // sass资源
                    {
                        test: /\.s[ac]ss$/,
                        use: [
                            MiniCssExtractPlugin.loader,    // 提取css成单独文件
                            // "style-loader",
                            "css-loader",
                            "sass-loader",  // 将sass编译成css文件
                        ]
                    },
                    // stylus资源
                    {
                        test: /\.styl$/,
                        use: [
                            MiniCssExtractPlugin.loader,    // 提取css成单独文件
                            // "style-loader",
                            "css-loader",
                            "stylus-loader",    // 将stylus编译成css文件
                        ]
                    },
                    // 图片资源
                    {
                        test: /\.(png|jpe?g|gif|webp)$/,
                        // type: "asset"|"asset/resource"|"asset/inline"|"asset/source"
                        /**
                         * "asset" : 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
                         * "asset/resource" : 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
                         * "asset/inline" : 导出一个资源的 data URI。之前通过使用 url-loader 实现。
                         * "asset/source" : 导出资源的源代码。之前通过使用 raw-loader 实现。
                         */
                        type: "asset",
                        // 转换为base64添加·
                        parser: {
                            dataUrlCondition: {
                                // 小于8KB的图片转base64
                                // 优点：减少请求数量
                                maxSize: 8 * 1024,  // 8KB
                            },
                        },
                        // generator: {
                        //     // 输出图片名称
                        //     // hash:7 代表输出名称只有7位;name为原来文件名
                        //     filename: "static/imgs/[name].[hash:7][ext][query]",
                        // }
                    },
                    // 字体图标资源及其他资源
                    {
                        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
                        type: "asset/resource",
                        // generator: {
                        //     // 输出图片名称
                        //     filename: "static/media/[name].[hash:7][ext][query]",
                        // }
                    },
                    // babel配置
                    {
                        test: /\.js$/,
                        // exclude: /node_modules/,   // 排除node_module文件不处理
                        include: path.resolve(__dirname, '../src'), // 只处理src文件夹下的文件，其他不处理
                        use: [
                            {
                                loader: "thread-loader",    // 开启多进程
                                options: {
                                    works: threads, // 进程数量
                                }
                            },
                            {
                                loader: "babel-loader",
                                // 内部配置
                                options: {
                                    // presets: ["@babel/preset-env"],
                                    cacheDirectory: true,   // 开启babel缓存
                                    cacheCompression: false,    // 关闭缓存文件压缩
                                    plugins: ["@babel/plugin-transform-runtime"],    // 减少代码体积
                                }
                            }
                        ]
                    }
                ]
        }
        ]
    },
    // 插件
    plugins: [
        // plugins的配置
        // 需要创建eslintrc配置文件
        new ESLintPlugin({
            // 检测哪些文件
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",    // 默认值
            cache: true,    // 开启缓存
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads,    // 开启多进程和设置多进程数量
        }),
        new HtmlWebpackPlugin({
            // 模板：以public/index.html文件创建新的html文件
            // 新的文件特点：1、结构和原来一致；2、会自动引入打包输出的资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new MiniCssExtractPlugin()
    ],
    
    optimization: {
        // 压缩图片
        /* minimizer: [
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlacked: true }],
                            ["jepgtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                }
                
            }),
        ], */
        // 代码分割配置
        splitChunks: {
            chunks: "all",
            // 其他都用默认值
        }
    },
    
    // 开发服务器，监视源代码修改；不会输出资源，在内存中编译打包的
    devServer: {
        host: "localhost",  // 启动服务器域名
        port: "3000",   // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true, // 关闭HMR
    },
    // 模式
    mode: 'development',
    devtool: "cheap-module-source-map",
}