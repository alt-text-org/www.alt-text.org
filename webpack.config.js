const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: [
        "regenerator-runtime/runtime.js",
        path.resolve(__dirname, "src", "index.js"),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ],
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
        fallback: {
            buffer: require.resolve("buffer/"),
        },
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
    },
    devServer: {
        static: path.resolve(__dirname, "./dist"),
    },
    optimization: {
        minimize: false,
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development"),
            },
        }),
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
    ],
};
