<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar class="bg-dark ivdalines q-px-xs">
        <tippy
          ref="timetable-btn"
          content="Tap here for your timetable"
          trigger="manual"
          allow-h-t-m-l
          interactive
          :hide-on-click="false"
        >
          <!-- v-tippy="'Timetable'" -->
          <!-- v-tippy="{ trigger: 'custom', content: 'Timetable' }" -->
          <q-btn
            flat
            dense
            :disable="$store.state.command.timetable.length === 0"
            round
            icon="schedule"
            aria-label="Timetable"
            @click="showTheTimetable"
          />
        </tippy>
        <q-toolbar-title class="row justify-between items-center">
          <div>
            {{ toolbarTitle }}
            <q-badge v-if="isChair" rounded color="positive"></q-badge>
          </div>
          <div caption class="text-info text-caption">{{ floorName }}</div>
        </q-toolbar-title>
        <!-- <q-avatar size="24px" :color="currentFloorColor" text-color="black">{{
          currentFloorLetter
        }}</q-avatar> -->
        <q-avatar size="40px" class="q-ma-none">
          <!-- <img src="assets/ivda/ivda_logo_only.svg" /> -->

          <q-icon v-if="isConnected" color="positive" name="wifi" size="sm" />
          <q-icon
            v-if="!isConnected"
            color="negative"
            name="wifi_off"
            size="md"
          />
        </q-avatar>
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
        <!-- <q-btn
          flat
          dense
          :label="$q.screen.lt.sm ? '' : 'Menu'"
          icon="menu"
          aria-label="Menu"
          @click="showMenu = !showMenu"
        /> -->
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="showTimetable"
      overlay
      no-swipe-open
      behavior="mobile"
      elevated
      :width="$q.screen.lt.sm ? $q.screen.width : 350"
      class="bg-dark text-white"
    >
      <!-- <div
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
      </div> -->
      <!-- :width="$q.screen.lt.sm ? headerSize.width : 350" -->
      <Timetable
        v-model="showTimetable"
        @menu="showMenu = true"
        @demo="startDemo"
        @close="closeTimetable"
      />
    </q-drawer>
    <q-drawer
      v-model="showMenu"
      no-swipe-open
      behavior="mobile"
      overlay
      elevated
      side="right"
      :width="$q.screen.lt.sm ? $q.screen.width : 350"
      class="bg-dark text-white"
    >
      <!-- <div
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
      </div> -->
      <!--       @click="showMenu = !showMenu" -->
      <!-- :width="$q.screen.lt.sm ? headerSize.width : 350" -->
      <MainMenu
        @close="
          (val) => {
            showMenu = false
            closeTimetable()
          }
        "
      />
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
// import { useTippy } from 'vue-tippy'

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
      showTippy: false,
      demoStep: 1,
      versionCheckDialogShow: false,
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
    timetableButton() {
      return this.$refs['timetable-btn']
    },
    isDemo() {
      return this.$store.state.command.demo
    },
    timetableOrder() {
      return this.$store.state.command.compere.timetableOrder
    },
    currentRound() {
      return this.$store.state.command.current
    },
    currentFloorLetter() {
      return this.floor.name.slice(0, 1)
    },
    currentFloorColor() {
      return this.currentFloorLetter == 'E' ? 'info' : 'warning'
    },
    floor() {
      return this.currentRound?.floor
      //this.$store.state.command.floor
    },
    floorName() {
      return this.floor?.name ?? ''
    },
    danceLetterIndex() {
      return this.$store.state.command.compere.danceLetterIndex
    },
    dance() {
      return this.$store.getters['command/dance']
    },
    isQualifierText() {
      if (
        this.currentRound?.round?.isQualifier &&
        this.currentRound.round?.isFirstRound
      ) {
        return ' (qualifier first round)'
      } else if (
        this.currentRound.round?.isRepechage &&
        this.currentRound.round?.isFirstRound
      ) {
        return ' (repechage)'
      }
      return ''
    },
    isFirstRoundSFF() {
      if (
        this.currentRound.round?.isFirstRound &&
        this.currentRound.round?.round != 1 &&
        !this.currentRound.round?.isRepechage
      ) {
        return ' (first round)'
      }
      return ''
    },
    roundText() {
      let toReturn = ''
      if (this.endOfDays) {
        return 'Competition completed!'
      }
      if (this.currentRound) {
        toReturn = `${this.currentRound.title}${this.isFirstRoundSFF}${this.isQualifierText}`
        // if (
        //   this.currentRound.round?.dances &&
        //   (this.currentRound.round.dances.length > 1 || this.isHandwriting)
        // ) {
        //   const danceIds =
        //     this.currentRound.round.danceOrder ?? this.currentRound.round.dances
        //   const danceLetters = danceIds
        //     .map((danceId) => {
        //       const key = this.isHandwriting ? 'name' : 'abbreviation'
        //       return this.$store.getters['command/danceById'](danceId)?.[key]
        //     })
        //     .join(this.isHandwriting ? ', ' : '')
        //   toReturn = `${toReturn} (${danceLetters})`
        // }
        // if (this.isHandwriting) {
        //   toReturn = `${toReturn} (${})`
        // }
        const nDances = this.currentRound.round.dances.length
        if (nDances > 1) {
          toReturn = `${toReturn} - dance ${
            this.danceLetterIndex + 1
          }/${nDances}`
        }
        if (this.isHandwriting) {
          toReturn = `${toReturn} - ${this.dance?.name}`
        }
        // if (this.isCurrentEvent && !this.isNonCompereEvent) {
        //   toReturn = `${toReturn}, heat ${this.activeHeat}`
        // }
      }
      return toReturn
    },
    isConnected() {
      return this.$store.state.echo.connected
    },
    isLive() {
      return process.env.LIVE
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
    myAdj() {
      return this.$store.getters['command/myJudge']
    },
    isChair() {
      return this.myAdj?.isChair
    },
    toolbarTitle(): string {
      let toReturn = 'eScrutineer: Judges'
      // return this.roundText
      const user = this.$store.state.command.userDetails
      if (user.firstName) {
        toReturn = `${user.firstName} ${user.lastName}`
      }
      if (this.$store.state.command.competition.id > 0 && this.myAdj) {
        // if (this.isChair) {
        //   toReturn = `${this.myAdj.letter}*: ${toReturn}`
        // } else {
        toReturn = `${this.myAdj.letter}: ${toReturn}`
        // }
      }
      // if (this.$store.state.command.competition.id > 0) {
      //   toReturn = `${toReturn}: ${this.$store.state.command.competition.title}`
      // }
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
    closeTimetable() {
      console.log('we closed the timetable')
      this.showTimetable = false
      if (this.isDemo) {
        this.$router.push('/demo')
      }
    },
    showTheTimetable() {
      this.showTimetable = !this.showTimetable
      if (this.isDemo) {
        // console.log('hide timetable button', this.timetableButton)
        this.timetableButton.hide()
      }
    },
    startDemo() {
      this.showTimetable = false
      if (!this.isDemo) {
        this.$q
          .dialog({
            title: 'Start demo',
            message: 'Are you ready to start the demo?',
            cancel: true,
            dark: true,
            class: 'bg-primary text-primary-inv',
          })
          .onOk(() => {
            this.timetableButton.show()
            // useTippy('#timetable-btn', { content: 'prog Timetable' })
            // console.log('with tippy', btn)
            this.$store.commit('command/setDemo', true)
            this.demoStep = 1
          })
      } else {
        this.$q
          .dialog({
            title: 'End demo',
            message: 'Do you wish to end the demo?',
            cancel: true,
            dark: true,
            class: 'bg-primary text-primary-inv',
          })
          .onOk(() => {
            // useTippy('#timetable-btn', { content: 'prog Timetable' })
            // console.log('with tippy', btn)
            this.$store.commit('command/setDemo', false)
            this.$router.push('/judge')
            this.demoStep = 1
          })
      }
    },
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
          if (updateNeeded && !this.versionCheckDialogShow) {
            this.versionCheckDialogShow = true
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
                  .onDismiss(() => {
                    this.versionCheckDialogShow = false
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
      if (this.isLoggedIn) {
        this.$store.dispatch('command/updateTimetable')
        this.$store.dispatch('command/getEvents')
      }
    },
    shareStatus() {
      if (this.isLoggedIn) {
        this.$store.dispatch('echo/shareStatus')
      }
    },
  },
  cron: [
    {
      time: 5000,
      method: 'checkAuthTimeout',
    },
    {
      time: 30000,
      method: 'updateTimetable',
    },
    {
      time: 20000,
      method: 'shareStatus',
    },
  ],
})
</script>
