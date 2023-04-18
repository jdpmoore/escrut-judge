import { boot } from 'quasar/wrappers'
import { axiosError } from 'components/script/common'
import axios, { AxiosInstance } from 'axios'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: 'https://api.example.com' });
const axiosInstance = axios.create({
  baseURL: process.env.API,
  headers: {
    common: {
      'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=-1,private',
      competitorV: process.env.version ? process.env.version : '1.0.0',
    },
  },
})

function axiosEdit<valueType, ReturnType>(
  api: string,
  field: string,
  newValue: valueType
): Promise<ReturnType> {
  return new Promise<ReturnType>((resolve, reject) => {
    axiosInstance
      .put(api, {
        field,
        newValue,
      })
      .then(({ data }: { data: ReturnType }) => {
        resolve(data)
      })
      .catch((err) => {
        axiosError(err)
        reject()
      })
  })
}

// export default boot(({ app }) => {
//   // for use inside Vue files (Options API) through this.$axios and this.$api

//   app.config.globalProperties.$axios = axios;
//   // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
//   //       so you won't necessarily have to import axios in each vue file

//   app.config.globalProperties.$api = api;
//   // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
//   //       so you can easily perform requests against your app's API
// });

// export { api };

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axiosInstance
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = axios
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axiosInstance, axiosError, axiosEdit }
