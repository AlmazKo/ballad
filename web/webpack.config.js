const path = require('path');

module.exports = {
    entry: './src/index.ts',
    resolve: {
        extensions: ['.ts']
    },
    output: {
        filename: 'index.js',
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
        minimize: false
    },
};