module.exports = {
    plugins: [
    require("postcss-nested")({}),
    require("postcss-preset-env")({
      stage: 1,
      features: {
        "nesting-rules": false,
      },
    }),
    require("autoprefixer")({}),
    // require("postcss-combine-media-query")(),
    require("postcss-sort-media-queries")({
      sort: "mobile-first", // デフォルト値
    }),
    require("css-declaration-sorter")({
      order: "smacss",
    }),
    // require("cssnano")({}),
  ],
};
