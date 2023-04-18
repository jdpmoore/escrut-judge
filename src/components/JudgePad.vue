<template>
  <q-layout
    view="hHh LpR fFf"
    container
    :style="`height: calc(100vh - 64px);`"
    class="bg-primary"
  >
    <q-page-container>
      <div
        v-if="showCanvas"
        id="canvasWrap"
        class="row full-width items-center justify-center bg-dark"
      >
        <canvas
          ref="judgepad"
          width="800"
          height="800"
          style="border: 1px solid black"
        ></canvas>
      </div>
    </q-page-container>
    <q-footer elevated>
      <q-card-section class="bg-dark text-white shadow-2 text-center q-pa-sm">
        <div class="row items-center no-wrap">
          <div class="col">
            <q-btn>Submit</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-footer>
  </q-layout>
</template>

<script>
// import { v1, v2 } from 'src/@types/command'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
// import { Canvas, Rect } from 'fabric' // browser
import { fabric } from 'fabric'

// interface JudgePadInterface {
//   selectF: v1.Floor | null
//   roundIdtoRound: (roundId: number) => string
//   showCanvas: boolean
//   isDrawingMode: boolean
//   canvas: Canvas
//   sketchProperties: { width: number; height: number }
//   backgroundColor: string
// }

export default defineComponent({
  name: 'JudgePad',
  props: {
    modelValue: { type: Boolean, default: false },
  },
  // : JudgePadInterface
  data() {
    return {
      selectF: this.$store.state.command.floor,
      roundIdtoRound: this.$store.getters['command/roundIdtoRound'],
      showCanvas: true,
      isDrawingMode: true,
      canvas: null, // new Canvas('judgepad'),
      sketchProperties: { width: 1000, height: 1000 },
      backgroundColor: 'rgba(255,255,255,1)', // '#FFF',
      // ? this.$store.state.command.floor
      // : null,
    }
  },
  computed: {
    ...mapState('command', ['floors', 'timetable', 'userDetails']),
    // : v2.TimetableItem[]
    filteredTimetable() {
      return this.$store.getters['command/timetableByFloor'](this.selectF)
    },
    userRoles() {
      return this.userDetails.roles
    },
  },
  watch: {
    '$store.state.command.floor'() {
      // console.log(this.$store.state.command.floor)
      this.selectF = this.$store.state.command.floor
    },
  },
  mounted() {
    this.configureCanvas()
  },
  methods: {
    configureCanvas() {
      const ref = this.$refs.judgepad
      this.canvas = new fabric.Canvas(ref, {
        isDrawingMode: this.isDrawingMode,
      })
      // window.addEventListener('resize', this.resizeCanvas, false)
      this.resizeCanvas()
      this.setBackground()
      this.canvas.isDrawingMode = true

      // this.canvas.freeDrawingBrush =
      if (this.canvas.freeDrawingBrush) {
        this.canvas.freeDrawingBrush.color = 'darkblue'
        this.canvas.freeDrawingBrush.width = 5
      }
    },
    // : { height: number; width: number }
    resizeCanvas(arg) {
      if (arg && arg.height) {
        this.canvas.setHeight(arg.height, {})
        this.canvas.setWidth(arg.width, {})
        this.canvas.renderAll()
      } else {
        this.canvas.setHeight(window.innerHeight - 64, {})
        this.canvas.setWidth(window.innerWidth, {}) //- 58
        this.canvas.renderAll()
      }
      // this.$d3
      //   .selectAll('#avatarSlot')
      //   // .attr('class', 'user-avatar')
      //   .attr('width', window.innerWidth)
      //   .attr('height', window.innerHeight - 400)
    },
    setBackground() {
      // console.log('setting background')
      var bg = new fabric.Rect({
        width: this.sketchProperties.width,
        height: this.sketchProperties.height,
        stroke: '',
        // strokeWidth: 10,
        fill: this.backgroundColor,
        evented: false,
        selectable: false,
      })
      // bg.canvas = this.canvas
      this.canvas.backgroundImage = bg

      // .setBackgroundImage(
      //   bg,
      //   this.canvas.renderAll.bind(this.canvas)
      // )
      bg.dirty = true
      var vpt = this.canvas.viewportTransform
      vpt[4] = this.canvas.getWidth() / 2 - this.sketchProperties.width / 2
      vpt[5] = this.canvas.getHeight() / 2 - this.sketchProperties.height / 2
      this.canvas.requestRenderAll()
    },
  },
})
</script>
