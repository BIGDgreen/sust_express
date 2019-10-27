const merge = require('webpack-merge');
const tsImportPluginFactory = require('ts-import-plugin');

// vue.config.js
module.exports = {
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    'background-color': '#1DA57A'
                }
            }
        }
    },
    // 配置ts-import-plugin
    chainWebpack: config => {
        config.module
            .rule('ts')
            .use('ts-loader')
            .tap(options => {
                options = merge(options, {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [
                            tsImportPluginFactory({
                                libraryName: 'vant',
                                libraryDirectory: 'es',
                                style: true
                            })
                        ]
                    }),
                    compilerOptions: {
                        module: 'es2015'
                    }
                });
                return options;
            });
    },
    devServer: {
        disableHostCheck: true,
        proxy: {
            // 配置跨域
            '/api': {
                // target: 'http://vuets-api.herokuapp.com/api/', // 接口地址
                target: 'http://192.168.0.116:8190/api/', // 接口地址
                ws: true, // 是否启用websockets
                changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: {
                    '^/api': '/' // 重写地址，将前缀/api转为/
                }
            }
        }
    }
}
