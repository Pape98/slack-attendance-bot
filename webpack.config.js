const slsw = require('serverless-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    entry: slsw.lib.entries,
    module: {},
    target: 'node',
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: ['aws-sdk'], // in order to ignore all modules in node_modules folder
    plugins: [new ESLintPlugin()],
    mode: 'none',
};
