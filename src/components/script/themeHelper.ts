import { v2 } from 'src/@types/command'
import { colors, getCssVar, setCssVar } from 'quasar'
// import { axiosInstance, axiosError } from 'boot/axios'
import { storeInstance } from 'boot/store'
const { brightness } = colors
function isDark(col) {
  // console.log(col, brightness(col))
  return brightness(col) < 128
}
function invColor(col) {
  return isDark(col) ? '#fff' : '#000'
}
export function isThemeDark() {
  const dark = getCssVar('dark')
  return colors.brightness(dark) < 128
}
const themeKeys = [
  'primary',
  'primary-inv',
  'secondary',
  'secondary-inv',
  'accent',
  'accent-inv',
  'dark',
  'dark-inv',
  'positive',
  'positive-inv',
  'negative',
  'negative-inv',
  'info',
  'info-inv',
  'warning',
  'warning-inv',
  // 'normal',
  // 'normal-inv',
  'highlighted',
  'highlighted-inv',
]

export function themeHelper() {
  function folder() {
    const host = window.location.host
      .split('.')
      .filter((o) => {
        return !['member', 'quakefire', 'com', 'co', 'uk'].includes(o)
      })
      .join('.')
      .split(':')[0]
      .split('/')[0]
    // console.log('host is', host)

    // return host === 'localhost' ? 'oudc' : host
    return host === 'localhost' ? 'ouvc' : host
  }

  function fullHost() {
    const host = window.location.host
      .split('.')
      // .filter((o) => {
      //   return !['member', 'quakefire', 'com', 'co', 'uk'].includes(o)
      // })
      .join('.')
      .split(':')[0]
      .split('/')[0]
    // console.log('full host is', host)
    // return host
    return host === 'localhost' ? 'member.oudc.co.uk' : host.toLowerCase()
  }

  function setTheme(circuit: v2.Circuit) {
    const { theme } = circuit
    if (theme) {
      console.log('now we set the theme', theme)
      themeKeys.forEach((o) => {
        if (o.includes('inv')) {
          const key = o.split('-')[0]
          if (theme[key]) {
            const invKey = `${key}-inv`
            console.log(invKey, invColor(theme[key]))
            setCssVar(invKey, invColor(theme[key]))
          }
        } else {
          console.log(o, theme[o])
          if (theme[o]) {
            setCssVar(o, theme[o])
          }
        }
      })
      setCssVar('positive-inv', '#000')
      storeInstance.commit('command/setIcon', theme.icon)
      storeInstance.commit('command/setLogo', theme.logo)
    }
    // keys.forEach((key) => {
    //   console.log(key, theme[key])
    //   if (theme[key]) {
    //     setCssVar(key, theme[key])
    //   }
    // })
  }

  return { folder, fullHost, setTheme }
}
