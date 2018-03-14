//relative path
const path = require('path');
//uglify
const babiliPlugin = require('babili-webpack-plugin');
//extract css to separed file
const extractTextPlugin = require('extract-text-webpack-plugin');
//css minify
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

//for global jquery
const webpack = require('webpack');

//import 
const HtmlWebpackPlugin = require('html-webpack-plugin');

let plugins = [];

plugins.push(
    new extractTextPlugin("styles.css")
);
plugins.push(
    new webpack.ProvidePlugin({
        $: 'jquery/dist/jquery.js',
        jQuery: 'jquery/dist/jquery.js'
    })
);

plugins.push(
    new webpack.optimize.CommonsChunkPlugin(
        {
            name: 'vendor',
            filename: 'vendor.bundle.js'
        }
    )
);

plugins.push(new HtmlWebpackPlugin({
    hash: true,
    minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
    },    
    filename: 'index.html',
    template: __dirname + '/main.html'
}));

let SERVICE_URL = JSON.stringify('http://localhost:3000');

if (process.env.NODE_ENV == 'production') {
    SERVICE_URL= JSON.stringify('http://api.com:3000');
    plugins.push(new babiliPlugin());
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
    plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
            discardComments: {
                removeAll: true
            }
        },
        canPrint: true
    }));
}
plugins.push(new webpack.DefinePlugin({ SERVICE_URL }))
module.exports = {
    entry: {
        app: './app-src/app.js',
        vendor: ['jquery', 'bootstrap', 'reflect-metadata']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        //file per file
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            }
        ]
    },
    plugins: plugins
}