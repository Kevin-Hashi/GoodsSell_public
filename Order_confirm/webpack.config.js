const path = require('path');
const GasPlugin = require('gas-webpack-plugin');

/** @type import('webpack').Configuration */
module.exports = {
    mode: 'production',
    devtool: false,
    context: __dirname,
    entry: './ts/index.ts',
    output: {
        path: path.join(__dirname, 'dist', 'gas'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [new GasPlugin()]
};
