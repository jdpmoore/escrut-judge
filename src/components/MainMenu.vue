<template>
  <q-list>
    <q-item v-if="isLoggedIn" class="q-pr-none">
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
      <q-item-section class="text-white">
        <div class="col justify-center items-center text-center">
          <q-item-label style="font-weight: bold" class="text-h6 q-pb-md">{{
            userName
          }}</q-item-label>
          <!--              <q-item-label caption class="text-white inline" v-for="role in user.roles" v-bind:key="role">{{ role }}</q-item-label>-->
          <!--                <q-btn flat dense icon="warning" color="blue"><q-badge color="red" floating>4</q-badge></q-btn>-->
          <!-- <q-btn
            class="q-mb-sm full-width"
            flat
            color="white"
            dense
            label="logout"
            icon="logout"
            aria-label="Login"
            @click="setCompetition"
          /> -->
          <q-btn
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
          />
        </div>
      </q-item-section>
    </q-item>
    <q-item v-ripple clickable class="bg-dark text-white">
      <!-- <q-item-section avatar>
        <q-icon name="settings" class="text-positive" />
      </q-item-section> -->
      <q-item-section>
        <!-- <q-item-label class="text-white">Data dump</q-item-label> -->
        <q-toggle
          v-model="padMode"
          :label="padModeLabel"
          color="positive"
          keep-color
        ></q-toggle>
      </q-item-section>
    </q-item>
    <q-item
      v-if="isLoggedIn"
      v-ripple
      label="data"
      clickable
      class="bg-dark text-white"
      @click="dataDump"
    >
      <q-item-section avatar>
        <q-icon name="settings" class="text-warning" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-white">Data dump</q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-if="!isLoggedIn"
      v-ripple
      label="Test"
      clickable
      class="bg-dark text-white"
      @click="clearLocalStorage"
    >
      <q-item-section avatar>
        <q-icon name="settings" class="text-warning" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-white">Clear local storage</q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-ripple
      label="About"
      clickable
      class="bg-dark text-white"
      @click="aboutBox"
    >
      <q-item-section avatar>
        <q-icon name="info" class="text-white" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-white">About</q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-if="!isLoggedIn"
      v-ripple
      label="Login"
      clickable
      class="bg-dark text-white"
      to="/login"
    >
      <q-item-section avatar>
        <q-icon name="login" class="text-positive" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-white">Login</q-item-label>
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
        header-class="bg-primary text-white"
        expand-icon-class="text-white"
      >
        <q-item
          v-for="(child, childIndex) in menu.children"
          :key="'child-' + childIndex"
          v-ripple
          clickable
          :header-inset-level="1"
          class="text-white"
          :to="child.location"
        >
          <q-item-section avatar>
            <q-icon
              :name="child.icon"
              :class="
                child.iconColor ? `text-${child.iconColor}` : 'text-white'
              "
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-white">{{ child.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-expansion-item>
      <q-item
        v-else-if="menu.title"
        v-ripple
        clickable
        class="bg-primary text-white"
        :to="menu.location"
      >
        <q-item-section avatar>
          <q-icon
            :name="menu.icon"
            :class="menu.iconColor ? `text-${menu.iconColor}` : 'text-white'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-white">{{ menu.title }}</q-item-label>
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
interface MenuTypes {
  // userDetails: {
  //   firstName: string
  //   lastName: string
  // } | null
  avatarPosition: string
}
export default defineComponent({
  name: 'MainMenu',
  props: {},
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
      if (process.env.LIVE === 'true') {
        return true
      } else {
        return false
      }
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
    dataDump() {
      console.log(this.$store.state.command.scrutineering.tempMarks)
    },
    clearLocalStorage() {
      this.$q
        .dialog({
          dark: true,
          title: 'Clear storage',
          class: 'bg-primary text-white',
          html: true,
          message: 'Are you sure you wish to clear local storage?',
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
          // this.logout().then(() => {
          this.$q.localStorage.clear()
          this.forceUpdate()
          // })
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
              class: 'bg-primary text-white',
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
          this.$axios.defaults.headers.common.Authorization = ''
          this.$store.commit('command/storeAuth', '')
          this.$store.commit('command/clearStore')
          // this.$q.localStorage.remove('login-details', this.credentials)
          // this.noCompetitionBool = true
          // window.Echo.connector.socket.close()
          // this.$q.localStorage.remove('authCredentials')
          void this.$router.push('/login')
        })
        .catch((err) => {
          axiosError(err)
          void this.$router.push('/login')
        })
    },
    checkLogin() {
      if (this.isLoggedIn === true) {
        this.$q
          .dialog({
            dark: true,
            title: 'Logout?',
            class: 'bg-primary text-white',
            message: 'Are you sure you wish to logout?',
            cancel: { label: 'No', outline: true, flat: true, color: 'amber' },
            ok: { label: 'Yes', outline: true, flat: true, color: 'amber' },
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
