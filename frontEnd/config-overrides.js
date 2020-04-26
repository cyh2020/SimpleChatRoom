const { override, fixBabelImports, addDecoratorsLegacy, addLessLoader } = require("customize-cra")

process.env.GENERATE_SOURCEMAP = "false";//关闭source map

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd", // antd按需加载
        libraryDirectory: "es",
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' },
    }),

    addDecoratorsLegacy() // 配置装饰器，如果不用装饰器，可以不要这一步，如果需要用装饰，还需要安装下面的插件
)