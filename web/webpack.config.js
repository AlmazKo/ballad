const path = require('path');

module.exports = {
    entry: {
        index: './src/index.ts',
        admin: './src/admin.ts'
    },

    resolve: {
        extensions: ['.ts']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }]
    },
    optimization: {
        minimize: true
    },
    devtool: 'source-map'
};