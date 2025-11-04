<template>
  <q-toolbar
    class="bg-primary text-primary-inv shadow-2 q-pr-xs"
    style="position: fixed; top: 0px; z-index: 666; height: 56px"
  >
    <!--  -->
    <q-toolbar-title class="col">Menu</q-toolbar-title>
    <q-badge v-if="isLive && $q.platform.is.electron" color="positive"
      >Live</q-badge
    >
    <q-badge v-if="!isLive" color="accent">Dev</q-badge>
    <div class="col-auto">
      <q-btn icon="close" round dense flat @click="$emit('close')" />
    </div>
  </q-toolbar>
  <div style="height: 56px"></div>
  <q-list>
    <q-item class="q-pr-none">
      <q-item-section avatar class="q-pa-none q-pr-sm">
        <q-avatar size="140px">
          <!-- <q-badge
            outline
            color="secondary"
            floating
            style="border: 0; top: -10px; left: -20px"
            ><q-btn
              color="white"
              icon="add"
              dense
              round
              flat
              @click="uploadAvatar"
          /></q-badge> -->
          <img
            v-touch-pan.prevent.mouse="moveAvatar"
            :src="userAvatar"
            class="user-avatar-profile"
            :style="avatarPosition"
            draggable="false"
          />
        </q-avatar>
      </q-item-section>
      <q-item-section class="text-dark-inv">
        <div class="col justify-center items-center text-center">
          <q-item-label style="font-weight: bold" class="text-h6 q-pb-md">{{
            userName
          }}</q-item-label>
          <!--              <q-item-label caption class="text-white inline" v-for="role in user.roles" v-bind:key="role">{{ role }}</q-item-label>-->
          <!--                <q-btn flat dense icon="warning" color="blue"><q-badge color="red" floating>4</q-badge></q-btn>-->
          <q-btn
            class="q-mb-sm full-width"
            flat
            color="dark-inv"
            dense
            label="logout"
            icon="logout"
            aria-label="Login"
            @click="checkLogin"
          />
          <!-- <q-btn
            class="q-mb-sm full-width"
            flat
            color="white"
            dense
            label="logout"
            icon="logout"
            aria-label="Login"
            @click="checkLogin"
          />
          <q-btn
            class="full-width"
            flat
            color="white"
            dense
            label="change password"
            icon="vpn_key"
            aria-label="Change password"
            to="/password/change"
          /> -->
        </div>
      </q-item-section>
    </q-item>
    <q-item v-ripple clickable class="bg-dark text-dark-inv">
      <!-- <q-item-section avatar>
        <q-icon name="settings" class="text-positive" />
      </q-item-section> -->
      <q-item-section>
        <!-- <q-item-label class="text-white">Data dump</q-item-label> -->
        <!-- <q-toggle
          v-model="padMode"
          :label="padModeLabel"
          color="positive"
          keep-color
        ></q-toggle> -->
      </q-item-section>
    </q-item>
    <q-item
      v-if="isLoggedIn"
      v-ripple
      label="Judge"
      clickable
      class="bg-dark text-dark-inv"
      to="/judge"
      @click="$emit('close')"
    >
      <q-item-section avatar>
        <q-icon name="done" class="text-positive" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-dark-inv">Judge competition</q-item-label>
      </q-item-section>
    </q-item>
    <!-- <q-item
      v-ripple
      label="data"
      clickable
      class="bg-dark text-dark-inv"
      to="/backgrounds"
    >
      <q-item-section avatar>
        <q-icon name="folder" class="text-warning" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-dark-inv">Backgrounds</q-item-label>
      </q-item-section>
    </q-item> -->
    <q-item
      v-if="isLoggedIn"
      v-ripple
      label="data"
      clickable
      class="bg-dark text-dark-inv"
      @click="checkPass"
    >
      <q-item-section avatar>
        <q-icon name="list" class="text-warning" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-dark-inv">Marked rounds</q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-ripple
      clickable
      class="bg-dark text-dark-inv"
      @click="clearLocalStorage"
    >
      <q-item-section avatar>
        <q-icon name="settings" class="text-negative" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-dark-inv">Clear local storage</q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-ripple
      label="About"
      clickable
      class="bg-dark text-dark-inv"
      @click="aboutBox"
    >
      <q-item-section avatar>
        <q-icon name="info" class="text-dark-inv" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-dark-inv">About</q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-if="!isLoggedIn"
      v-ripple
      label="Login"
      clickable
      class="bg-dark text-dark-inv"
      to="/login"
    >
      <q-item-section avatar>
        <q-icon name="login" class="text-positive" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-dark-inv">Login</q-item-label>
      </q-item-section>
    </q-item>
    <!-- <q-item
      v-if="isLoggedIn"
      v-ripple
      label="Report issue"
      clickable
      class="bg-dark text-white"
      @click="aboutBox"
    >
      <q-item-section avatar>
        <q-icon name="bug_report" class="text-negative" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-white">Report issue</q-item-label>
      </q-item-section>
    </q-item> -->
    <div v-for="(menu, index) in computedMainMenu" :key="'menu-' + index">
      <q-expansion-item
        v-if="menu.type === 'expander' && menu.title"
        expand-separator
        :label="menu.title"
        :icon="menu.icon"
        header-class="bg-primary text-primary-inv"
        expand-icon-class="text-primary-inv"
      >
        <q-item
          v-for="(child, childIndex) in menu.children"
          :key="'child-' + childIndex"
          v-ripple
          clickable
          :header-inset-level="1"
          class="text-dark-inv"
          :to="child.location"
        >
          <q-item-section avatar>
            <q-icon
              :name="child.icon"
              :class="
                child.iconColor ? `text-${child.iconColor}` : 'text-dark-inv'
              "
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-dark-inv">{{ child.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-expansion-item>
      <q-item
        v-else-if="menu.title"
        v-ripple
        clickable
        class="bg-primary text-primary-inv"
        :to="menu.location"
      >
        <q-item-section avatar>
          <q-icon
            :name="menu.icon"
            :class="menu.iconColor ? `text-${menu.iconColor}` : 'text-dark-inv'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-dark-inv">{{ menu.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </div>

    <!-- <q-item
      v-if="!lockdownMode"
      v-ripple
      clickable
      class="bg-primary text-white"
    >
      <q-item-section avatar>
        <q-icon name="warning" class="text-white"></q-icon>
      </q-item-section>
      <q-item-section>
        <div class="row">
          <q-item-label class="text-white">Alerts</q-item-label>
          <q-badge color="accent" style="position: absolute; right: 20px"
            >4</q-badge
          >
        </div>
      </q-item-section>
    </q-item>
    <q-item
      v-if="!lockdownMode"
      v-ripple
      clickable
      class="bg-primary text-white"
      @click="goto('/tasks')"
    >
      <q-item-section avatar>
        <q-icon name="assignment" class="text-white"></q-icon>
      </q-item-section>
      <q-item-section>
        <div class="row">
          <q-item-label class="text-white">Tasks</q-item-label
          ><q-badge color="accent" style="position: absolute; right: 20px"
            >2</q-badge
          >
        </div>
      </q-item-section>
    </q-item> -->
  </q-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { blankAvatar } from 'components/script/common'
import { v1 } from 'src/@types/command'
import { axiosError } from 'boot/axios'
import mainMenu from 'src/layouts/Menu'
import AddNumber from 'components/dialog/AddNumber.vue'
interface MenuTypes {
  // userDetails: {
  //   firstName: string
  //   lastName: string
  // } | null
  avatarPosition: string
}
// interface DumpType {
//   roundId: number
//   compAdjId: number
//   danceId: number
//   type: string
//   marks?: {
//     marked: number[]
//     considered: number[]
//   }
//   fileData: string
// }
export default defineComponent({
  name: 'MainMenu',
  props: {},
  emits: ['close'],
  data(): MenuTypes {
    return {
      avatarPosition: 'object-position: 0% 0%;',
    }
  },
  computed: {
    padMode: {
      get() {
        return this.$store.state.command.handwriting
      },
      set(val) {
        this.$store.commit('command/setHandwriting', val)
      },
    },
    padModeLabel() {
      return this.padMode
        ? 'Set to number pad'
        : 'Set to handwriting recognition'
    },
    isAdminDev(): boolean {
      return !!(
        this.userDetails?.roles.includes('sysAdmin') &&
        this.$q.platform.is.electron
      )
    },
    isLive() {
      return process.env.LIVE
    },
    isLoggedIn(): boolean {
      return this.$store.state.command.loggedIn
    },
    computedMainMenu() {
      if (this.isLoggedIn && this.userDetails && this.userDetails.roles) {
        let toReturn = mainMenu(this.userDetails.roles)
        return toReturn
      } else {
        return []
      }
    },
    userDetails(): v1.userDetails {
      return this.$store.state.command.userDetails
    },
    userName(): string {
      if (this.userDetails) {
        return `${this.userDetails.firstName} ${this.userDetails.lastName}`
      }
      return 'Unknown'
    },
    userAvatar(): string {
      return `data:image/png;base64,${blankAvatar()}`
    },
  },
  methods: {
    checkPass() {
      this.$q
        .dialog({
          component: AddNumber,
          componentProps: {
            title: 'View storage',
            pin: true,
          },
        })
        .onOk((pin: number) => {
          if (pin === 1234) {
            this.restoreOptions()
          }
        })
    },
    restoreOptions() {
      const stored = this.$store.getters['command/judgeMarks']
      const roundIds = Object.keys(stored)
      // const rounds = roundIds.map((id) => {
      //   return this.$store.state.command.scrutineering.roundById.get(Number(id))
      // })
      const items = roundIds.map((r) => {
        return { label: r, value: r, color: 'positive' }
      })
      items.unshift({ label: 'All', value: 'all', color: 'positive' })
      console.log(items)
      this.$q
        .dialog({
          dark: true,
          title: 'Saved marks on this pad',
          class: 'bg-primary text-primary-inv',
          message:
            'The following rounds have marks saved on this pad, which do you wish to re-transmit?',
          html: true,
          cancel: {
            label: 'Cancel',
            color: 'positive',
            textColor: 'positive-inv',
          },
          ok: { label: 'Ok', color: 'warning', textColor: 'warning-inv' },
          focus: 'cancel',
          options: {
            type: 'radio',
            model: null,
            // inline: true
            items,
          },
        })
        .onOk((data) => {
          if (data === 'all') {
            this.dataDump()
          } else {
            this.selectJudgeHeat(data, stored[data])
          }
        })
    },

    selectJudgeHeat(roundId, roundJudgeHeats) {
      const items = roundJudgeHeats.map((r) => {
        return { label: r, value: r, color: 'positive' }
      })
      this.$q
        .dialog({
          dark: true,
          title: 'Saved marks on this pad',
          class: 'bg-primary text-primary-inv',
          message: `Round ${roundId} has the following sets of marks saved on this pad, which do you wish to re-transmit?`,
          html: true,
          cancel: {
            label: 'Cancel',
            color: 'positive',
            textColor: 'positive-inv',
          },
          ok: { label: 'Ok', color: 'warning', textColor: 'warning-inv' },
          focus: 'cancel',
          options: {
            type: 'radio',
            model: null,
            // inline: true
            items,
          },
        })
        .onOk((data) => {
          this.$store.dispatch('echo/shareStoredMarks', {
            roundId: Number(roundId),
            judgeHeat: data,
          })
        })
    },
    dataDump() {
      console.log('now we dump')
      const { tempMarks, tempImages, roundById } =
        this.$store.state.command.scrutineering
      console.log(tempMarks, tempImages)
      const toPostMarks = Object.keys(tempMarks)
        .map((key) => {
          const round = roundById.get(Number(key))
          const myAdjudicator = round?.adjudicators.find(({ user }) => {
            return user.id === this.userDetails.id
          })
          const roundMarks = tempMarks[key]
          const toReturn = [...roundMarks.keys()]
            .map((judgeHeat) => {
              if (!judgeHeat) {
                return false
              }
              const danceId = judgeHeat.split('-')[1]
              return {
                roundId: key,
                compAdjId: myAdjudicator.id,
                danceId,
                type: 'array',
                marks: {
                  marked: [...roundMarks.get(judgeHeat)],
                  considered: [],
                },
              }
            })
            .filter(Boolean)
          return toReturn
        })
        .flat()
      const toPostImages = Object.keys(tempImages)
        .map((key) => {
          const round = roundById.get(Number(key))
          const myAdjudicator = round?.adjudicators.find(({ user }) => {
            return user.id === this.userDetails.id
          })
          const roundMarks = tempImages[key]
          return [...roundMarks.keys()].map((judgeHeat) => {
            const danceId = judgeHeat.split('-')[1]
            return {
              roundId: key,
              compAdjId: myAdjudicator.id,
              danceId,
              type: 'file',
              fileData: roundMarks.get(judgeHeat),
            }
          })
        })
        .flat()
      const toPost = [...toPostMarks, ...toPostImages]
      Promise.all(
        toPost.map((toP) => {
          this.$axios.post('padmarks/add', toP)
        })
      ).then(() => {
        this.$common.popup({
          title: 'Data dump complete',
          message: 'Data dump was a success',
        })
      })
    },

    clearLocalStorage() {
      this.$q
        .dialog({
          component: AddNumber,
          componentProps: {
            title: 'Clear storage',
            pin: true,
          },
        })
        .onOk((pin: number) => {
          if (pin === 1812) {
            if (this.isLoggedIn) {
              this.logout().then(() => {
                this.$q.localStorage.clear()
                this.forceUpdate()
                this.$router.push('/login')
              })
            } else {
              this.$q.localStorage.clear()
              this.forceUpdate()
              this.$router.push('/login')
            }
          }
        })
    },
    uploadAvatar() {
      //
    },
    moveAvatar() {
      //
    },
    aboutBox() {
      this.$axios
        .post(`${process.env.VERSION_CHECK}`)
        // .post(`/system/webapp/version/competitor${this.isLive ? '' : '/dev'}`)
        .then((response) => {
          const cloudVersion = response.data
          const localVersion = this.$store.state.command.version
          this.$q
            .dialog({
              dark: true,
              title: 'About eScrut',
              class: 'bg-primary text-primary-inv',
              persistent: true,
              html: true,
              message: `You are currently running ${localVersion} of the eScrut judges module, and the latest version is ${cloudVersion}. You may trigger an immediate update, however this will also log you out.`,
              cancel: {
                label: 'force update',
                // outline: true,
                // flat: true,
                unelevated: true,
                color: 'negative',
              },
              ok: {
                label: 'close',
                unelevated: true,
                // outline: true,
                // flat: true,
                color: 'positive',
              },
              color: 'primary',
            })
            .onCancel(() => {
              // this.$store.dispatch('GOstore/logout')
              this.forceUpdate()
            })
        })
        .catch((err) => {
          this.$common.axiosError(err)
        })
    },
    forceUpdate() {
      void caches.keys().then((keys) => {
        void Promise.all(
          keys.map((o) => {
            return caches.delete(o)
          })
        ).then(() => {
          void navigator.serviceWorker
            .getRegistrations()
            .then((registrations) => {
              for (let registration of registrations) {
                void registration.unregister()
              }
              // void this.$router.push('/')
              location.reload()
            })
        })
      })
    },
    logout() {
      console.log('now we logout')
      return this.$axios
        .post('/auth/logout', 'logout')
        .then(() => {
          // void this.$router.push('/login')
          this.$axios.defaults.headers.common.Authorization = ''
          this.$store.commit('command/storeAuth', '')
          this.$store.commit('command/clearUser')
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
          this.$store.commit('command/clearUser')
          void this.$router.push('/login')
        })
    },
    checkLogin() {
      if (this.isLoggedIn === true) {
        this.$q
          .dialog({
            dark: true,
            title: 'Logout?',
            class: 'bg-primary text-primary-inv',
            message: 'Are you sure you wish to logout?',
            cancel: {
              label: 'No',
              // outline: true,
              // flat: true,
              unelevated: true,
              color: 'negative',
            },
            ok: {
              label: 'Yes',
              unelevated: true,
              // outline: true,
              // flat: true,
              color: 'positive',
            },
            color: 'primary',
          })
          .onOk(() => {
            this.logout()
          })
      } else {
        void this.$router.push('/login')
      }
    },
  },
})
</script>
