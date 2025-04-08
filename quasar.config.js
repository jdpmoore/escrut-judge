/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js

/* eslint-disable @typescript-eslint/no-var-requires */

const { configure } = require('quasar/wrappers')
require('dotenv').config()
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || '0'
const execSync = require('child_process').execSync

// function getDistDir(process, ctx) {
//   let distDir = `dist/${ctx.modeName}`
//   if (process.env.LIVE) {
//     distDir = `${distDir}/prod`
//   } else {
//     distDir = `${distDir}/dev`
//   }
//   return distDir
// }

module.exports = configure(function (ctx) {
  const isLive = JSON.parse(process.env.LIVE)
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
      env: {
        API: process.env.API,
        PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
        LIVE: isLive,
        LOCAL: JSON.parse(process.env.LOCAL),
        FLARE: process.env.FLARE,
        credentials: JSON.parse(process.env.CREDENTIALS),
        version: version,
        VERSION_CHECK: `/system/webapp/version/judge${isLive ? '' : '/dev'}`,
      },
      // distDir: getDistDir(process, ctx),
      distDir: isLive
        ? 'dist/' + ctx.modeName + '/prod'
        : 'dist/' + ctx.modeName + '/dev',
      vueRouterMode: 'hash', // available values: 'hash', 'history'
      devtool: 'hidden-source-map',
      webpackDevtool: 'hidden-source-map',
      uglifyOptions: {
        compress: { drop_console: true },
        // compress: false,
        // keep_fnames: true,
        // // keep_fargs: true,
        // mangle: false
        // { drop_console: true },
      },
      sourcemap: 'hidden',
      extendWebpack(cfg) {
        const FlareWebpackPluginSourcemap = require('@flareapp/flare-webpack-plugin-sourcemap')
        const flarePlugin = new FlareWebpackPluginSourcemap({
          key: process.env.FLARE,
          removeSourcemaps: true,
        })
        cfg.plugins.push(flarePlugin)
        cfg.devtool = 'hidden-source-map'
        if (!cfg.output) {
          cfg.output = {}
        }
        cfg.output.filename = 'js/[name].js' //'js/[name].[contenthash:8].js'
        cfg.output.chunkFilename = 'js/[name].js' //'js/[name].[chunkhash:8].js'
        cfg.output.cssFilename = 'css/[name].js' //'js/[name].[chunkhash:8].js'
        cfg.output.cssChunkFilename = 'css/[name].js' //'js/[name].[chunkhash:8].js'
        cfg.plugins.forEach((plugin) => {
          // console.log(plugin)
          if (
            plugin.options?.filename?.includes('css') &&
            plugin.options?.chunkFilename?.includes('css')
          ) {
            plugin.options.filename = 'css/[name].css'
            plugin.options.chunkFilename = 'css/[name].css'
          }
        })
        // linting is slow in TS projects, we execute it only for production builds
        // if (ctx.prod) {
        //   cfg.module.rules.push({
        //     enforce: 'pre',
        //     test: /\.(js|vue)$/,.
        //     loader: 'eslint-loader',
        //     exclude: /node_modules/,
        //   })
        // }
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
      workboxOptions: {
        maximumFileSizeToCacheInBytes: 25000000,
        skipWaiting: true,
        clientsClaim: true,
        inlineWorkboxRuntime: true,
      }, // only for GenerateSW

      // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
      // if using workbox in InjectManifest mode
      // chainWebpackCustomSW (/* chain */) {},

      manifest: {
        name: 'eScrut Judges application',
        version: version, //updateVersion(version, process.env),
        short_name: 'eScrut Judges application',
        description: '',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#333',
        theme_color: '#333', // '#027be3'
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
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

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackMain(/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackMain also available besides this chainWebpackMain
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackPreload(/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackPreload also available besides this chainWebpackPreload
      },
    },
  }
})
