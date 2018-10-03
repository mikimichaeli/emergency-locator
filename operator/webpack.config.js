const path = require('path');
const webpack = require('webpack');
const debug = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: debug ? 'development' : 'production',
    context: path.join(__dirname, 'client'),
    devtool: debug ? 'inline-sourcemap' : false,
    entry: path.join(__dirname, 'client', 'app.jsx'),
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'env', 'stage-2'],
                    plugins: ['react-html-attrs', "transform-class-properties"],
                }
            }
        }]
    },
    output: {
        path: path.join(__dirname, 'public', 'js'),
        filename: 'client.min.js'
    },
    watch: debug
};