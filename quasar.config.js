/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js

/* eslint-disable @typescript-eslint/no-var-requires */

import { defineConfig } from '#q-app/wrappers'
import 'dotenv/config.js'
import * as fs from 'fs'
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || '0'
import { execSync } from 'child_process'
import flareSourcemapUploader from '@flareapp/vite'
import { createHash } from 'crypto'

// function getDistDir(process, ctx) {
//   let distDir = `dist/${ctx.modeName}`
//   if (process.env.LIVE) {
//     distDir = `${distDir}/prod`
//   } else {
//     distDir = `${distDir}/dev`
//   }
//   return distDir
// }

export default defineConfig((ctx) => {
  const isLive = JSON.parse(process.env.LIVE)
  const isLocal = JSON.parse(process.env.LOCAL ?? 'false')
  const cred = process.env.CREDENTIALS ?? '[{"email": "","password":""}]'
  return {
    // https://v2.quasar.dev/quasar-cli-webpack/supporting-ts
    supportTS: {
      tsCheckerConfig: {
        eslint: {
          enabled: true,
          memoryLimit: 8192,
          files: './src/**/*.{ts,tsx,js,jsx,vue}',
        },
      },
    },
    eslint: {
      // fix: true,
      // include: [],
      // exclude: [],
      // rawOptions: {},
      warnings: true,
      errors: true,
    },
    // https://v2.quasar.dev/quasar-cli-webpack/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-webpack/boot-files
    boot: [
      // 'i18n',
      'axios',
      'utils',
      // 'v-sanitize',
      // 'vuelidate',
      'moment',
      'store',
      'router',
      'flare',
      'tippy',
    ],

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-css
    css: ['app.scss', 'prism.css', 'prism-coy.css', 'tippy.css'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-build
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        // browser: ['esnext'], // , 'edge88', 'firefox78', 'chrome87', 'safari13.1'
        node: 'node22',
      },
      env: {
        API: process.env.API,
        REVERB_APP_KEY: process.env.REVERB_APP_KEY,
        REVERB_HOST: process.env.REVERB_HOST,
        REVERB_PORT: process.env.REVERB_PORT,
        REVERB_SCHEME: process.env.REVERB_SCHEME,
        PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
        LIVE: isLive,
        LOCAL: isLocal,
        FLARE: process.env.FLARE,
        credentials: cred,
        version: version,
        VERSION_CHECK: `/system/webapp/version/judge${isLive ? '' : '/dev'}`,
        BROADCAST_DRIVER: process.env.BROADCAST_DRIVER,
      },
      // distDir: getDistDir(process, ctx),
      distDir: isLive
        ? 'dist/' + ctx.modeName + '/prod'
        : 'dist/' + ctx.modeName + '/dev',
      vueRouterMode: 'hash', // available values: 'hash', 'history'
      useFilenameHashes: false,
      typescript: {
        strict: true, // (recommended) enables strict settings for TypeScript
        vueShim: true, // required when using ESLint with type-checked rules, will generate a shim file for `*.vue` files
        extendTsConfig() {
          //tsConfig
          // You can use this hook to extend tsConfig dynamically
          // For basic use cases, you can still update the usual tsconfig.json file to override some settings
        },
      },
      vueDevtools: true,
      devtool: isLocal ? 'source-map' : 'hidden-source-map',
      sourcemap: isLocal ? true : 'hidden',
      vitePlugins: [
        flareSourcemapUploader({
          key: process.env.FLARE ?? '',
          removeSourcemaps: true,
        }),
        // [
        //   '@intlify/unplugin-vue-i18n/vite',
        //   {
        //     // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        //     // compositionOnly: false,

        //     // if you want to use named tokens in your Vue I18n messages, such as 'Hello {name}',
        //     // you need to set `runtimeOnly: false`
        //     // runtimeOnly: false,

        //     ssr: ctx.modeName === 'ssr',

        //     // you need to set i18n resource including paths !
        //     // include: [fileURLToPath(new URL('./src/i18n', import.meta.url))],
        //   },
        // ],
        // [
        //   'vite-plugin-checker',
        //   {
        //     vueTsc: {
        //       tsconfigPath: 'tsconfig.vue-tsc.json',
        //     },
        //     eslint: {
        //       lintCommand: 'eslint "./**/*.{js,ts,mjs,cjs,vue}"',
        //     },
        //   },
        //   { server: false },
        // ],
      ],
      extendViteConf(viteConf) {
        console.log('we extend', viteConf.define)
        if (viteConf.define) {
          viteConf.define['global'] = 'window'
        }
        if (viteConf.build) {
          viteConf.build.rollupOptions = {
            output: {
              assetFileNames: (assetInfo) => {
                const splitName = assetInfo.name?.split('.')
                const ext = splitName?.at(-1)
                if (ext == 'css') {
                  const hash = createHash('sha256')
                    .update(assetInfo.name ?? '')
                    .digest('hex')
                  return `assets/${hash}.[ext]`
                }
                return 'assets/[name].[ext]'
              },
              entryFileNames: 'assets/[name].js',
              chunkFileNames: (assetInfo) => {
                const theName = assetInfo.moduleIds.join(',')
                const hash = createHash('sha256').update(theName).digest('hex')
                return `assets/${hash}.js`
              },
              // manualChunks: (id) => {
              //   if (id.includes('src/pdf-js')) {
              //     return 'pdf-viewer'
              //   } else if (id.includes('node_modules')) {
              //     return 'vendor'
              //   } else {
              //     return 'index'
              //   }
              // },
              // manualChunks: (id) => {
              //   console.log(id)
              //   return id
              // },
            },
          }
        }
        if (isLive) {
          viteConf.esbuild = {
            drop: ['console', 'debugger'],
          }
        }
      },
      afterBuild(params) {
        // let output = ''
        execSync(`rm ${params.quasarConf.build.distDir}/*.js.map`, {
          encoding: 'utf-8',
        })
        // output = execSync(`ls ${params.quasarConf.build.distDir}`, {
        //   encoding: 'utf-8',
        // })
        // console.log(output)
      },
      // transpile: false,
      // publicPath: '/',

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://v2.quasar.dev/quasar-cli-webpack/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      // chainWebpack (/* chain */) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-devServer
    devServer: {
      server: {
        type: 'http',
      },
      port: 8266,
      open: true, // opens browser window automatically
      vueDevtools: true,
    },

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'Notify',
        'LocalStorage',
        'SessionStorage',
        'Loading',
        'LoadingBar',
        'Dialog',
        'Cookies',
      ],
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],
    sourceFiles: {
      // rootComponent: 'src/App.vue',
      // router: 'src/router/index',
      // store: 'src/store/index',
      pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
      pwaServiceWorker: 'src-pwa/custom-service-worker',
      pwaManifestFile: 'src-pwa/manifest.json',
      // pwaManifestFile: 'src-pwa/manifest.json',
      // electronMain: 'src-electron/electron-main',
    },
    // https://v2.quasar.dev/quasar-cli-webpack/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,
      // Tell browser when a file from the server should expire from cache (in ms)

      // chainWebpackWebserver (/* chain */) {},

      middlewares: [
        ctx.prod ? 'compression' : '',
        'render', // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-webpack/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      extendManifestJson(json) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        json.version = version
        return json
      },
      useCredentialsForManifestTag: false,
      injectPwaMetaTags: true,
      extendGenerateSWOptions(config) {
        config.inlineWorkboxRuntime = true
        config.maximumFileSizeToCacheInBytes = 25000000
      },

      metaVariables: {
        appleMobileWebAppCapable: 'yes',
        // appleMobileWebAppStatusBarStyle: 'black-translucent',
        msapplicationTileColor: '#323386',
      },

      // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
      // if using workbox in InjectManifest mode
      // chainWebpackCustomSW (/* chain */) {},
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/configuring-electron
    electron: {
      preloadScripts: ['electron-preload'],
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'es-judges',
      },
    },
  }
})
