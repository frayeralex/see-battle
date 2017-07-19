var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        app: './src/main.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.[hash:8].js'
    },

    module: {
        rules: [
            {
                test: /\.styl$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: 'css-loader',

                    },
                    {
                        loader: 'stylus-loader',
                    }]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: [require('babel-plugin-transform-object-rest-spread')]
                    }
                }
            }
        ]
    },

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3000,
        stats: 'minimal',
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'sea-battle',
            template: './src/index.html',
            mobile: true,
            appMountId: 'app',
        })
    ]
};