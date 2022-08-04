const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = (env, argv) => {
    let port = argv.port? argv.port : 3000;
    let host = argv.host? argv.host : "localhost";
    let mode = argv.mode? argv.mode : "production";

    return {
        mode: mode,
        entry: path.join(__dirname, 'src', "ts", 'main.ts'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
        },
        devServer: {
            allowedHosts: 'all',
            compress: true,
            port: port,
            host: host,
            hot: true,
            https: false,
        },
        devtool: 'source-map',

        resolve: { extensions: ['.ts', '.js'] },
        module: {
            rules: [
                { test: /\.ts$/, loader: 'ts-loader', },
            ]
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: 'src/assets', to: 'assets/' },
                { from: 'src/locale', to: 'locale/' },
            ]),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, "src", "index.html"),
            }),
        ],
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        sourceMap: false,
                        compress: {
                            sequences: true,
                            dead_code: true,
                            conditionals: true,
                            booleans: true,
                            unused: true,
                            if_return: true,
                            join_vars: true,
                            drop_console: true
                        },
                        mangle: { },
                        output: {
                            comments: false
                        }
                    },
                }),
            ],
        },
    }
};