module.exports = (api) => {
    api.cache(true);

    return {
        presets: [
            [
                "@babel/preset-env",
                {
                    targets: {
                        node: "10.13.0",
                    },
                    modules: "commonjs",
                },
            ],
        ],
        plugins: ["@babel/plugin-proposal-class-properties"],
    };
};
