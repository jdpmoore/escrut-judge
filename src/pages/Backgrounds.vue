<template>
  <JTabs v-model="tab" :tabs="tabs"></JTabs>
  <q-btn
    class="full-width guide bg-warning text-warning-inv q-ma-lg"
    icon="done"
    label="Resume judging"
    style="font-size: 150%"
    to="/judge"
  />
  <img :src="src" width="414" />
</template>

<script>
import JTabs from 'src/components/JTabs.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CompTimetable',
  components: { JTabs },
  data() {
    return {
      letters: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
      ],
      images: [],
      tab: 'A',
    }
  },
  computed: {
    tabs() {
      return this.letters.map((l) => {
        return { name: l, title: l, icon: l }
      })
    },
    src() {
      return `assets/backgrounds/eS-phones-${this.tab}.jpg`
    },
  },
})
</script>
