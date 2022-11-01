const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TestPlugin = require("./plugins/test-plugin");
const BannerWebpackPlugin = require("./plugins/banner-webpack-plugin");
const CleanWebpackPlugin = require("./plugins/clean-webpack-plugin");
const AnalyzeWebpackPlugin = require("./plugins/analyze-webpack-plugin");
const InlineChunkWebpackPlugin = require("./plugins/inline-chunk-webpack-plugin");

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "js/[name].js",
        // clean: true,
    },
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     //  loader: "./loaders/test-loader.js",
            //     /* use: [
            //         "./loaders/demo/test1",
            //         "./loaders/demo/test2"
            //     ], */
            //     // loader: "./loaders/demo/test3"
            //     /* use: [
            //         "./loaders/demo/test4",
            //         "./loaders/demo/test5",
            //         "./loaders/demo/test6",
            //     ], */
            //     // loader: "./loaders/clean-log-loader",
            //     loader: "./loaders/banner-loader",
            //     options: {
            //         author: "老王",
            //         // age: 12, // 不能新增字段，不然会报错
            //     }
            // },
            {
                test: /\.js$/,
                loader: "./loaders/babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            },
            {
                test: /\.(png|jpe?g|gif)/,
                type: "javascript/auto",    // 阻止webpack默认处理图片资源，只使用file-loader处理
                loader: "./loaders/file-loader",
            },
            {
                test: /\.css$/,
                use: [
                    "./loaders/style-loader",
                    "css-loader"
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./public/index.html"),
        }),
        // new TestPlugin(),
        new BannerWebpackPlugin({
            author: "L_PenguinQAQ"
        }),
        new CleanWebpackPlugin(),
        new AnalyzeWebpackPlugin(),
        new InlineChunkWebpackPlugin([
            /runtime(.*)\.js$/g,
        ]),
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`
        }
    },
    mode: "production",
}