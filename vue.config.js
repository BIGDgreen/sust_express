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
    }
};
