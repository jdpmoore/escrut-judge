<template>
  <q-page class="bg-dark">
    <div class="row flex-center">
      <q-card
        inline
        square
        flat
        style="min-width: 300px"
        class="full-width bg-dark"
      >
        <!-- <q-card-section v-if="school === 'earth'" class="q-pa-none">
          <div class="row flex-center img-container" style="max-height: 250px;">
            <img
              alt="Earth centre"
              class="img-fit"
              style=""
              :src="`/assets/${school}/banner.jpg`"
            />
          </div>
        </q-card-section> -->
        <q-card-section class="q-mt-md">
          <div class="row flex-center">
            <img alt="logo" :src="logo" width="300px" style="width: 300px" />
          </div>
          <q-inner-loading :showing="loggingIn">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </q-card-section>
        <form>
          <q-card-section
            class="column items-center justify-center text-center"
          >
            <!-- <q-input standout="bg-teal text-white" v-model="text" label="Custom standout" :dense="dense" /> -->
            <!-- <q-input
            v-model="credentials.email"
            outlined
            dark
            class="q-pa-sm"
            label-color="primary"
            label="Email address"
            style="width: 300px"
          >
            <template v-if="credentials.email" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop="credentials.email = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
          <q-input
            v-model="credentials.password"
            outlined
            dark
            class="q-pa-sm"
            label-color="primary"
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            @keyup.enter="login"
            style="width: 300px"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input> -->
          </q-card-section>
          <q-card-section
            class="row items-center text-center justify-center q-pt-none"
          >
            <q-btn
              class="q-ma-sm"
              color="accent"
              text-color="white"
              label="Login"
              style="width: 315px"
              :disabled="loggingIn"
              @click="loginPin"
            />
          </q-card-section>
        </form>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Common, userDetails, Versions } from '../@types/common'
import Echo from 'laravel-echo'
import AddNumber from 'components/dialog/AddNumber.vue'
// import { flare } from '@flareapp/flare-client'
// import client from 'socket.io-client'
declare global {
  interface Window {
    io: unknown
    Echo: Echo
  }
}

export default defineComponent({
  name: 'LoginPage',
  data() {
    return {
      loggingIn: false,
      isPwd: true,
      credentials: {
        email: '',
        password: '',
      },
    }
  },
  computed: {
    logo() {
      return this.$store.state.command.logo
    },
    userId() {
      return this.$store.state.command.userDetails.id
    },
    isLive() {
      if (process.env.LIVE === 'true') {
        return true
      } else {
        return false
      }
    },
  },
  created() {
    // flare.test()
    // process.env.DEV &&
    if (process.env.credentials) {
      const cred = process.env.credentials as unknown as {
        email: string
        password: string
      }[]
      this.credentials = cred[0]
    }
  },
  methods: {
    Echo,
    connectionDown(attemptNumber: number) {
      console.log('connection down:', attemptNumber)
      // this.colStatus = true
      // this.logIn()
    },
    connected() {
      console.log('connected')
      // this.colStatus = false
    },
    oldEcho(authKey: string) {
      window.io = require('socket.io-client')
      window.Echo = new this.Echo({
        broadcaster: 'socket.io',
        host: 'http://escrut20.universitydancesport.com:6002',
        namespace: '',
        client: window.io,
        forceTLS: false,
        auth: {
          headers: { Authorization: 'Bearer ' + authKey },
        },
      })
      window.Echo.connector.socket.on('connect', this.connected)
      window.Echo.connector.socket.on('disconnect', this.connectionDown)
      window.Echo.connector.socket.on('reconnecting', this.connectionDown)
      window.Echo.connector.socket.on('subscription_error', this.connectionDown)
      // window.Echo.options.auth.headers.Authorization = 'Bearer ' + window.jwttoken
      window.Echo.join('es-display.1')
        .listenForWhisper('announce', (e: unknown) => {
          console.log('announce', e)
          // this.state = 'announce'
          // this.announceText = e.displayData.announceText
          // this.$forceUpdate()
        })
        .listenForWhisper('number', (e: unknown) => {
          console.log('number', e)
          // this.coupleNo = e.displayData.number
          // if (e.isTeam) {
          //   app.state = 'teamNumber'
          //   app.uni = e.displayData.uni
          //   app.teamLetter = e.displayData.letter
          // } else {
          //   app.state = 'number'
          //   app.coupleLeader = e.displayData.leader
          //   app.coupleFollower = e.displayData.follower
          //   app.coupleDescriptor = e.displayData.descriptor
          // }
          // app.$forceUpdate()
        })
        .listenForWhisper('start', (e: unknown) => {
          console.log('start', e)
          // this.heatComps = ''
          // app.state = 'round'
          // app.eventName = e.currentEvent.eventName
          // app.roundText = e.currentEvent.roundText
          // app.heatDance = e.currentEvent.danceLetter
          // app.heatNo = e.currentEvent.heatNo
          // app.heatTotal = e.currentEvent.heats
          // app.nextEvent = e.nextEvent.eventName
          // if ('number' in e.currentEvent) {
          //   app.heatComps = e.currentEvent.number.join(', ')
          // }
          // app.$forceUpdate()
        })
        .listenForWhisper('results', (e: unknown) => {
          console.log('results', e)
          // app.heatComps = ''
          // app.state = 'results'
          // app.eventName = e.eventName
          // app.heatComps = e.placings
          // // app.roundText = e.currentEvent.roundText
          // // app.heatDance = e.currentEvent.danceLetter
          // // app.heatNo = e.currentEvent.heatNo
          // // app.heatTotal = e.currentEvent.heats
          // // app.nextEvent = e.nextEvent.eventName
          // // if ('number' in e.currentEvent) {
          // //   app.heatComps = e.currentEvent.number.join(', ')
          // // }
          // app.$forceUpdate()
        })
      window.Echo.join('es-display.2').listenForWhisper(
        'start',
        (e: unknown) => {
          console.log('other floor', e)
        }
      )
    },
    setCurrentVersion() {
      this.$axios
        .put(`/user/${this.userId}`, {
          field: 'command_v',
          newValue: this.$store.state.command.version,
        })
        .catch(this.$common.axiosError)
    },
    versionCheck({ command: lastVersion }: Versions) {
      console.log(lastVersion)
      if (!lastVersion) {
        this.setCurrentVersion()
      } else {
        const cloudVersion = lastVersion.split('.').map(parseFloat)
        const localVersion = this.$store.state.command.version
          .split('.')
          .map(parseFloat)
        let updateNeeded = false
        if (localVersion[0] > cloudVersion[0]) {
          updateNeeded = true
        } else if (
          localVersion[1] > cloudVersion[1] &&
          localVersion[0] === cloudVersion[0]
        ) {
          updateNeeded = true
        } else if (
          localVersion[2] > cloudVersion[2] &&
          localVersion[1] === cloudVersion[1] &&
          localVersion[0] === cloudVersion[0]
        ) {
          updateNeeded = true
        }
        console.log(localVersion, cloudVersion)
        if (updateNeeded) {
          this.$axios
            .get('/system/release-notes/command/latest')
            .then(({ data }) => {
              // console.log(data.version, localVersion.join('.'))
              if (data.version === localVersion.join('.')) {
                this.$q
                  .dialog({
                    dark: true,
                    title: `You have been updated to v${localVersion.join(
                      '.'
                    )}`,
                    html: true,
                    message: `The latest update contains:<br>${data.notes}`,
                    cancel: 'ok',
                    ok: 'release notes',
                    class: 'bg-primary text-white',
                  })
                  .onDismiss(() => {
                    this.setCurrentVersion()
                  })
                  .onOk(() => {
                    this.$router.push('/release-notes')
                  })
              } else {
                this.setCurrentVersion()
              }
            })
            .catch(this.$common.axiosError)
        }
      }
    },
    loginPin() {
      this.$q
        .dialog({
          component: AddNumber,
          componentProps: {
            title: 'Enter Passcode',
            pin: true,
          },
        })
        .onOk((pin: number) => {
          this.loggingIn = true
          this.$axios
            .post('/auth/judgelogin', { pin })
            .then((response) => {
              this.$store.commit('command/storePin', pin)
              console.log(response)
              this.$axios.defaults.headers.common.Authorization = `Bearer ${response.headers.authorization}`
              this.$store.commit(
                'command/storeAuth',
                response.headers.authorization
              )
              this.$store
                .dispatch('command/getUserDetails')
                .then((userDetails: userDetails) => {
                  this.versionCheck(userDetails.versions)
                  // this.$store.dispatch('GOstore/joinEchoNotifications')
                  this.$store.dispatch('command/getDances')
                  this.$store
                    .dispatch('command/getCompetition', response.data.compId)
                    .then(() => {
                      this.$store.dispatch('echo/connectEcho')
                      this.loggingIn = false
                      // if (userDetails.firstTime) {
                      //   this.firstLoginPopup()
                      // } else {
                      // if ('redirect' in this.$route.query) {
                      //   this.$router.push(`${this.$route.query.redirect}`)
                      // } else {
                      this.$router.replace('/judge')
                      // }
                      // }
                    })
                    .catch(() => {
                      this.loggingIn = false
                    })
                })
            })
            .catch(() => {
              this.loggingIn = false
              this.$q.notify({
                color: 'negative',
                position: 'bottom',
                message: 'Incorrect PIN',
                icon: 'report_problem',
              })
            })
        })
    },
    login() {
      this.loggingIn = true
      this.$axios
        .post('/auth/login', this.credentials)
        .then((response) => {
          console.log(response)
          this.$axios.defaults.headers.common.Authorization = `Bearer ${response.headers.authorization}`
          this.$store.commit(
            'command/storeAuth',
            response.headers.authorization
          )
          // this.oldEcho(response.data.Authorization)
          // console.log('did that work?')
          // return
          // window.io = require('socket.io-client')
          // if (window.Echo) {
          //   window.Echo.close()
          // }
          // window.Echo = new Echo({
          //   broadcaster: 'socket.io',
          //   host: 'http://escrut20.universitydancesport.com:6002',
          //   namespace: '',
          //   auth: {
          //     headers: {
          //       Authorization: 'Bearer ' + response.data.Authorization,
          //     },
          //   },
          // })
          // window.Echo.connector.socket.on('connect', this.connected)
          // window.Echo.connector.socket.on('disconnect', this.connectionDown)
          // window.Echo.connector.socket.on('reconnecting', this.connectionDown)
          // window.Echo.connector.socket.on('subscription_error', this.connectionDown)
          this.$store
            .dispatch('command/getUserDetails')
            .then((userDetails: userDetails) => {
              this.versionCheck(userDetails.versions)
              // this.$store.dispatch('GOstore/joinEchoNotifications')
              this.$store.dispatch('command/getDances')
              this.$store
                .dispatch('command/getCompetitions')
                .then(() => {
                  this.$store.dispatch('echo/connectEcho')
                  this.loggingIn = false
                  // if (userDetails.firstTime) {
                  //   this.firstLoginPopup()
                  // } else {
                  if ('redirect' in this.$route.query) {
                    this.$router.push(`${this.$route.query.redirect}`)
                  } else {
                    this.$router.push('/judge')
                  }
                  // }
                })
                .catch(() => {
                  this.loggingIn = false
                })
            })
          // .catch(() => {
          //   this.$q
          //     .dialog({
          //       dark: true,
          //       title: 'No staff role assigned',
          //       class: 'bg-primary text-primary-inv',
          //       html: true,
          //       message:
          //         'You do not appear to be a Greene\'s member of staff, redirecting to <a href="https://my.greenes.online"  style="color: lightblue;">https://my.greenes.online</a><br>If you are a staff member, please contact <a href="mailto:support.online@greenes.org.uk" style="color: lightblue;">support.online@greenes.org.uk</a>.',
          //       ok: {
          //         label: 'OK',
          //         outline: true,
          //         flat: true,
          //         color: 'amber',
          //       },
          //       color: 'primary',
          //     })
          //     .onOk(() => {
          //       window.location.replace('https://my.greenes.online/#/')
          //     })
          // })

          // this.$store.commit('command/storeUser', response.data)
          //

          // this.$store.dispatch('GOStaff/getUserDetails').then((userDetails) => {
          //   console.log(userDetails)
          // if (userDetails.firstTime) {
          //   this.firstLoginPopup()
          // } else {

          // }
          // })
        })
        .catch((err: Common.ErrorObject) => {
          this.loggingIn = false
          if (err.response && err.response.status === 401) {
            this.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Incorrect username and/or password',
              icon: 'report_problem',
            })
          } else if (err.response && err.response.status === 429) {
            this.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Network busy, please wait a few seconds and try again',
              icon: 'report_problem',
            })
          } else {
            this.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: err.message,
              icon: 'report_problem',
            })
          }
        })
    },
    firstLoginPopup() {
      const msg =
        'As this is your first time logging in, we need you to set a password.'
      this.$q
        .dialog({
          dark: true,
          title: 'Welcome',
          message: msg,
          class: 'bg-primary text-primary-inv',
        })
        .onDismiss(() => {
          void this.$router.push('/password/change')
        })
    },
    forgotPopup() {
      this.$q
        .dialog({
          dark: true,
          title: 'Reset password?',
          message: 'Do you wish to reset your password?',
          cancel: true,
          class: 'bg-primary text-primary-inv',
        })
        .onOk(() => {
          this.forgot()
        })
    },
    resetPopup() {
      const msg =
        'Please check your email for your reset password link. (' +
        this.credentials.email +
        ')'
      this.$q.dialog({
        dark: true,
        title: 'Password reset',
        message: msg,
        class: 'bg-primary',
      })
    },
    forgot() {
      this.loggingIn = true
      const toPost = '/auth/password/reset?email=' + this.credentials.email
      this.$axios
        .post(toPost)
        .then(() => {
          this.loggingIn = false
          this.resetPopup()
        })
        .catch((err: Common.ErrorObject) => {
          this.loggingIn = false
          if (err.response && err.response.status === 400) {
            this.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Email address not registered',
              icon: 'report_problem',
            })
          } else if (err.response && err.response.status === 429) {
            this.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Network busy, please wait a few seconds and try again',
              icon: 'report_problem',
            })
          } else {
            this.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: err.message,
              icon: 'report_problem',
            })
          }
        })
    },
  },
})
</script>
