const colors = require('colors');
const path = require("path");
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

/** 【开发环境】是否需要使用cdn配置 */
const devNeedCdn = true;
/** 【全局】是否需要使用px转rem */
const needPx2rem = true;
/** 设置 1(rem) 等于 n (px)*/
const px2remValue = 10;
/** 【开发环境】是否需要使用px转rem */
const devNeedPx2rem = false;
/** 【生产环境】build构建后是否执行压缩操作至桌面*/
const compress = true;
/** 【生产环境】build构建后是否保留根目录打包源文件夹【compress=true才生效】*/
const saveDist = false;
/** 是否移动端开发[true/执行px转rem,入口src/main自动添加resize事件自动适配font-size至根元素]  【**以后更新将加载移动端专有api**】*/
const mobileDevelop = true;
/** 判断环境*/
const isProduction = process.env.NODE_ENV !== 'development';
/** 环境配置*/
let env = {
    "development":{
        BASE_API:'"/"',
        proxy: {
            "/": {
                target: "http://app-beta.com/",
                changeOrigin: true,
                pathRewrite: {
                    "^/": "/"
                }
            }
        }
    },
    "beta":{
        BASE_API:'"http://app-beta.com/"',
        OUTPUT_NAME:'dist-beta'
    },
    "delta":{
        BASE_API:'"http://app-delta.com/"',
        OUTPUT_NAME:'dist-delta'
    },
    "production":{
        BASE_API:'"http://app-production.com/"',
        OUTPUT_NAME:'dist-production'
    }
};
/**cdn配置*/
const cdn = {
    /**cdn：模块名称和模块作用域命名（对应window对象里面挂载的变量名称）*/
    externals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
    },
    /**css外链*/
    css: [

    ],
    /**js外链*/
    js: [
        'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
        'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js'
    ]
};

let outputDir = env[process.argv[process.argv.length-1]].OUTPUT_NAME;
let postcss_plugins =  [require('postcss-px2rem')({remUnit: px2remValue})];
console.log(colors.black('当前环境：').bgRed,'[',colors.red(process.argv[process.argv.length-1]),']\n');
console.log(colors.black('BASE_API：').bgGreen,colors.green(env[process.argv[process.argv.length-1]].BASE_API),'\n');

module.exports = {
    /**静态资源路径*/
    publicPath:'',
    /**输出文件名称 直接用env[process.argv[process.argv.length-1]].OUTPUT_NAME会有Bug,一直转build不停*/
    outputDir,
    /**放置生成的静态资源 (js、css、img、fonts) 的目录(相对于outputDir目录)*/
    assetsDir: "assets",
    /**入口index名称'index.html'[可带目录路径]*/
    indexPath: "index.html",
    /**文件是否带哈希*/
    filenameHashing: true,
    /**是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码*/
    lintOnSave: false,
    /**是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右*/
    runtimeCompiler: false,
    /**
     * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
       productionSourceMap作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
       productionSourceMap=true就可以像未加密的代码一样，准确的输出是哪一行哪一列有错*/
    productionSourceMap: false,
    /**多线程构建*/
    parallel:false,

    chainWebpack:config =>{
        /**移除 prefetch 插件*/
        isProduction&&
        config.plugins.delete("prefetch");
        /**移除 preload 插件*/
        isProduction&&
        config.plugins.delete("preload");
        /**[define]环境配置模块*/
        config
            .plugin('define')
            .tap(args => {
                args[0].env = env[process.argv[process.argv.length-1]];
                return args
            });
        /**[html]cnd配置插入html模块*/
        config
            .plugin('html')
            .tap(args => {
                args[0].cdn = cdn;
                args[0].title = 'VuePage';
                return args
            });
        /**压缩图片*/
        isProduction&&
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({ bypassOnDebug: true })
            .end();
        /**拆包*/
        isProduction&&
        config.optimization.splitChunks({
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 30000, // 依赖包超过300000bit将被单独打包
                maxSize: 0,
                automaticNameDelimiter:'-',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            return `chunk.${packageName.replace('@', '')}`;
                        },
                        priority:10
                    }
                }
            });
        /**打包后文件压缩zip  DesktopPath：桌面路径*/
        let DesktopPath = path.resolve( require('os').homedir() , 'Desktop' );
        isProduction&&
        config.plugin('compress')
            .use(FileManagerPlugin, [{
                onEnd: {
                    mkdir: [DesktopPath],//压缩后的文件路径
                    archive: [ //然后我们选择dist文件夹将之打包成dist.zip并放在根目录
                        { source: `./${outputDir}`, destination: path.resolve(DesktopPath,`${outputDir}.zip`)},//需要压缩的资源
                    ],
                    delete: [
                        `./${outputDir}`,
                    ],
                }
            }]);
        /**打包分析*/
        isProduction&&
        config
                .plugin("webpack-bundle-analyzer")
                .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);

    },

    configureWebpack:config =>{
        /**不打包cdn内容*/
       (isProduction || devNeedCdn)&&(config.externals = cdn.externals);
        /** Js压缩*/
        isProduction&&
        config.plugins.push(
            new UglifyJsPlugin({
                uglifyOptions: {
                    /**自动清除console*/
                    compress: {
                        // warnings: false, // 若打包错误，则注释这行
                        drop_debugger: true,
                        drop_console: true,
                        pure_funcs: ['console.log']
                    }
                },
                sourceMap: false,
                parallel: true
            })
        );
        /**Gzip压缩*/
        isProduction&&
        config.plugins.push(new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test:/\.js$|\.html$|.\css/, //匹配
            threshold: 10240,           //超过容量压缩
            minRatio: 0.8,              // 只有压缩率小于这个值的资源才会被处理
            deleteOriginalAssets:false  //是否删除原文件
        }))
    },

    devServer: {
        host: "localhost",
        port: 8080,
        https: false,
        open: false,   /**配置自动启动浏览器*/
        /**配置代理*/
        proxy: env["development"].proxy
    },
    css: {
        /**是否使用css分离插件*/
        extract: false,
        /**是否开启css 资源映射*/
        sourceMap: false,

        loaderOptions: {
            postcss: {
                plugins : postcss_plugins
            }
        }
    },
};