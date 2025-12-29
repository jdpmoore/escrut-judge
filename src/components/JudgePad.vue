<template>
  <!-- <q-layout
    view="hHh LpR fFf"
    container
    :style="`height: calc(100vh - 64px);`"
    class="bg-primary"
  >
    <q-page-container> -->
  <div
    v-if="showCanvas"
    id="canvasWrap"
    class="row full-width items-center justify-center bg-primary"
  >
    <canvas
      ref="judgepad"
      :width="computedWidth"
      :height="computedHeight"
      style="border: 3px solid black"
    ></canvas>
  </div>
  <!-- </q-page-container>
    <q-footer elevated>
      <q-card-section class="bg-dark text-white shadow-2 text-center q-pa-sm">
        <div class="row items-center no-wrap">
          <div class="col">
            <q-btn @click="submitTest">Submit OCR</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-footer>
  </q-layout> -->
</template>

<script>
// import { v1, v2 } from 'src/@types/command'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { Canvas, Rect } from 'fabric' // browser
// import { fabric } from 'fabric'

// interface JudgePadInterface {]
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
    trigger: { type: Boolean, default: false },
    toClear: { type: Boolean, default: false },
  },
  emits: ['submit'],
  // : JudgePadInterface
  data() {
    return {
      selectF: this.$store.state.command.floor,
      roundIdtoRound: this.$store.getters['command/roundIdtoRound'],
      showCanvas: true,
      isDrawingMode: true,
      canvas: null, // new Canvas('judgepad'),
      sketchProperties: { width: 300, height: 300 },
      backgroundColor: 'rgba(255,255,255,1)', // '#FFF',
      // ? this.$store.state.command.floor
      // : null,
    }
  },
  computed: {
    computedHeight() {
      return window.innerHeight - 200
    },
    computedWidth() {
      return window.innerWidth
    },
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
    trigger() {
      this.getOCR()
    },
    toClear() {
      this.clearCanvas()
    },
    '$store.state.command.floor'() {
      // console.log(this.$store.state.command.floor)
      this.selectF = this.$store.state.command.floor
    },
  },
  mounted() {
    this.configureCanvas()
  },
  methods: {
    b64toBlob(dataURI) {
      var byteString = atob(dataURI.split(',')[1])
      var ab = new ArrayBuffer(byteString.length)
      var ia = new Uint8Array(ab)

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: 'image/jpeg' })
    },
    getReadResult(location) {
      this.$axios
        .get(location, {
          headers: {
            'Ocp-Apim-Subscription-Key': '8ee41f217f384caca024bd97364c93d9',
          },
        })
        .then(({ data }) => {
          if (data.status !== 'succeeded') {
            setTimeout(() => {
              this.getReadResult(location)
            }, 2000)
          }
          const { readResults } = data.analyzeResult
          const numbers = this.$_.uniq(
            readResults
              .map((res) => {
                return res.lines.map((line) => {
                  return Number(line.text)
                })
              })
              .flat(),
          ).sort((a, b) => a - b)
          this.$common.popup({
            title: 'numbers',
            message: numbers.join(', '),
          })
        })
    },
    clearCanvas() {
      this.canvas.clear()
      this.setBackground()
      this.canvas.renderAll()
    },
    getOCR() {
      console.log('are we here?!?')
      let vpt = this.canvas.viewportTransform
      console.log(vpt)
      this.resizeCanvas(this.sketchProperties)
      console.log('what about here?')
      console.log(this.canvas.getWidth())
      console.log(this.sketchProperties)
      vpt[4] = this.canvas.getWidth() / 2 - this.sketchProperties.width / 2
      vpt[5] = this.canvas.getHeight() / 2 - this.sketchProperties.height / 2
      console.log(vpt)
      this.canvas.renderAll()
      this.canvas.setZoom(1)
      this.canvas.renderAll()
      console.log('third part')
      const jpgDownload = this.canvas.toDataURL({
        format: 'jpeg',
        quality: 1.0,
        width: this.sketchProperties.width - 2,
        height: this.sketchProperties.height - 2,
        left: 1,
        top: 1,
      })
      this.resizeCanvas()
      let vpt2 = this.canvas.viewportTransform
      vpt2[4] = this.canvas.getWidth() / 2 - this.sketchProperties.width / 2
      vpt2[5] = this.canvas.getHeight() / 2 - this.sketchProperties.height / 2
      this.canvas.renderAll()
      // const jpgBlob = this.b64toBlob(jpgDownload)
      // this.canvas.clear()
      // this.setBackground()
      // // this.clearHistory()
      // this.canvas.requestRenderAll()
      this.$emit('submit', jpgDownload)
    },
    azure(jpgBlob) {
      this.$axios
        .post(
          'https://escrut.cognitiveservices.azure.com/vision/v3.2/read/analyze',
          jpgBlob,
          {
            headers: {
              'Content-Type': 'application/octet-stream',
              'Ocp-Apim-Subscription-Key': '8ee41f217f384caca024bd97364c93d9',
            },
          },
        )
        .then(({ headers }) => {
          setTimeout(() => {
            this.getReadResult(headers['operation-location'])
          }, 2000)
        })
        .catch(this.$GOcommon.axiosError)
    },
    submitTest() {
      console.log('now we submit the test')
      this.getOCR()
    },
    configureCanvas() {
      const ref = this.$refs.judgepad
      this.canvas = new Canvas(ref, {
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
      console.log('resize', arg)
      if (arg && arg.height) {
        this.canvas.setHeight(arg.height, {})
        this.canvas.setWidth(arg.width, {})
        this.canvas.renderAll()
      } else {
        this.canvas.setHeight(this.computedHeight, {})
        this.canvas.setWidth(this.computedWidth, {}) //- 58
        ;((this.sketchProperties = {
          width: this.computedWidth,
          height: this.computedHeight,
        }),
          this.canvas.renderAll())
      }
      // this.$d3
      //   .selectAll('#avatarSlot')
      //   // .attr('class', 'user-avatar')
      //   .attr('width', window.innerWidth)
      //   .attr('height', window.innerHeight - 400)
    },
    setBackground() {
      // console.log('setting background')
      var bg = new Rect({
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
