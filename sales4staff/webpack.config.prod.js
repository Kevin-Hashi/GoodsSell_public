const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/** @type import('webpack').Configuration */
module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'production',

    devtool: 'hidden-source-map',

    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: './ts/index.ts',

    target: ["web", "es5"],

    output: {
        path: path.join(__dirname, "dist"),
        filename: "index.js"
    },

    module: {
        rules: [{
            // 拡張子 .ts の場合
            test: /\.ts$/,
            // TypeScript をコンパイルする
            use: ["babel-loader"],
            exclude: /node_modules/, // babelを通さないディレクトリ
        }]
    },

    resolve: {
        extensions: [".ts", ".js", ".tsx"]
    },

    plugins: [
        new CleanWebpackPlugin()
    ]
};
