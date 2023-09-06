import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join } from 'path';
import { writeFileSync } from 'fs';
import path from 'path';
import ElementPlus from 'unplugin-element-plus/vite';
// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [
        vue(),
        ElementPlus(),
        // 自定义插件 micro 适配 vite
        (function () {
            let basePath = '';
            return {
                name: 'child-micro3',
                apply: 'build',
                configResolved(config) {
                    basePath = `${config.base}${config.build.assetsDir}/`;
                },
                writeBundle(options: any, bundle: any) {
                    for (const chunkName in bundle) {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                bundle,
                                chunkName,
                            )
                        ) {
                            const chunk: any = bundle[chunkName];
                            if (
                                chunk.fileName &&
                                chunk.fileName.endsWith('.js')
                            ) {
                                chunk.code = chunk.code.replace(
                                    /(from|import\()(\s*['"])(\.\.?\/)/g,
                                    (all, $1, $2, $3) => {
                                        return all.replace(
                                            $3,
                                            new URL($3, basePath),
                                        );
                                    },
                                );
                                const fullPath = join(
                                    options.dir,
                                    chunk.fileName,
                                );
                                writeFileSync(fullPath, chunk.code);
                            }
                        }
                    }
                },
            };
        })(),
    ],
    server: {
        host: '0.0.0.0',
        port: 4003,
    },
    base: `${process.env.NODE_ENV === 'production' ? '' : ''}/child-micro3/`,
    build: {
        sourcemap: true,
    },
    // base:'/child-micro3/',
});
