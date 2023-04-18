<template>
  <q-menu :anchor="computedAnchor" :self="computedSelf">
    <q-list square style="min-width: 100px" :class="contentClass">
      <slot name="header"></slot>
      <q-item
        v-for="(menuItem, index) in computedMenuItems"
        :key="index"
        v-close-popup
        clickable
        @click="handleClick(menuItem)"
      >
      <!-- ="menuItem.to || menuItem.callback" -->
        <q-item-section avatar>
          <q-icon :name="menuItem.icon" :color="menuItem.iconColor" size="sm" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ menuItem.label }}</q-item-label>
        </q-item-section>
        <j-menu
          v-if="menuItem.children"
          :menu-items="menuItem.children"
          child
        />
      </q-item>
      <slot name="footer"></slot>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
interface JMenu {
  name: string
}
export interface MenuItem {
  label: string
  icon: string
  iconColor: string
  to?: string
  callback?: string
  loggedIn?: boolean
  children?: MenuItem[]
  roles?: string[]
}

const toExport: JMenu = defineComponent({
  name: 'JMenu',
  components: {
    // JMenu: () => import('src/components/common/JMenu.vue')
  },
  props: {
    menuItems: { type: Array as PropType<MenuItem[]>, required: true },
    contentClass: { type: String, default: 'bg-sei-grey-light-1' },
    child: { type: Boolean, default: false },
    anchor: { type: String, default: 'top start' },
    self: { type: String, default: 'top end' }
  },
emits: ['selected'],
  data() {
    return {}
  },
  computed: {
    loggedIn(): boolean {
      return this.$store.state.command.loggedIn
    },
    userRoles(): string[] {
      return this.$store.state.command.userDetails.roles
    },
    computedMenuItems(): MenuItem[] {
      const toReturn = this.menuItems
        .filter(item => {
          return (item.loggedIn && this.loggedIn) || !item.loggedIn
        })
        .filter(this.visible)
      return toReturn
    },
    computedAnchor(): string {
      return this.child ? this.anchor : 'bottom end'
    },
    computedSelf(): string {
      return this.child ? this.self : 'top end'
    }
  },
  methods: {
    handleClick(menuItem: MenuItem) {
      if (menuItem.to) {
        this.$router.push(menuItem.to)
      }
      if (menuItem.callback) {
        this.$emit('selected', menuItem)
      }
    },
    visible(menuItem: MenuItem): boolean {
      if (menuItem.roles && menuItem.roles.length > 0) {
        return this.$_.intersection(menuItem.roles, this.userRoles).length > 0
      } else {
        return true
      }
    }
  }
})

export default toExport
</script>
