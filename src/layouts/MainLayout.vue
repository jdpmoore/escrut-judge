<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar class="bg-dark ivdalines">
        <q-btn
          flat
          dense
          :disable="$store.state.command.timetable.length === 0"
          round
          icon="schedule"
          aria-label="Timetable"
          @click="showTimetable = !showTimetable"
        />
        <q-avatar v-if="!$q.screen.lt.sm" size="40px" class="q-ma-sm">
          <!-- <img src="assets/ivda/ivda_logo_only.svg" /> -->
          <q-icon v-if="isConnected" color="positive" name="wifi" size="md" />
          <q-icon
            v-if="!isConnected"
            color="negative"
            name="wifi_off"
            size="md"
          />
        </q-avatar>
        <q-toolbar-title>
          {{ toolbarTitle }}
        </q-toolbar-title>
        <!-- <div class="row items-center no-wrap">
          <div class="col">
            <q-btn
              flat
              dense
              class="q-px-sm"
              label="Display"
              icon="airplay"
              :color="isConnected ? 'positive' : 'negative'"
            >
              <j-menu :menu-items="displayMenu" @selected="handleDisplayMenu">
              </j-menu>
            </q-btn>
          </div>
        </div> -->
        <q-badge v-if="isLive && $q.platform.is.electron" color="positive"
          >Live</q-badge
        >
        <q-badge v-if="!isLive" color="accent">Dev</q-badge>
        <q-btn
          flat
          dense
          :label="$q.screen.lt.sm ? '' : 'Menu'"
          icon="menu"
          aria-label="Menu"
          @click="showMenu = !showMenu"
        />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="showTimetable"
      overlay
      no-swipe-open
      behavior="desktop"
      elevated
      :width="350"
      class="bg-dark text-white"
    >
      <div
        v-if="showTimetable"
        class="q-mini-drawer-hide absolute"
        style="top: 4px; right: -24px"
      >
        <q-btn
          dense
          round
          unelevated
          color="warning"
          icon="chevron_left"
          style="z-index: 667"
          class="text-warning-inv guide"
          size="lg"
          @click="showTimetable = false"
        />
      </div>
      <!-- :width="$q.screen.lt.sm ? headerSize.width : 350" -->
      <Timetable v-model="showTimetable" />
    </q-drawer>
    <q-drawer
      v-model="showMenu"
      no-swipe-open
      behavior="desktop"
      overlay
      elevated
      side="right"
      :width="350"
      class="bg-dark text-white"
    >
      <div
        v-if="showMenu"
        class="q-mini-drawer-hide absolute"
        style="top: 4px; left: -24px"
      >
        <q-btn
          dense
          round
          unelevated
          color="warning"
          icon="chevron_right"
          size="lg"
          class="text-warning-inv guide"
          style="z-index: 666"
          @click="showMenu = false"
        />
      </div>
      <!--       @click="showMenu = !showMenu" -->
      <!-- :width="$q.screen.lt.sm ? headerSize.width : 350" -->
      <MainMenu />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- <q-footer elevated>
      <q-card-section class="bg-dark text-white shadow-2 text-center q-pa-sm">
        <div class="row items-center no-wrap">
          <div class="col">
          
          <q-icon name="person" />
          </div>
        </div>
      </q-card-section>
    </q-footer> -->
    <!-- <q-footer elevated>
      <q-card-section
        v-if="isLoggedIn"
        class="bg-dark text-white shadow-2 text-center q-pa-sm"
      >
        <div class="row items-center no-wrap">
          <div class="col">
            <q-btn
              class="q-px-sm"
              label="Display"
              icon="airplay"
              color="accent"
            >
              <j-menu :menu-items="displayMenu" @selected="handleDisplayMenu">
              </j-menu>
            </q-btn>
    
          </div>
        </div>
      </q-card-section>
    </q-footer> -->
    <!-- :disabled="!$store.state.echo.connected" -->
    <!-- <q-btn
            color="accent"
            label="Announce"
            class="q-mx-sm"
            @click="announceText"
          />
          <q-btn
            color="accent"
            label="Dispaly"
            class="q-mx-sm"
            @click="displayHome"
          /> -->
    <!-- <template #footer>
              <q-item v-close-popup clickable @click="checkLogin">
                <q-item-section avatar>
                  <q-icon name="logout" color="positive" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    loggedIn ? 'Logout' : 'Login'
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </template> -->
  </q-layout>
  <q-dialog v-model="timeoutVisible" seamless position="bottom">
    <q-card style="width: 350px" class="bg-primary">
      <q-linear-progress :value="timeRemainingProgress" color="warning" />

      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold text-white">Login timeout</div>
          <div class="text-white">
            You will be logged out in {{ timeRemainingMin }}
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="continue"
          color="positive"
          icon="refresh"
          @click="refreshJWT"
        />
        <q-btn
          flat
          label="logout"
          color="warning"
          icon="logout"
          @click="logout"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import MainMenu from 'components/MainMenu.vue'
import Timetable from 'components/Timetable.vue'
// import JMenu, { MenuItem } from 'components/JMenu.vue'\//
import { MenuItem } from 'components/JMenu.vue'
// import { MenuItem } from 'components/JMenu.vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { crono } from 'vue-crono'

import { defineComponent } from 'vue'
import { axiosError } from 'boot/axios'
export default defineComponent({
  name: 'MainLayout',
  components: {
    MainMenu,
    Timetable,
    // JMenu,
  },
  mixins: [crono],
  data() {
    return {
      timeoutVisible: false,
      timeRemaining: 0,
      noCompetitionBool: true,
      competition: '',
      currentFloorLocation: '',
      showMenu: false,
      showTimetable: false,
      displayMenu: [
        {
          label: 'Competition home',
          icon: 'home',
          iconColor: 'primary',
          callback: 'displayHome',
          loggedIn: true,
          children: [],
        },
        {
          label: 'Announcement',
          icon: 'campaign',
          iconColor: 'accent',
          callback: 'announce',
          loggedIn: true,
          children: [],
        },
        {
          label: 'Competition end',
          icon: 'done',
          iconColor: 'positive',
          callback: 'displayEnd',
          loggedIn: true,
          children: [],
        },
      ],
    }
  },
  computed: {
    isConnected() {
      return this.$store.state.echo.connected
    },
    isLive() {
      if (process.env.LIVE === 'true') {
        return true
      } else {
        return false
      }
    },
    timeRemainingProgress(): number {
      // const mins = Math.round(this.timeRemaining)
      // const toReturn = Number()
      return this.timeRemaining / 5
    },
    timeRemainingMin(): string {
      const mins = Math.round(this.timeRemaining)
      if (mins === 0) {
        return '< 1 min'
      } else {
        return `${mins} min`
      }
    },
    isLoggedIn(): boolean {
      return this.$store.state.command.loggedIn
    },
    toolbarTitle(): string {
      let toReturn = 'eScrutineer: Judges'
      const user = this.$store.state.command.userDetails
      if (user.firstName) {
        toReturn = `${user.firstName} ${user.lastName}`
      }
      if (this.$store.state.command.competition.id > 0) {
        toReturn = `${toReturn}: ${this.$store.state.command.competition.title}`
      }
      // if (this.$store.state.command.floor.id > 0) {
      //   toReturn = `${toReturn} (${this.$store.state.command.floor.name})`
      // }
      return toReturn
    },
  },
  created() {
    // console.log(this.$q.platform)
    // window.io = require('socket.io-client')
    // this.$axios.interceptors.response.use(null, (error) => {
    //   if (error.response && error.response.status === 401) {
    //     this.logout()
    //     // if (window.Echo) { window.Echo.connector.socket.close() }
    //     // this.logbackIn()
    //   }
    //   return Promise.reject(error)
    //   // }
    //   // if (error.response.status !== 500) {
    //   //   return Promise.reject(error)
    //   // } else {
    //   //   return Promise.reject(error)
    //   // }
    // })
    let JWT = ''
    if (this.$q.cookies.has('eScrut_command_JWT')) {
      JWT = this.$q.cookies.get('eScrut_command_JWT')
    } else {
      JWT = this.$store.state.command.auth.authToken
    }
    console.log('JWT', JWT)
    if (this.$store.state.command.auth && JWT !== '') {
      const diffMin =
        (Date.now() - this.$store.state.command.auth.timeStamp) / 60000
      console.log(`Logged in for ${Math.round(diffMin)} min`)
      if (diffMin < 240) {
        this.$axios.defaults.headers.common.Authorization = 'Bearer ' + JWT
        this.$store.dispatch('echo/connectEcho')
        // this.$store.commit('GOstore/connectEcho', 'Bearer ' + JWT)
        // this.$store.dispatch('GOstore/getUserDetails').then(() => {
        //   this.$store.dispatch('GOstore/joinEchoNotifications')
        // })
      } else {
        this.logout()
      }
    } else {
      this.logout()
    }
    this.versionCheck()
  },
  beforeUnmount() {
    this.$store.commit('command/saveState')
  },
  methods: {
    versionCheck() {
      this.$axios
        .post(`${process.env.VERSION_CHECK}`)
        // .post(`/system/webapp/version/competitor${this.isLive ? '' : '/dev'}`)
        // .post('/system/webapp/version/competitor')
        .then((response) => {
          const cloudVersion = response.data.split('.').map(parseFloat)
          const localVersion = this.$store.state.command.version
            .split('.')
            .map(parseFloat)
          let updateNeeded = false
          if (localVersion[0] < cloudVersion[0]) {
            updateNeeded = true
          } else if (
            localVersion[1] < cloudVersion[1] &&
            localVersion[0] === cloudVersion[0]
          ) {
            updateNeeded = true
          } else if (
            localVersion[2] < cloudVersion[2] &&
            localVersion[1] === cloudVersion[1] &&
            localVersion[0] === cloudVersion[0]
          ) {
            updateNeeded = true
          }
          console.log('version check', localVersion, cloudVersion)
          if (updateNeeded) {
            this.$axios
              .get('/system/release-notes/judges/latest')
              .then(({ data }) => {
                this.$q
                  .dialog({
                    dark: true,
                    title: `Update available to v${data.version}`,
                    html: true,
                    message: `An update is available, would you like to update now?<br>This update contains:<br>${data.notes}`,
                    cancel: 'no',
                    ok: 'yes',
                    class: 'bg-primary',
                  })
                  .onOk(() => {
                    // this.logout()
                    this.$store.commit('command/clearStore')
                    this.$q.notify({
                      progress: true,
                      message: 'Downloading update, please wait...',
                      icon: 'cloud_download',
                      timeout: 20000,
                      onDismiss() {
                        caches.keys().then((keys) => {
                          Promise.all(
                            keys.map((o) => {
                              return caches.delete(o)
                            })
                          ).then(() => {
                            navigator.serviceWorker
                              .getRegistrations()
                              .then((registrations) => {
                                for (let registration of registrations) {
                                  registration.unregister()
                                }
                                location.reload()
                              })
                          })
                        })
                      },
                    })
                  })
              })
              .catch(axiosError)
          }
        })
        .catch(axiosError)
    },
    handleDisplayMenu(menuItem: MenuItem) {
      switch (menuItem.callback) {
        case 'displayHome':
          this.$store.dispatch('echo/displayHome')
          break
        case 'displayEnd':
          this.displayEnd()
          break
        case 'announce':
          this.announceText()
          break
        default:
      }
    },
    logout() {
      if (this.$axios.defaults.headers.common.Authorization) {
        this.$axios
          .post('../auth/logout', 'logout')
          .then(() => {
            this.$axios.defaults.headers.common.Authorization = ''
            this.$store.commit('command/storeAuth', '')
            this.$store.commit('echo/closeEcho')
            // this.$q.localStorage.remove('login-details', this.credentials)
            // this.noCompetitionBool = true
            // window.Echo.connector.socket.close()
            // this.$q.localStorage.remove('authCredentials')
            void this.$router.push('/login')
          })
          .catch((err) => {
            axiosError(err)
            this.$axios.defaults.headers.common.Authorization = ''
            this.$store.commit('command/storeAuth', '')
            void this.$router.push('/login')
          })
      } else {
        void this.$router.push('/login')
      }
    },
    announceText() {
      this.$q
        .dialog({
          title: 'Announcement',
          message: 'What do you wish to announce on the display screens?',
          prompt: {
            model: '',
            type: 'text', // optional
          },
          cancel: true,
          dark: true,
          class: 'bg-primary text-primary-inv',
        })
        .onOk((dataText: string) => {
          if (dataText) {
            this.$store.dispatch('echo/announcement', dataText)
          }
        })
    },
    displayEnd() {
      this.$q
        .dialog({
          title: 'End competition',
          message:
            'Are you sure you wish to display the end of competition message?',
          cancel: true,
          dark: true,
          class: 'bg-primary text-primary-inv',
        })
        .onOk(() => {
          this.$store.dispatch('echo/displayEndOfDays')
        })
    },

    displayHome() {
      this.$store.dispatch('echo/displayHome')
    },
    checkAuthTimeout() {
      if (this.$store.state.command.loggedIn) {
        // this.logout()
        const delta = Math.round(
          (Date.now() - this.$store.state.command.auth.timeStamp) / 60000
        )
        if (delta > 114 && delta < 119) {
          this.refreshJWT()
          this.timeoutVisible = true
          this.timeRemaining = 119 - delta
        } else if (delta > 119) {
          this.timeoutVisible = false
          this.logout()
        } else {
          this.timeoutVisible = false
        }
      } else {
        this.timeoutVisible = false
      }
    },
    refreshJWT() {
      this.$axios
        .get('/auth/refresh')
        .then((response) => {
          this.timeoutVisible = false
          this.$axios.defaults.headers.common.Authorization =
            'Bearer ' + response.headers.authorization
          this.$store.commit(
            'command/storeAuth',
            response.headers.authorization
          )
          this.$store.dispatch('echo/connectEcho')
          this.$store.commit('command/saveState')
        })
        .catch((err) => {
          axiosError(err)
        })
    },
    updateTimetable() {
      this.$store.dispatch('command/updateTimetable')
      this.$store.dispatch('command/getEvents')
    },
  },
  cron: [
    {
      time: 5000,
      method: 'checkAuthTimeout',
    },
    {
      time: 60000,
      method: 'updateTimetable',
    },
  ],
})
</script>
