/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Notify, Dialog, colors, Platform } from 'quasar' // extend date, openURL
// import sanitizeHTML from 'sanitize-html'
// import { Firebase } from 'boot/firebase'
import { axiosInstance } from 'boot/axios'
import { routerInstance } from 'boot/router'
import { storeInstance } from 'boot/store'
import Moment from 'moment-timezone'
import _ from 'lodash'
// import { boot } from 'quasar/wrappers'
// import { store } from 'src/store'
import { Common, Competitor } from '../../@types/common'
import md5 from 'md5'

export function axiosError(err: Common.ErrorObject, optionalMsg = ''): void {
  const isLocal = window.location.hostname === 'localhost'
  console.log(isLocal)
  // console.log(storeInstance)
  if (isLocal) {
    console.log(err)
    if (err.response) {
      console.log(err.response)
      console.log(err.response.data)
      console.log(err.response.data.error)
      console.log(err.response.status)
    }
    console.log(err.toString())
    if (err.request) {
      console.log(err.request)
      console.log(err.request.responseURL)
    }
  }
  // Firebase.logEvent('axiosError', {
  //   message: err.message,
  //   data: err.response ? JSON.stringify(err.response.data) : null,
  //   status: err.response ? err.response.status : null,
  //   request: JSON.stringify(err.request),
  //   API: err.request ? err.request.responseURL : null
  // })

  let message = ''
  if (isLocal) {
    if (err.message) {
      message = err.message
    } else if (err.response) {
      if (err.response.data) {
        if (err.response.data.error) {
          message = err.response.data.error
        } else if (err.response.data.message) {
          message = err.response.data.message
        } else if (err.response.data.exception) {
          message = err.response.data.exception
        } else {
          message = JSON.stringify(err.response.data)
        }
      } else {
        switch (err.response.status) {
          case 400:
            message =
              'An error has occurred, if this is the first time you have encountered this, please report the error  (400)'
            break
          case 401:
            message = 'Login expired'
            break
          case 402:
            message = 'Not your file'
            break
          case 403:
            message = 'Unauthorized'
            break
          case 422:
            message = 'File type does not match extension'
            break
          case 429:
            message =
              'Network busy, please wait a few seconds and try again (429)'
            break
          case 503:
            message =
              'Network busy, please wait a few seconds and try again (503)'
            break
          default:
            message = err.message
        }
      }
    } else {
      message = err.toString()
      if (optionalMsg) {
        message = message + ' ' + optionalMsg
      }
    }
    message =
      err.response && err.response.status
        ? `${err.response.status}: ${message}`
        : message
  } else {
    switch (err?.response?.status) {
      case 400:
        message =
          'An error has occurred, if this is the first time you have encountered this, please report the error  (400)'
        break
      case 401:
        message = 'Login expired'
        break
      case 402:
        message = 'Not your file'
        break
      case 403:
        message = 'Unauthorized user, please log in'
        break
      case 404:
        message =
          'This command has not been recognised, if this is the first time you have encountered this, please report the error (404)'
        // err.message
        break
      case 422:
        message = 'File type does not match extension'
        break
      case 429:
        message = 'Network busy, please wait a few seconds and try again (429)'
        break
      case 500:
        message =
          'A server error has occured, if this is the first time you have encountered this, please report the error (500)'
        break
      case 503:
        message = 'Network busy, please wait a few seconds and try again (503)'
        break
      default:
        message = 'An unknown error has occured'
    }
  }
  if (
    err.response &&
    err.response.data &&
    typeof err.response.data === 'string'
  ) {
    message = err.response.data
  }
  // @ts-ignore
  let actions = []
  let duration = 5000
  let errColor = 'warning'
  let icon = 'info'
  if (err.response && err.response.status && err.response.status > 499) {
    errColor = 'negative'
    icon = 'report_problem'
  }
  if (err.response && err.response.status && err.response.status > 499) {
    duration = 60000
    actions = [
      {
        label: 'Report',
        color: 'warning',
        // lightOrDark(errColor) ? 'accent' : 'charcoal',
        handler: () => {
          reportError(err, optionalMsg)
        },
      },
      {
        label: 'Dismiss',
        color: 'warning',
        // lightOrDark(errColor) ? 'accent' : 'charcoal',
        handler: () => {
          //
        },
      },
    ]
  } else if (
    err.response &&
    err.response.status &&
    err.response.status === 401
  ) {
    duration = 10000
    actions = [
      // {
      //   label: 'Report',
      //   color: lightOrDark(errColor) ? 'accent' : 'charcoal',
      //   handler: () => {
      //     reportError(err, optionalMsg)
      //   },
      // },
      {
        label: 'Dismiss',
        color: lightOrDark(errColor) ? 'accent' : 'charcoal',
        handler: () => {
          //
        },
      },
    ]
  } else if (err.response && err.response.status && err.response.status < 500) {
    duration = 10000
    actions = [
      {
        label: 'Report',
        color: lightOrDark(errColor) ? 'accent' : 'charcoal',
        handler: () => {
          reportError(err, optionalMsg)
        },
      },
      {
        label: 'Dismiss',
        color: lightOrDark(errColor) ? 'accent' : 'charcoal',
        handler: () => {
          //
        },
      },
    ]
  }
  Notify.create({
    color: errColor,
    position: 'bottom',
    textColor: lightOrDark(errColor) ? 'white' : 'black',
    message: message,
    icon: icon,
    // @ts-ignore
    actions: actions,
    timeout: duration,
  })
  if (
    axiosInstance.defaults.headers.common.Authorization === '' ||
    err?.response?.status === 401
  ) {
    popup({
      title: 'User not logged in',
      message: 'Please log in or register before trying to access this page',
    })
    routerInstance.push('/login')
  }
}

function reportError(err: Common.ErrorObject, optionalMsg: string) {
  Dialog.create({
    dark: true,
    title: 'Bug report',
    message:
      'Please add as much detail as to what you were doing when this error occurred, including any steps which can repeat it',
    cancel: true,
    class: 'bg-primary text-white',
    prompt: {
      model: '',
      type: 'text',
    },
    persistent: true,
  }).onOk((data: string) => {
    // const storeInstance = useStore()
    let responseString = ''
    if (err.response) {
      err.response.headers.Authorization = 'stripped'
      err.response.config.headers.Authorization = 'stripped'
      responseString = JSON.stringify(err.response)
    }
    const toSubmit = {
      host: window.location.host,
      route: routerInstance.currentRoute.value.fullPath,
      message: err.message,
      userAgent: Platform.userAgent,
      platform: JSON.stringify(Platform.is),
      description: data,
      optionalMsg: optionalMsg,
      response: responseString,
      status: err.response ? err.response.status : null,
      request: JSON.stringify(err.request),
      API: err.request ? err.request.responseURL : null,
      // userId: storeInstance.state.GOStaff.userDetails.id,
      userId: storeInstance.state.command.userDetails?.id,
      version: storeInstance.state.command.version,
      app: 'competitor',
    }

    console.log(toSubmit)
    axiosInstance
      .post('/error', toSubmit)
      .then(() => {
        popup({
          title: 'Report submitted',
          message:
            'Your bug report has been submitted to the eScrut support team',
        })
      })
      .catch((err) => {
        console.log(err)
      })
    // .catch(err => {
    //   Dialog.create({
    //     dark: true,
    //     title: 'Report failed',
    //     class: 'bg-primary text-white',
    //     html: true,
    //     message:
    //       'There was a further error when trying to submit the bug report, please contact support.online@greenes.org.uk.',
    //     // <a href="mailto:support.online@greenes.org.uk?subject=GO%20Error%20Report&body=${JSON.stringify(
    //     //   toSubmit
    //     // )}&" style="color: lightblue;">
    //     ok: {
    //       label: 'OK',
    //       outline: true,
    //       flat: true,
    //       color: 'amber'
    //     },
    //     color: 'primary'
    //   }).onOk(() => {
    //     openURL(
    //       `mailto:support.online@greenes.org.uk?subject=GO%20Error%20Report&body=${JSON.stringify(
    //         toSubmit
    //       )}&`
    //     )
    //   })
    // })
  })
}

interface VueError {
  stack: unknown
  message: unknown
  request: unknown
}

export function bugPost(errIn: unknown, vm: unknown, info: unknown) {
  const err = errIn as VueError
  if (window.location.hostname === 'localhost') {
    return
  }
  const route = routerInstance.currentRoute.value.fullPath
  const hash = md5(JSON.stringify({ route, err }))
  const toSubmit = {
    type: 'vue',
    host: window.location.host,
    url: window.location.href,
    route,
    userAgent: Platform.userAgent,
    platform: JSON.stringify(Platform.is),
    error: err.stack,
    message: err.message,
    description: err.message,
    info: info,
    request: JSON.stringify(err.request),
    userId: storeInstance.state.command.userDetails?.id,
    version: storeInstance.state.command.version,
    app: 'competitor',
    // org:
    //   storeInstance.state.tmr.user && storeInstance.state.tmr.user.org
    //     ? storeInstance.state.tmr.user.org.id
    //     : 0,
    // centre: storeInstance.state.tmr.user.centre,
    // department:
    //   storeInstance.state.tmr.user && storeInstance.state.tmr.user.department
    //     ? storeInstance.state.tmr.user.department.id
    //     : 0,
    status: 'submitted',
    hash,
  }

  console.log(toSubmit, err)
  // axiosInstance.post('/bug', toSubmit)
  // .catch(axiosError)
  // .then(() => {
  //   popup({
  //     title: 'Report submitted',
  //     message: 'Your bug report has been submitted to the TR2AIL support team'
  //   })
  // })
}

export function ordinal_suffix_of(i: number) {
  const j = i % 10,
    k = i % 100
  if (j === 1 && k !== 11) {
    return i + 'st'
  }
  if (j === 2 && k !== 12) {
    return i + 'nd'
  }
  if (j === 3 && k !== 13) {
    return i + 'rd'
  }
  return i + 'th'
}

export function roundText(roundString: string) {
  if (roundString === 'SF') {
    return 'Semi-final'
  } else if (roundString === 'F') {
    return 'Final'
  } else {
    return `Round ${roundString}`
  }
}

export function roundSort(a: string, b: string) {
  if (a == 'F') {
    return 1
  }
  if (b == 'F') {
    return -1
  }
  if (a == 'PO') {
    return 1
  }
  if (b == 'PO') {
    return -1
  }
  if (a == 'SF') {
    return 1
  }
  if (b == 'SF') {
    return -1
  }
  return Number(a) > Number(b) ? 1 : Number(a) < Number(b) ? -1 : 0
}

export function popup(details: Common.PopupDetails) {
  // console.log(details)
  return Dialog.create({
    dark: true,
    title: details.title,
    message: details.message,
    class: 'bg-primary',
    html: details.html,
    persistent: details.persistent ?? false,
  })
}

export function lightOrDark(colorIn: string) {
  let color = colorIn
  if (!colorIn) {
    return true
  }
  const brandColor = colors.getPaletteColor(colorIn)
  if (brandColor) {
    color = brandColor
  } else if (colorIn === 'amber') {
    color = '#FFFFFF'
  } else {
    const d = document.createElement('div')
    d.style.color = colorIn
    document.body.appendChild(d)
    color = window.getComputedStyle(d).color
  }
  // console.log(color)
  // Variables for red, green, blue values
  let r, g, b

  // Check the format of the color, HEX or RGB?
  if (/^rgb/.exec(color)) {
    // If RGB --> store the red, green, blue values in separate variables
    const colors =
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.exec(color)
    if (colors) {
      r = colors[1]
      g = colors[2]
      b = colors[3]
    }
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    // @ts-ignore
    color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))
    // @ts-ignore
    r = color >> 16
    // @ts-ignore
    g = (color >> 8) & 255
    // @ts-ignore
    b = color & 255
  }
  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  // @ts-ignore
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
  // Using the HSP value, determine whether the color is light or dark
  // 127.5
  if (hsp > 127.5) {
    return false
  } else {
    return true
  }
}

export const acceptableFileTypes = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.JPG',
  '.JPEG',
  '.PNG',
  '.GIF',
  '.mp3',
  '.ogg',
  '.mpga',
  '.mp4',
  '.mpeg',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.pdf',
  '.odt',
  '.DOC',
  '.DOCX',
  '.PDF',
  '.ODT',
  '.xlsx',
  '.XLSX',
]

export function blankAvatar(): string {
  return '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AAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAKiAAAAAAAAqIAAAAACACggAAAAAoAICAAAAAFi6pmn+DyX0qPDXkk45AAAAAElFTkSuQmCC'
}

// export default { blankAvatar }
export const sanitizeRules = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'nl',
    'li',
    'b',
    'i',
    'strong',
    'em',
    'strike',
    'abbr',
    'code',
    'hr',
    'br',
    'div',
    'table',
    'thead',
    'caption',
    'tbody',
    'tr',
    'th',
    'td',
    'pre',
    'iframe',
    'font',
    'sup',
    'sub',
    'u',
    'span',
  ],
  disallowedTagsMode: 'discard',
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    // We don't currently allow img itself by default, but this
    // would make sense if we did. You could add srcset here,
    // and if you do the URL is checked for safety
    font: ['face', 'size'],
    img: ['src'],
    p: ['style'],
    b: ['style'],
    i: ['style'],
    div: ['style'],
    span: ['style'],
    code: ['style'],
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [
    'img',
    'br',
    'hr',
    'area',
    'base',
    'basefont',
    'input',
    'link',
    'meta',
  ],
  // URL schemes we permit
  allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
  allowProtocolRelative: true,
  enforceHtmlBoundary: false,
  allowedStyles: {
    '*': {
      // Match HEX and RGB
      color: [
        /^#(0x)?[0-9a-f]+$/i,
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
      ],
      // color: [/.*/],
      background: [
        /^#(0x)?[0-9a-f]+$/i,
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
      ],
      'background-color': [
        /^#(0x)?[0-9a-f]+$/i,
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
      ],
      // 'background-color': [/.*/],
      'text-decoration': [/.*/],
      'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
      // Match any number with px, em, or %
      'font-size': [/^\d+(?:px|em|%)$/],
      'font-family': [/.*/],
      border: [/.*/],
      'border-radius': [/.*/],
      padding: [/.*/],
      'line-height': [/[-+]?([0-9]*\.[0-9]+|[0-9]+)/],
    },
  },
}

export function makePDF(idTag: string, title: string, test: boolean) {
  const makingDialog = Dialog.create({
    message: 'Creating PDF',
    dark: true,
    class: 'bg-charcoal',
    progress: {
      // spinner: QSpinnerGears,
      color: 'amber',
    },
    persistent: true,
    ok: false,
  })
  const htmlContent = document.getElementById(idTag)?.innerHTML
  console.log('content', htmlContent)
  if (htmlContent) {
    const toPost: { htmlContent: string; pdfTitle: string; runTest?: string } =
      {
        htmlContent,
        pdfTitle: `${title}.pdf`,
      }
    if (test) {
      toPost.runTest = 'please'
    }
    axiosInstance
      .post('/pdf/make', toPost)
      .then(({ data }) => {
        const elem = document.createElement('a')
        elem.style.cssText = 'display: none;'
        elem.download = data.title
        elem.href = 'data:application/octet-stream;base64,' + data.fileData
        elem.id = 'downloadTheFile'
        // document.body.appendChild(elem)
        setTimeout(() => {
          makingDialog.hide()
          elem.click()
        }, 1500)
      })
      .catch((err) => {
        axiosError(err)
        makingDialog.hide()
      })
  } else {
    makingDialog.hide()
  }
}

export function fileType(contentType: string) {
  switch (contentType.toLowerCase()) {
    case 'candidatespecarr':
      return {
        color: 'primary',
        icon: 'assessment',
        title: 'Candidate special access arrangement documents',
      }
    case 'emailattach':
      return {
        color: 'blue',
        icon: 'attach_email',
        title: 'Email attachment',
      }
    case 'rationale':
      return {
        color: 'green',
        icon: 'assessment',
        title: 'Exam rationale',
      }
    case 'coursefile':
      return {
        color: 'blue',
        icon: 'insert_drive_file',
        title: 'Course file',
      }
    case 'cagevidence':
      return {
        color: 'blue',
        icon: 'insert_drive_file',
        title: 'CAG Evidence',
      }
    case 'cagadoc':
      return {
        color: 'primary',
        icon: 'assessment',
        title: 'CAG Assessment Document',
      }
    case 'avatar':
      return {
        color: 'green',
        icon: 'person',
        title: 'Profile photograph',
      }
    case 'offphoto':
      return {
        color: 'green',
        icon: 'person',
        title: 'Profile photograph',
      }
    case 'offdoc':
      return {
        color: 'blue',
        icon: 'insert_drive_file',
        title: 'Official documents',
      }
    case 'iddoc':
      return {
        color: 'accent',
        icon: 'fingerprint',
        title: 'Identification document',
      }
    case 'bundledoc':
      return {
        color: 'blue',
        icon: 'assignment',
        title: 'Sample work',
      }
    case 'bd-extra':
      return {
        color: 'red',
        icon: 'insert_drive_file',
        title: 'Exam board documentation',
      }
    case 'exampaper':
      return {
        color: 'accent',
        icon: 'assessment',
        title: 'Exam paper',
      }
    case 'cagscript':
      return {
        color: 'positive',
        icon: 'assignment',
        title: 'Mock CAG exam script',
      }
    case 'cagmarkscr':
      return {
        color: 'blue',
        icon: 'assignment',
        title: 'Marked CAG exam script',
      }
    case 'examscript':
      return {
        color: 'accent',
        icon: 'assessment',
        title: 'Mock exam script',
      }
    case 'image':
      return {
        color: 'blue',
        icon: 'image',
        title: 'Image',
      }
    case 'doc':
      return {
        color: 'accent',
        icon: 'insert_drive_file',
        title: 'Document',
      }
    case 'teachermw':
      return {
        color: 'green',
        icon: 'assignment',
        title: 'Teacher marked work',
      }
    case 'cagtevid':
      return {
        color: 'green',
        icon: 'assignment',
        title: 'CAG external tutor marked work',
      }
    case 'teachersf':
      return {
        color: 'blue',
        icon: 'insert_drive_file',
        title: 'Teacher supporting files',
      }
    case 'ref-other':
      return {
        color: 'red',
        icon: 'insert_drive_file',
        title: 'Reference files (other)',
      }
    case 'markedexam':
      return {
        color: 'red',
        icon: 'assignment',
        title: 'Marked exam script',
      }
    case 'tutreport':
      return {
        color: 'blue',
        icon: 'assessment',
        title: 'Tutorial work',
      }
    case 'cagtrans':
      return {
        color: 'green',
        icon: 'assessment',
        title: 'Candidate transcript',
      }
    case 'expenseclaim':
      return {
        color: 'purple',
        icon: 'account_balance_wallet',
        title: 'Expenses claim',
      }
    case 'homework':
      return {
        color: 'green',
        icon: 'assignment',
        title: 'Homework file',
      }
    case 'studenthomework':
      return {
        color: 'blue',
        icon: 'assignment',
        title: 'Student homework files',
      }
    case 'shomework':
      return {
        color: 'blue',
        icon: 'assignment',
        title: 'Student homework files',
      }
    case 'markedhomework':
      return {
        color: 'green',
        icon: 'assignment_turned_in',
        title: 'Marked homework files',
      }
    case 'mhomework':
      return {
        color: 'green',
        icon: 'assignment_turned_in',
        title: 'Marked homework files',
      }
    case 'xerobill':
      return {
        color: 'amber',
        icon: 'payments',
        title: 'Bill files',
      }
    default:
      return {
        color: 'black',
        icon: 'help',
        title: contentType,
      }
  }
}

export function fromHumanReadable(size: string) {
  const scale = size.slice(size.length - 2, size.length).toLowerCase()
  const coeff = parseFloat(size.slice(0, size.length - 2))
  const k = 1024
  const sizeMap = { kb: 1, mb: 2, gb: 3, tb: 4 }
  if (Object.keys(sizeMap).includes(scale)) {
    // @ts-ignore
    return coeff * k ** sizeMap[scale]
  } else {
    return 100 * k ** sizeMap.mb
  }
}

export function toHumanReadable(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function customSortRank(a: string, b: string) {
  // const x = descending ? b : a
  // const y = descending ? a : b
  return parseInt(a, 10) - parseInt(b, 10)
}

export function sortDates(a: Common.LaravelDate, b: Common.LaravelDate) {
  if (!a) {
    return -1
  }
  if (!b) {
    return 1
  }
  return Moment(`${a.date}Z`).isBefore(Moment(`${b.date}Z`)) ? -1 : 1
}

export function dateFormat(dateObj: Common.LaravelDate, format: string) {
  let momentFormat = 'DD/MM/YYYY'
  if (typeof format === 'string') {
    momentFormat = format
  }
  if (dateObj) {
    return Moment(`${dateObj.date}Z`).format(momentFormat)
  }
  return ''
}

export function shareLocation(title: string) {
  navigator.clipboard.writeText(`${window.location}`)
  Dialog.create({
    title: title,
    message: `The link below has been copied to your clipboard<br/><a href="${window.location}" target="_blank" class="text-info">${window.location}</a>`,
    html: true,
    dark: true,
    class: 'bg-dark text-dark-inv',
  })
}

interface WeightedCompetitor extends Competitor {
  ivdc22Rank?: number
}
import Form from 'src/components/dialog/FormDialog.vue'
export function generateNumbers(
  title: string,
  entries: WeightedCompetitor[],
  exclude: number[],
  team = false
) {
  const numberFormFields = [
    {
      type: 'header',
      title: `Generate numbers for ${title}`,
    },
    {
      type: 'p',
      text: 'Please enter the range of numbers below',
    },
    {
      type: 'input',
      name: 'low',
      label: 'First number',
      validation: { content: 'numeric' },
    },
    {
      type: 'input',
      name: 'high',
      label: 'Last number',
      validation: { content: 'numeric' },
    },
    {
      type: 'p',
      text: 'And any numbers you specifically want to exclude, separated by commas (i.e. because you have reserved the number for a specific couple)',
    },
    {
      type: 'input',
      name: 'exclude',
      value: exclude.join(','),
      label: 'Exclude',
    },
    // {
    //   type: 'checkbox',
    //   name: 'exclude',
    //   text: 'Issue identical numbers to duplicate leaders (i.e. where they have entered with multiple partners)',
    // },
  ]
  return new Promise<Competitor[]>((resolve) => {
    Dialog.create({
      component: Form,
      componentProps: {
        fields: numberFormFields,
        clear: 'cancel',
        cancel: true,
      },
    }).onOk((data) => {
      let entriesToAssign = entries.filter((o) => {
        return !o.number
      })
      const toExclude = data.exclude.match(/\d+/g)?.map(Number) ?? []
      const numberRange = _.range(
        Number(data.low),
        Number(data.high) + 1
      ).filter((n) => {
        return !toExclude.includes(n)
      })
      if (numberRange.length < entriesToAssign.length) {
        popup({
          title: 'Insufficient numbers',
          message: `There are ${numberRange.length} numbers for ${entriesToAssign.length} couples, please check and try again.`,
        })
      } else {
        const randomNumberRange = _.shuffle(
          numberRange.slice(0, entriesToAssign.length)
        )
        if (team) {
          entriesToAssign = _.sortBy(entriesToAssign, 'ivdc22Rank')
          console.log('sorted', entriesToAssign)
          let allNumbers = numberRange.slice(0, entriesToAssign.length)
          const people: Competitor[] = []
          for (const teamEntry of entriesToAssign) {
            const assigned = people.map((person) => {
              return person.number
            })
            const weighted = allNumbers.map((num) => {
              let weight =
                _.min(
                  assigned.map((ass) => {
                    return Math.abs(num - ass)
                  })
                ) || 1
              weight = weight ** 1.5
              console.log('weight', weight)
              return { item: num, weight }
            })
            const randomSample = weighted_random(weighted)
            people.push({ ...teamEntry, number: randomSample })
            allNumbers = allNumbers.filter((num) => {
              return num !== randomSample
            })
          }
          resolve(people)
        } else {
          const people = entriesToAssign.map((entry, index) => {
            return { ...entry, number: randomNumberRange[index] }
          })
          resolve(people)
        }
        //   showEntriesByEvent(title, people, false).onOk((data) => {
        //     if (data != 'cancel') {
        //       const toPost = people.map((o) => {
        //         return {
        //           id: o.id,
        //           number: o.number,
        //         }
        //       })
        //       console.log(toPost)
        //       axiosInstance
        //         .post('/numbers/add', { numberallocations: toPost })
        //         .then(() => {
        //           resolve()
        //         })
        //         .catch((err) => {
        //           axiosError(err)
        //           reject(err)
        //         })
        //     }
        //   })
      }
    })
  })
}
export function weighted_random(options: { weight: number; item: number }[]) {
  const weights: number[] = []
  let i = 0
  for (i = 0; i < options.length; i++) {
    weights[i] = options[i].weight + (weights[i - 1] || 0)
  }

  const random = Math.random() * weights[weights.length - 1]

  for (i = 0; i < weights.length; i++) {
    if (weights[i] > random) break
  }
  return options[i].item
}

import Table from 'src/components/dialog/TableDialog.vue'
export function showEntriesByEvent(
  title: string,
  entries: Competitor[],
  hideFooter = true
) {
  const headers = [
    {
      name: 'number',
      label: 'Number',
      align: 'left',
      field: 'number',
      sortable: true,
    },
    {
      name: 'leader',
      label: 'Leader',
      align: 'left',
      field: 'leader',
      sortable: true,
    },
    {
      name: 'follower',
      label: 'Follower',
      align: 'left',
      field: 'follower',
      sortable: true,
    },
    {
      name: 'university',
      label: 'University',
      align: 'left',
      field: 'descriptor',
      sortable: true,
    },
  ]
  return Dialog.create({
    component: Table,
    // parent: this,
    componentProps: {
      headers: headers,
      data: entries,
      title: title,
      // preSelected,
      hideFooter,
      selection: 'none',
      tableTitle: 'Numbers to allocate',
      rowKey: 'id',
      cancel: {
        label: 'Cancel',
        color: 'negative',
      },
      ok: { label: 'Ok' },
      persistent: true,
    },
  })
}
