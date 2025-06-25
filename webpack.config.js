module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
                exclude: /node_modules\/react-datepicker/,
            },
        ],
    },
    ignoreWarnings: [
        {
            module: /node_modules\/react-datepicker/,
        },
    ],
};
