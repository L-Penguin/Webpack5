const path = require("path")
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerWebpackPlugin = require("image-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// 获取cross-env定义的环境变量
const isProduction = process.env.NODE_ENV === "production";

function getStyleLoader(pre) {
    return [
        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
        "css-loader",
        {
            // 处理css样式兼容性问题
            // 配合package.json中的browserlist来指定兼容性
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env",   // 能解决大多数样式兼容性问题
                    ]
                }
            }
        },
        pre && {
            loader: pre,
            options: pre === "less-loader" ? {
                // antd自定义主题色
                // 主题色文档：https://ant.design/docs/react/customize-theme-cn#Ant-Design-%E7%9A%84%E6%A0%B7%E5%BC%8F%E5%8F%98%E9%87%8F
                lessOptions: {
                    modifyVars: {"@primary-color": "#1DA57A"},
                    javascriptEnabled: true,
                }
            } : {}
        },
    ].filter(Boolean);
}

module.exports = {
    entry: "./src/main.js",
    output: {
        path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
        filename: isProduction ? 'static/js/[name].[contenthash:7].js' : 'static/js/[name].js',
        chunkFilename: isProduction ? 'static/js/[name].[contenthash:7].chunk.js' : 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[hash:7][ext][query]',
        clean: true,
    },
    module: {
        rules: [
            // 处理css
            {
                test: /\.css$/,
                use: getStyleLoader(),
            },
            {
                test: /\.less$/,
                use: getStyleLoader("less-loader"),
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoader("sass-loader"),
            },
            {
                test: /\.styl$/,
                use: getStyleLoader("stylus-loader"),
            },
            // 处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    },
                },
            },
            // 处理其他资源
            {
                test: /\.(woff2?|ttf)$/,
                type: "asset/resource",
            },
            // 处理js
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: [
                        !isProduction && "react-refresh/babel"   // 激活js的HMR
                    ].filter(Boolean),
                },
                
            }
        ]
    },
    plugins: [
        new EslintWebpackPlugin({
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        isProduction && new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:7].css",
            chunkFilename: "static/css/[name].[contenthash:7].chunk.css",
        }),
        isProduction && new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    globOptions: {
                        // 忽略index.html文件
                        ignore: ["**/index.html"],
                    }
                }
            ]
        }),
        !isProduction && new ReactRefreshWebpackPlugin(),    // 激活js的HMR              
    ].filter(Boolean),
    optimization: {
        // 是否需要进行压缩
        minimize: isProduction,
        /* minimizer: [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
            new ImageMinimizerWebpackPlugin({
                minimizer: {
                    implementation: ImageMinimizerWebpackPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
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
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                // reactreact-domreact-router-dom 一起打包成一个js文件
                react: {
                    test: /[\\/]node_modules[\\/]react(.*?)[\\/]/,
                    name: "chunk-react",
                    priority: 40,
                },
                // antd 单独打包
                antd: {
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    name: "chunk-antd",
                    priority: 30,
                },
                // 剩下 node_modules 单独打包
                lib: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "chunk-libs",
                    priority: 20,
                }
            }
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`
        }
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    // webpack解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: ['.jsx', '.js', '.json'],
    },
    devServer: {
        host: "localhost",
        port: 3000,
        open: true,
        hot: true,  // 开启HMR
        historyApiFallback: true,   // 解决前端路由刷新404问题
    },
    // 打关闭性能分析，提升打包速度
    performance: false,
}