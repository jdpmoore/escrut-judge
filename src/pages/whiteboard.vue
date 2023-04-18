<template>
  <q-layout
    view="hHh LpR fFf"
    container
    :style="`height: calc(100vh - ${headerSize.height}px);`"
    class="bg-primary"
  >
    <!--
    <q-card :style="height">
          <q-pdfviewer
    v-model="visible"
    :src="tempPDF"
      content-class="fit container"
      inner-content-class="fit container"
  /></q-card>toolbar('saveCanvas') 58 to 200
  behavior="desktop"
  @mouseout="miniState = true"
        @mouseover="miniState = false"
-->
    <q-drawer
      v-model="showTools"
      show-if-above
      no-swipe-open
      no-swipe-close
      behavior="desktop"
      :width="$q.screen.lt.sm ? headerSize.width : 200"
      side="left"
      :mini="miniState"
      mini-to-overlay
      :breakpoint="500"
      content-class="bg-primary text-primary-inv q-mb-md shadow-2 fit column no-wrap"
      @click="clearPolyFix"
    >
      <div class="col q-pa-sm q-pt-lg q-gutter-xs text-center">
        <strong v-if="type === 'add'" class="text-secondary">{{
          miniState ? '' : 'Submissions'
        }}</strong>
        <q-btn
          v-if="type === 'add'"
          flat
          dense
          :label="miniState ? '' : 'Place'"
          icon="save"
          class="row"
          @click="placeSketch"
        >
          <q-tooltip>Submit sketch placement</q-tooltip>
          <!-- <q-icon name="save" /> -->
        </q-btn>
        <strong v-if="type === 'approval'" class="text-secondary">{{
          miniState ? '' : 'Submissions'
        }}</strong>
        <q-btn
          v-if="type === 'approval' && !rejectedRemoved"
          flat
          dense
          :label="miniState ? '' : 'Hide rejected'"
          icon="far fa-eye-slash"
          class="row"
          @click="hideRejected"
        >
          <q-tooltip>Remove rejected</q-tooltip>
          <!-- <q-icon name="far fa-eye-slash" class="text-white" /> -->
        </q-btn>
        <q-btn
          v-if="type === 'approval'"
          flat
          dense
          :label="miniState ? '' : 'Approve'"
          icon="done"
          class="row text-green"
          @click="approveSketch"
        >
          <q-tooltip>Approve</q-tooltip>
          <!-- <q-icon name="done" class="text-green" /> -->
        </q-btn>
        <q-btn
          v-if="type === 'approval'"
          flat
          dense
          :label="miniState ? '' : 'Reject'"
          icon="cancel"
          class="row text-red"
          @click="rejectSketch"
        >
          <q-tooltip>Reject</q-tooltip>
          <!-- <q-icon name="cancel" class="text-red" /> -->
        </q-btn>
        <strong class="text-secondary">{{ miniState ? '' : 'Canvas' }}</strong>
        <q-btn
          v-if="!['add', 'open'].includes(type)"
          flat
          dense
          icon="save"
          :label="miniState ? '' : 'Save'"
          class="row"
          @click="saveCanvas"
        >
          <q-tooltip>Save</q-tooltip>
        </q-btn>
        <q-btn
          v-if="!['add'].includes(type)"
          flat
          dense
          label="OCR"
          icon="cloud_download"
          class="row"
          @click="getOCR"
        >
          <q-tooltip>Perform character recognitian</q-tooltip>
        </q-btn>
        <q-btn
          v-if="!['add'].includes(type)"
          flat
          dense
          :label="miniState ? '' : 'Download'"
          icon="cloud_download"
          class="row"
          @click="downloadImage"
        >
          <q-tooltip>Download image</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          class="row"
          :label="miniState ? '' : 'Pan canvas'"
          icon="open_with"
          :class="drawMode === 'pan' ? 'text-yellow' : 'text-white'"
          @click="setMode('pan')"
        >
          <q-tooltip>Pan canvas</q-tooltip>
          <!-- <q-icon
            name="open_with"
            :color="drawMode === 'pan' ? 'yellow' : 'white'"
          /> -->
        </q-btn>
        <q-btn
          flat
          dense
          class="row"
          icon="zoom_in"
          :label="miniState ? '' : 'Zoom in'"
          @click="zoom(4 / 3)"
        >
          <q-tooltip>Zoom in</q-tooltip>
          <!-- <q-icon name="zoom_in" /> -->
        </q-btn>
        <q-btn
          flat
          dense
          class="row"
          icon="zoom_out"
          :label="miniState ? '' : 'Zoom out'"
          @click="zoom(3 / 4)"
        >
          <q-tooltip>Zoom out</q-tooltip>
          <!-- <q-icon name="zoom_out" /> -->
        </q-btn>
        <q-btn
          flat
          dense
          class="row"
          :label="miniState ? '' : 'Reset view'"
          icon="zoom_out_map"
          @click="resetViewpoint"
        >
          <q-tooltip>Reset view</q-tooltip>
          <!-- <q-icon
            name="open_with"
            :color="drawMode === 'pan' ? 'yellow' : 'white'"
          /> -->
        </q-btn>
        <q-btn
          v-if="fullToolbar"
          flat
          dense
          class="q-mb-sm row"
          :label="miniState ? '' : 'Resize'"
          icon="crop_free"
          @click="defineCanvasSize"
        >
          <q-tooltip>Resize canvas</q-tooltip>
          <!-- <q-icon name="far fa-copy" /> -->
        </q-btn>
        <q-btn
          v-if="fullToolbar"
          flat
          dense
          icon="delete_forever"
          :label="miniState ? '' : 'Clear all'"
          class="row"
          @click="clearCanvas"
        >
          <q-tooltip>Clear all</q-tooltip>
          <!-- <q-icon name="save" /> -->
        </q-btn>
        <q-card class="q-my-sm full-width" style="height: 36px">
          <q-card-section class="img-container">
            <img src="~assets/trans-bg2.jpg" class="img-primary" />
            <q-btn
              v-if="fullToolbar"
              flat
              dense
              :style="`background: ${backgroundColor}; border: 1px solid white; padding: -1px;`"
              icon="crop_square"
              :color="backgroundLightOrDark"
              class="img-primary"
              :label="miniState ? '' : 'Background'"
              @click="showPopup('background')"
            >
              <q-tooltip>Background</q-tooltip>
            </q-btn>
          </q-card-section>
        </q-card>
        <q-separator dark class="q-my-sm" />
        <!-- <q-separator dark class="q-my-sm" /> -->
        <strong class="text-secondary">{{ miniState ? '' : 'Edit' }}</strong>
        <q-btn
          flat
          dense
          :label="miniState ? '' : 'Edit'"
          icon="mdi-cursor-default"
          :class="drawMode === 'edit' ? 'text-yellow' : 'text-white'"
          class="row"
          @click="setMode('edit')"
        >
          <q-tooltip>Edit</q-tooltip>
        </q-btn>
        <div v-if="fullToolbar">
          <q-btn
            flat
            dense
            :disabled="history === 0"
            class="row"
            :label="miniState ? '' : 'Undo'"
            icon="undo"
            @click="undoRedo(-1)"
          >
            <q-tooltip>Undo</q-tooltip>
            <!-- <q-icon name="undo" /> -->
          </q-btn>
          <q-btn
            flat
            dense
            :disabled="history === maxHistory"
            class="row"
            :label="miniState ? '' : 'Redo'"
            icon="redo"
            @click="undoRedo(1)"
          >
            <q-tooltip>Redo</q-tooltip>
            <!-- <q-icon name="redo" /> -->
          </q-btn>
          <q-btn
            flat
            dense
            class="q-mb-sm row"
            :label="miniState ? '' : 'Clone'"
            icon="far fa-copy"
            @click="cloneObject"
          >
            <q-tooltip>Clone object</q-tooltip>
            <!-- <q-icon name="far fa-copy" /> -->
          </q-btn>
          <q-btn
            flat
            dense
            class="q-mb-sm row"
            :label="miniState ? '' : 'Delete'"
            icon="delete_outline"
            @click="deleteItem"
          >
            <q-tooltip>Delete object</q-tooltip>
            <!-- <q-icon name="delete_outline" /> -->
          </q-btn>
          <q-separator dark class="q-my-sm" />
          <strong class="text-secondary">{{ miniState ? '' : 'Add' }}</strong>
          <q-btn
            flat
            dense
            class="q-mb-sm row"
            :label="miniState ? '' : `Draw (${brushType})`"
            icon="create"
            :class="drawMode === 'freeDraw' ? 'text-yellow' : 'text-white'"
            @click="setMode('freeDraw')"
          >
            <q-tooltip>Free drawing</q-tooltip>
            <!-- <q-icon
              name="create"
              :color="drawMode === 'freeDraw' ? 'yellow' : 'white'"
            /> -->
          </q-btn>
          <q-btn
            flat
            dense
            class="q-mb-sm row"
            :label="miniState ? '' : 'Polygons'"
            icon="mdi-vector-polygon"
            :class="drawMode === 'polygonDraw' ? 'text-yellow' : 'text-white'"
            @click="setMode('polygonDraw')"
          >
            <q-tooltip>Add/Edit polygon</q-tooltip>
            <!-- <q-icon
              name="mdi-vector-polygon"
              :color="drawMode === 'polygonDraw' ? 'yellow' : 'white'"
            /> -->
          </q-btn>
          <q-btn
            flat
            dense
            class="q-mb-sm row"
            :label="miniState ? '' : 'Shape'"
            icon="category"
            @click="addObject"
          >
            <q-tooltip>Add shape</q-tooltip>
            <!-- <q-icon name="far fa-copy" /> -->
          </q-btn>
          <q-btn
            flat
            dense
            class="q-mb-sm row"
            :label="miniState ? '' : 'Text'"
            icon="text_format"
            @click="addText"
          >
            <q-tooltip>Add text</q-tooltip>
            <!-- <q-icon name="far fa-copy" /> -->
          </q-btn>
          <q-btn
            flat
            dense
            class="q-mb-sm row"
            :label="miniState ? '' : 'Image(s)'"
            icon="insert_photo"
            @click="addImage"
          >
            <q-tooltip>Add image(s)</q-tooltip>
            <!-- <q-icon name="far fa-copy" /> -->
          </q-btn>
          <q-separator dark class="q-my-sm" />
          <!-- <q-separator dark class="q-my-sm" /> -->
          <strong class="text-secondary">{{ miniState ? '' : 'Style' }}</strong>
          <q-card class="q-my-sm full-width" style="height: 36px">
            <q-card-section class="img-container">
              <img src="~assets/trans-bg2.jpg" class="img-primary" />
              <q-btn
                flat
                dense
                :style="`background: ${penColor}; border: 1px solid white; padding: -1px;`"
                icon="brush"
                :color="strokeLightOrDark"
                class="img-primary"
                :label="miniState ? '' : 'Stroke'"
                @click="showPopup('stroke')"
              >
                <q-tooltip>Stroke/Line</q-tooltip>
              </q-btn>
            </q-card-section>
          </q-card>
          <q-card class="q-my-none full-width" style="height: 36px">
            <q-card-section class="img-container">
              <img src="~assets/trans-bg2.jpg" class="img-primary" />
              <q-btn
                flat
                dense
                :style="`background: ${fillColor}; border: 1px solid white; padding: -1px; position: relative; top: 0;`"
                icon="crop_square"
                :color="fillLightOrDark"
                class="img-primary"
                :label="miniState ? '' : 'Fill'"
                @click="showPopup('fill')"
              >
                <q-tooltip>Fill</q-tooltip>
              </q-btn>
            </q-card-section>
          </q-card>
          <q-card class="q-my-sm full-width" style="height: 36px">
            <q-card-section class="img-container">
              <img src="~assets/trans-bg2.jpg" class="img-primary" />
              <q-btn
                flat
                dense
                :style="`background: ${shadowColor}; border: 1px solid white; padding: -1px;`"
                icon="content_copy"
                :color="shadowLightOrDark"
                class="img-primary"
                :label="miniState ? '' : 'Shadow'"
                @click="showPopup('shadow')"
              >
                <q-tooltip>Shadow</q-tooltip>
              </q-btn>
            </q-card-section>
          </q-card>
          <q-card class="q-my-sm full-width" style="height: 36px">
            <q-card-section class="img-container">
              <img src="~assets/trans-bg2.jpg" class="img-primary" />
              <q-btn
                flat
                dense
                :style="`background: ${textColor}; border: 1px solid white; padding: -1px; font-family: ${font};`"
                icon="text_format"
                :color="textLightOrDark"
                class="img-primary"
                :label="miniState ? '' : 'Text format'"
                @click="showPopup('text')"
              >
                <q-tooltip>Text</q-tooltip>
              </q-btn>
            </q-card-section>
          </q-card>
          <q-separator dark class="q-my-sm" />
          <strong class="text-secondary">{{
            miniState ? '' : 'Placement'
          }}</strong>
          <q-btn
            flat
            dense
            icon="mdi-flip-horizontal"
            :label="miniState ? '' : 'Flip horizontal'"
            class="row"
            @click="flip('X')"
          >
            <q-tooltip>Flip horizontal</q-tooltip>
            <!-- <q-icon name="save" /> -->
          </q-btn>
          <q-btn
            flat
            dense
            icon="mdi-flip-vertical"
            :label="miniState ? '' : 'Flip vertical'"
            class="row"
            @click="flip('Y')"
          >
            <q-tooltip>Flip vertical</q-tooltip>
            <!-- <q-icon name="save" /> -->
          </q-btn>
          <div v-for="(tool, index) in toolbar" :key="index">
            <q-separator v-if="tool.separator" dark class="q-my-sm row" />
            <q-btn
              v-else
              flat
              dense
              :icon="tool.icon"
              :label="miniState ? '' : tool.tooltip"
              class="row"
              @click="toolClick(tool.action, tool.arg)"
            >
              <q-tooltip>{{ tool.tooltip }}</q-tooltip>
              <!-- <q-icon :name="tool.icon" /> -->
            </q-btn>
          </div>
        </div>
        <div v-if="!fullToolbar && type !== 'open'">
          <q-separator dark class="q-my-sm" />
          <strong class="text-secondary">{{
            miniState ? '' : 'Placement'
          }}</strong>
          <div v-for="(tool, index) in toolbar2" :key="index">
            <q-separator v-if="tool.separator" dark class="q-my-sm row" />
            <q-btn
              v-else
              flat
              dense
              :icon="tool.icon"
              :label="miniState ? '' : tool.tooltip"
              class="row"
              @click="toolClick(tool.action, tool.arg)"
            >
              <q-tooltip>{{ tool.tooltip }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="absolute" style="top: 15px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="accent"
          :icon="miniState ? 'chevron_right' : 'chevron_left'"
          @click="miniState = !miniState"
        />
      </div>
      <div style="max-width: 800px; width: 100%">
        <div
          titlebar-class="bg-secondary text-yellow"
          title="Placement"
          hide-grippers
          :height="325"
          :width="200"
          :actions="['embedded']"
          class="text-red"
          content-class="bg-primary text-primary-inv"
        >
          <div class="q-pa-md fit">
            <q-btn
              flat
              dense
              icon="mdi-flip-horizontal"
              label="Flip horizontal"
              class="row"
              @click="flip('X')"
            >
              <q-tooltip>Flip horizontal</q-tooltip>
              <!-- <q-icon name="save" /> -->
            </q-btn>
            <q-btn
              flat
              dense
              icon="mdi-flip-vertical"
              label="Flip vertical"
              class="row"
              @click="flip('Y')"
            >
              <q-tooltip>Flip vertical</q-tooltip>
              <!-- <q-icon name="save" /> -->
            </q-btn>
            <div v-for="(tool, index) in toolbar" :key="index">
              <q-separator v-if="tool.separator" dark class="q-my-sm row" />
              <q-btn
                v-else
                flat
                dense
                :icon="tool.icon"
                :label="tool.tooltip"
                class="row"
                @click="toolClick(tool.action, tool.arg)"
              >
                <q-tooltip>{{ tool.tooltip }}</q-tooltip>
                <!-- <q-icon :name="tool.icon" /> -->
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <div
        v-if="showCanvas"
        id="canvasWrap"
        class="row full-width items-center justify-center bg-dark"
      >
        <!-- <q-inner-loading :showing="true">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading> -->
        <canvas
          ref="can"
          width="800"
          height="800"
          style="border: 1px solid black"
        ></canvas>
      </div>
    </q-page-container>
    <q-dialog v-model="loading">
      <q-spinner-gears size="250px" color="primary" />
      <!-- <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card> -->
    </q-dialog>
  </q-layout>
</template>

<script>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// import { fabric } from 'fabric'
import * as fabric from 'fabric'
import FontFaceObserver from 'fontfaceobserver'
// import fabricBrush from 'fabric-brush'
import toolbar from 'components/toolbar'
import toolbar2 from 'components/toolbar2'
// import imageTracer from 'imagetracerjs'
// import Echo from 'laravel-echo'
// import stateComputed from 'components/js/state-computed'
export default {
  components: {},
  props: {
    height: { type: String, default: '' },
    sketchId: { type: String, default: '0' },
    masterId: { type: String, default: '0' },
    type: { type: String, default: '' },
  },
  data() {
    return {
      headerSize: { width: 1000, height: 64 },
      incomingWhisper: false,
      currentX: 0,
      currentY: 0,
      lastX: 0,
      lastY: 0,
      pointIndex: 0,
      pausePanning: true,
      font: 'Times New Roman',
      fonts: [
        'Abril Fatface',
        'Amatic SC',
        'Amiri',
        'Anton',
        'Bangers',
        'Bebas Neue',
        'Dancing Script',
        'Indie Flower',
        'Josefin Sans',
        'Lobster',
        'Open Sans Condensed',
        'Playfair Display',
        'Roboto Condensed',
        'Source Code Pro',
        'Times New Roman',
      ],
      miniState: true,
      loading: false,
      rejectedRemoved: false,
      toolbar,
      toolbar2,
      showCanvas: true,
      polygonMode: false,
      sketches: [],
      pointArray: [],
      lineArray: [],
      activeLine: {},
      activeShape: false,
      isNew: true,
      undoOrRedoEvent: false,
      numImages: 0,
      disableRedo: true,
      history: 0,
      historyStorage: {},
      maxHistory: 0,
      title: '',
      sketchTitle: '',
      description: '',
      thumbnail: '',
      imgSrc: [],
      showTools: true,
      // drawMode: { freeDraw: true, edit: false },
      drawMode: 'edit',
      brushType: 'pencil',
      // freeDrawDialog: false,
      tempPDF: '',
      visible: true,
      canvas: '',
      lineWidth: 10,
      shadowWidth: 0,
      penColor: 'rgba(0,0,0,1)', // '#FF0000',
      shadowColor: 'rgba(0,0,96,1)', // '#005',
      backgroundColor: 'rgba(255,255,255,1)', // '#FFF',
      fillColor: 'rgba(80,80,80,1)', // '#666666',
      textColor: 'rgba(0,0,0,1)',
      fillOpacity: 1,
      shadowOffset: { x: 0, y: 0 },
      shadowRotation: 45,
      strokeUniform: false,
      isDrawingMode: false,
      sketchProperties: { width: 1000, height: 1000 },
      lastJSON: {},
      group: 1,
      // user: {},
      options: [
        {
          tooltip: 'Free drawing',
          value: 1,
          slot: 'one',
        },
        {
          tooltip: 'Normal mode',
          slot: 'two',
          value: 2,
        },
        {
          tooltip: 'Read only (teacher) mode',
          slot: 'three',
          value: 3,
        },
      ],
    }
  },
  computed: {
    // ...stateComputed,
    // headerSize: {
    //   get() {
    //     return this.$store.state.TxN.headerSize
    //   },
    //   set(val) {
    //     this.$store.commit('TxN/updateHeaderSize', val)
    //   }
    // },
    noSave() {
      return !['add', 'open'].includes(this.type)
    },
    fullToolbar() {
      return !this.isMaster || this.type === 'edit'
    },
    isMaster() {
      return this.$route.name === 'communityboard'
    },
    // user() {
    //   return this.$store.state.TxN.user
    // },
    // checker() {
    //   return this.$store.state.TxN.checkerboard
    // },
    // pageTitle: {
    //   get() {
    //     return this.$store.state.TxN.pageTitle
    //   },
    //   set(val) {
    //     this.$store.commit('TxN/updatePageTitle', val)
    //   }
    // },
    // sketchproperties: {
    //   get() {
    //     return this.$store.getters['TxN/getSketchProperties']
    //   },
    //   set(val) {
    //     this.$store.commit('TxN/setSketchProperties', val)
    //   }
    // },
    fillLightOrDark() {
      return this.lightOrDark(this.fillColor)
    },
    strokeLightOrDark() {
      return this.lightOrDark(this.penColor)
    },
    shadowLightOrDark() {
      return this.lightOrDark(this.shadowColor)
    },
    textLightOrDark() {
      return this.lightOrDark(this.textColor)
    },
    backgroundLightOrDark() {
      return this.lightOrDark(this.backgroundColor)
    },
  },
  watch: {
    sketchId() {
      // this.showCanvas = false
      // this.showCanvas = true
      this.doClear()
      this.configureCanvas()
    },
    masterId() {
      // this.showCanvas = false
      // this.showCanvas = true
      this.doClear()
      this.configureCanvas()
    },
  },
  mounted() {
    // this.getReadResult(
    //   'https://escrut.cognitiveservices.azure.com/vision/v3.2/read/analyzeResults/3ff3e6a1-e77a-490f-9320-916b3635e73f'
    // )
    if (this.headerSize.width > 700) {
      this.miniState = false
    }
    this.loading = true
    if (this.isMaster) {
      console.log(this.sketchId, this.masterId, this.type)
    }
    // console.log(fabricBrush)
    // console.log(this.$route.params.sketchId)
    // this.imgSrc = 'data:image/png;base64,' + this.$TxN.blankAvatar()
    // window.io = require('socket.io-client')
    this.sketchproperties = { width: 1000, height: 1000 }
    this.fonts.map((o) => {
      this.loadAndUseFont(o)
    })
    this.configureCanvas()
    this.connectEcho()
    // this.renderAvatar(this.user.avatar)
    // window.addEventListener('keyup', this.keyHandler)
  },
  beforeUnmount() {
    if (['edit', ''].includes(this.type)) {
      const json = this.canvas.toJSON()
      this.$q.localStorage.set('history', json)
    }
    // else if (this.type === 'edit' && this.$q.localStorage.has('history')) {
    //   this.$q.localStorage.remove('history')
    // }
    // this.clearHistory()
    if (window.Echo) {
      window.Echo.leave('whiteboard')
    }
    // window.removeEventListener('keyup', this.keyHandler)
  },
  methods: {
    loadAndUseFont(font) {
      var myfont = new FontFaceObserver(font)
      myfont
        .load()
        .then(() => {
          // when font is loaded, use it.
          // this.canvas.getActiveObject().set('fontFamily', font)
          // this.canvas.requestRenderAll()
        })
        .catch((err) => {
          console.log('font loading failed ' + font, err)
          // alert('font loading failed ' + font)
        })
    },
    clipObject() {
      var activeObjects = this.canvas.getActiveObjects()
      activeObjects[0].clone((clonedObj) => {
        // clonedObj.set({
        //   clipPath: new fabric.Circle({
        //     radius: 50,
        //     originX: 'center',
        //     originY: 'center'
        //   })
        // })
        clonedObj.set({
          clipPath: activeObjects[1],
        })
        this.canvas.add(clonedObj)
        this.canvas.renderAll()
      })
      // console.log(activeObjects)
      // activeObjects[1].set('clipPath', activeObjects[0])
      // this.canvas.requestRenderAll()
    },
    cloneObject() {
      var activeObject = this.canvas.getActiveObject()
      if (activeObject) {
        activeObject.clone((clonedObj) => {
          this.canvas.discardActiveObject()
          clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
          })
          if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = this.canvas
            clonedObj.forEachObject((obj) => {
              this.canvas.add(obj)
            })
            // this should solve the unselectability
            clonedObj.setCoords()
          } else {
            this.canvas.add(clonedObj)
          }
          this.canvas.setActiveObject(clonedObj)
          this.canvas.requestRenderAll()
        })
      }
    },
    flip(arg) {
      const toFlip = `flip${arg}`
      var activeObject = this.canvas.getActiveObject()
      if (activeObject) {
        activeObject.set(toFlip, !activeObject[toFlip])
        this.canvas.requestRenderAll()
      }
    },
    editPolygon() {
      // clone what are you copying since you
      // may want copy and paste on different moment.
      // and you do not want the changes happened
      // later to reflect on the copy.
      // var poly = this.canvas.getObjects()[0]
      var poly = this.canvas.getActiveObject()
      poly.set('objectCaching', false)
      var that
      that = this
      // this.canvas.setActiveObject(poly)
      poly.edit = !poly.edit
      if (poly.edit) {
        var lastControl = poly.points.length - 1
        poly.cornerStyle = 'circle'
        poly.cornerColor = 'rgba(0,0,255,0.8)'
        poly.controls = poly.points.reduce(function (acc, point, index) {
          acc['p' + index] = new fabric.Control({
            positionHandler: (dim, finalMatrix, fabricObject) =>
              that.polygonPositionHandler(
                dim,
                finalMatrix,
                fabricObject,
                index
              ),
            actionHandler: that.anchorWrapper(
              index > 0 ? index - 1 : lastControl,
              that.actionHandler
            ),
            actionName: 'modifyPolygon',
            pointIndex: index,
          })
          return acc
        }, {})
      } else {
        poly.cornerColor = 'blue'
        poly.cornerStyle = 'rect'
        poly.controls = fabric.Object.prototype.controls
      }
      poly.hasBorders = !poly.edit
      // that.canvas.renderAll()
      that.canvas.requestRenderAll()
      // poly.set('objectCaching', true)
    },
    // polygonPositionHandler(dim, finalMatrix, fabricObject) {
    polygonPositionHandler(dim, finalMatrix, fabricObject, pointIndex) {
      var x = fabricObject.points[pointIndex].x - fabricObject.pathOffset.x,
        y = fabricObject.points[pointIndex].y - fabricObject.pathOffset.y
      // console.log({ x: x, y: y })
      const toReturn = fabric.util.transformPoint(
        { x: x, y: y },
        fabric.util.multiplyTransformMatrices(
          fabricObject.canvas.viewportTransform,
          fabricObject.calcTransformMatrix()
        )
      )
      // console.log('toReturn', toReturn)
      return toReturn
    },
    anchorWrapper(anchorIndex, fn) {
      return function (eventData, transform, x, y) {
        var fabricObject = transform.target
        var absolutePoint = fabric.util.transformPoint(
          {
            x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
            y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
          },
          fabricObject.calcTransformMatrix()
        )
        var actionPerformed = fn(eventData, transform, x, y)
        //eslint-disable-next-line no-unused-vars
        fabricObject._setPositionDimensions({})
        // var newDim = fabricObject._setPositionDimensions({})
        var polygonBaseSize = fabricObject._getNonTransformedDimensions()
        var newX =
          (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
          polygonBaseSize.x
        var newY =
          (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
          polygonBaseSize.y
        // console.log(polygonBaseSize, newX, newY)
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5)
        return actionPerformed
      }
    },
    actionHandler(eventData, transform, x, y) {
      // console.log(eventData)
      // console.log(transform)
      var polygon = transform.target,
        currentControl = polygon.controls[polygon.__corner],
        mouseLocalPosition = polygon.toLocalPoint(
          new fabric.Point(x, y),
          'center',
          'center'
        ),
        polygonBaseSize = polygon._getNonTransformedDimensions(),
        size = polygon._getTransformedDimensions(0, 0),
        finalPointPosition = {
          x:
            (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
            polygon.pathOffset.x,
          y:
            (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
            polygon.pathOffset.y,
        }
      // console.log('final PP: ', finalPointPosition)
      polygon.points[currentControl.pointIndex] = finalPointPosition
      // console.log(polygon)
      // console.log('stored: ', polygon.points[currentControl.pointIndex])
      // polygon.scale(1.001)
      // this.canvas.requestRenderAll()
      // polygon.scale(0.999)
      this.canvas.renderAll()
      return true
    },
    drawPolygon() {
      this.polygonMode = true
      this.pointArray = []
      this.lineArray = []
      this.activeLine = {}
    },
    addPolyPoint(options) {
      var vpt = this.canvas.viewportTransform
      const min = 99
      const max = 999999
      var random = Math.floor(Math.random() * (max - min + 1)) + min
      var id = new Date().getTime() + random
      var circle = new fabric.Circle({
        radius: 5,
        fill: '#ffffff',
        stroke: '#333333',
        strokeWidth: 0.5,
        left: (options.e.layerX - vpt[4]) / this.canvas.getZoom(),
        top: (options.e.layerY - vpt[5]) / this.canvas.getZoom(),
        selectable: false,
        hasBorders: false,
        hasControls: false,
        originX: 'center',
        originY: 'center',
        id: id,
        objectCaching: false,
      })
      if (this.pointArray.length === 0) {
        circle.set({
          fill: 'red',
        })
      }
      var points = [
        (options.e.layerX - vpt[4]) / this.canvas.getZoom(),
        (options.e.layerY - vpt[5]) / this.canvas.getZoom(),
        (options.e.layerX - vpt[4]) / this.canvas.getZoom(),
        (options.e.layerY - vpt[5]) / this.canvas.getZoom(),
      ]
      var line = new fabric.Line(points, {
        strokeWidth: 2,
        fill: '#999999',
        stroke: '#999999',
        class: 'line',
        originX: 'center',
        originY: 'center',
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false,
      })
      if (this.activeShape) {
        var pos = this.canvas.getPointer(options.e)
        points = this.activeShape.get('points')
        points.push({
          x: pos.x,
          y: pos.y,
        })
        var polygon = new fabric.Polygon(points, {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '#cccccc',
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        })
        this.canvas.remove(this.activeShape)
        this.canvas.add(polygon)
        this.activeShape = polygon
        this.canvas.renderAll()
      } else {
        var polyPoint = [
          {
            x: (options.e.layerX - vpt[4]) / this.canvas.getZoom(),
            y: (options.e.layerY - vpt[5]) / this.canvas.getZoom(),
          },
        ]
        polygon = new fabric.Polygon(polyPoint, {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '#cccccc',
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        })
        this.activeShape = polygon
        this.canvas.add(polygon)
      }
      this.activeLine = line

      this.pointArray.push(circle)
      this.lineArray.push(line)

      this.canvas.add(line)
      this.canvas.add(circle)
      this.canvas.selection = false
    },
    generatePolygon(pointArray) {
      var points = []
      pointArray.forEach((point) => {
        points.push({
          x: point.left,
          y: point.top,
        })
        this.canvas.remove(point)
      })
      this.lineArray.forEach((line) => {
        this.canvas.remove(line)
      })
      this.canvas.remove(this.activeShape).remove(this.activeLine)
      var polygon = new fabric.Polygon(points, {
        stroke: this.penColor,
        strokeWidth: this.lineWidth,
        fill: this.fillColor,
        opacity: this.fillOpacity,
        hasBorders: true,
        hasControls: true,
      })
      this.setMode('edit')
      this.canvas.add(polygon)

      this.activeLine = null
      this.activeShape = null
      this.polygonMode = false
      this.canvas.selection = true
    },
    lightOrDark(color) {
      // Variables for red, green, blue values
      var r, g, b, hsp

      // Check the format of the color, HEX or RGB?
      if (color.match(/^rgb/)) {
        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(
          /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        )

        r = color[1]
        g = color[2]
        b = color[3]
      } else {
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +(
          '0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&')
        )

        r = color >> 16
        g = (color >> 8) & 255
        b = color & 255
      }

      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

      // Using the HSP value, determine whether the color is light or dark
      if (hsp > 127.5) {
        return 'black'
      } else {
        return 'white'
      }
    },
    // disableUndoRedo(dir) {
    //   if (parseInt(dir) === -1) {
    //     return this.history === 0
    //   } else {
    //     return this.history === this.maxHistory
    //   }
    // },
    toolClick(action, arg) {
      if (arg) {
        this[action](arg)
      } else {
        this[action]()
      }
    },
    sendBackward() {
      const currentObject = this.canvas.getActiveObject()
      this.canvas.sendBackwards(currentObject)
      this.canvas.renderAll()
    },
    bringForward() {
      const currentObject = this.canvas.getActiveObject()
      this.canvas.bringForward(currentObject)
      this.canvas.renderAll()
    },
    sendToBack() {
      const currentObject = this.canvas.getActiveObject()
      this.canvas.sendToBack(currentObject)
      this.canvas.renderAll()
    },
    bringToFront() {
      const currentObject = this.canvas.getActiveObject()
      this.canvas.bringToFront(currentObject)
      this.canvas.renderAll()
    },
    groupItems() {
      var activeObj = this.canvas.getActiveObject()
      var activegroup = activeObj.toGroup()
      var objectsInGroup = activegroup.getObjects()
      activegroup.clone((newgroup) => {
        this.canvas.remove(activegroup)
        objectsInGroup.forEach((object) => {
          this.canvas.remove(object)
        })
        this.canvas.add(newgroup)
      })
    },
    ungroupItems() {
      var activeObject = this.canvas.getActiveObject()
      if (activeObject.type === 'group') {
        var items = activeObject._objects
        activeObject._restoreObjectsState()
        this.canvas.remove(activeObject)
        for (var i = 0; i < items.length; i++) {
          this.canvas.add(items[i])
          this.canvas.item(this.canvas.size() - 1).hasControls = true
        }

        this.canvas.renderAll()
      }
    },
    createImage(imageIn) {
      var imgElement = new Image()
      imgElement.src = imageIn
      var imgInstance = new fabric.Image(imgElement, {
        left: 100,
        top: 100,
        angle: 0,
        opacity: 1.0,
      })
      this.canvas.add(imgInstance).renderAll()
    },
    addSVG(imageIn) {
      fabric.loadSVGFromString(imageIn, (objects, options) => {
        var obj = fabric.util.groupSVGElements(objects, options)
        this.canvas.add(obj).renderAll()
      })
    },
    addImage() {
      const imageTypes = this.$GOcommon.imageTypes
        .map((o) => {
          return '.' + o
        })
        .join(',')
      this.$q
        .dialog({
          component: this.$customDialog.FileUpload,
          parent: this,
          title: 'Add images',
          multiple: true,
          type: 'avatar',
          accept: imageTypes,
          postAPI: '/uploader',
        })
        .onOk((response) => {
          // console.log(response)
          this.canvas.renderOnAddRemove = false
          this.undoOrRedoEvent = true
          // const test = imageTracer.imagedataToSVG(
          //   {
          //     width: 200,
          //     height: 200,
          //     data: response.data[0]
          //   },
          //   'Posterized2'
          // )
          // console.log(test)
          // fabric.loadSVGFromString(test, (objects, options) => {
          //   console.log(objects)
          //   console.log(options)
          //   var obj = fabric.util.groupSVGElements(objects, options)
          //   this.canvas.add(obj).renderAll()
          // })
          response.data.map((o, i) => {
            if (response.fileNames[i].type.toLowerCase().includes('svg')) {
              this.addSVG(o)
            } else {
              this.createImage(o)
            }
          })
          this.canvas.loadFromJSON(this.canvas.toJSON())
          this.canvas.renderOnAddRemove = true
          this.undoOrRedoEvent = false
        })
    },
    addObject() {
      // var activeObject = this.canvas.getActiveObject()
      const testData = [
        {
          type: 'header',
          title: 'Add shape',
        },
        {
          name: 'object',
          value: '',
          label: 'Add shape',
          required: true,
          type: 'select',
          options: ['Rectangle', 'Ellipse', 'Triangle'],
        },
        {
          name: 'width',
          value: 100,
          label: 'Width',
          required: true,
          type: 'input',
          validation: { content: 'numeric' },
        },
        {
          name: 'height',
          value: 100,
          label: 'Height',
          required: true,
          type: 'input',
          validation: { content: 'numeric' },
        },
      ]
      this.$q
        .dialog({
          component: this.$customDialog.CustomForm,
          parent: this,
          fields: testData,
        })
        .onOk((data) => {
          data.width = parseInt(data.width)
          data.height = parseInt(data.height)
          console.log(data)
          switch (data.object) {
            case 'Rectangle':
              var rect = new fabric.Rect({
                left: 100,
                top: 100,
                fill: this.fillColor,
                stroke: this.penColor,
                strokeWidth: this.lineWidth,
                strokeUniform: this.strokeUniform,
                width: data.width,
                height: data.height,
              })
              rect.shadow = new fabric.Shadow({
                blur: this.shadowWidth,
                offsetX: this.shadowOffset.x,
                offsetY: this.shadowOffset.y,
                affectStroke: true,
                color: this.shadowColor,
              })
              this.canvas.add(rect)
              break
            case 'Ellipse':
              var ellipse = new fabric.Ellipse({
                rx: data.width,
                ry: data.height,
                fill: this.fillColor,
                stroke: this.penColor,
                strokeWidth: this.lineWidth,
                strokeUniform: this.strokeUniform,
                left: 100,
                top: 100,
              })
              ellipse.shadow = new fabric.Shadow({
                blur: this.shadowWidth,
                offsetX: this.shadowOffset.x,
                offsetY: this.shadowOffset.y,
                affectStroke: true,
                color: this.shadowColor,
              })
              this.canvas.add(ellipse)
              break
            case 'Triangle':
              var tri = new fabric.Triangle({
                left: 100,
                top: 100,
                fill: this.fillColor,
                stroke: this.penColor,
                strokeWidth: this.lineWidth,
                strokeUniform: this.strokeUniform,
                width: data.width,
                height: data.height,
              })
              tri.shadow = new fabric.Shadow({
                blur: this.shadowWidth,
                offsetX: this.shadowOffset.x,
                offsetY: this.shadowOffset.y,
                affectStroke: true,
                color: this.shadowColor,
              })
              this.canvas.add(tri)
              break
            default:
          }
        })
      // if (activeObject) {
      //   activeObject.set('strokeUniform', !activeObject.strokeUniform)
      //   this.canvas.renderAll()
      // }
    },
    toggleUniformStroke() {
      var activeObject = this.canvas.getActiveObject()
      if (activeObject) {
        activeObject.set('strokeUniform', !activeObject.strokeUniform)
        this.canvas.renderAll()
      }
    },
    setBrushType(value) {
      if (fabric.PatternBrush) {
        var vLinePatternBrush = new fabric.PatternBrush(this.canvas)
        vLinePatternBrush.getPatternSrc = function () {
          var patternCanvas = fabric.document.createElement('canvas')
          patternCanvas.width = patternCanvas.height = 10
          var ctx = patternCanvas.getContext('2d')

          ctx.strokeStyle = this.color
          ctx.lineWidth = 5
          ctx.beginPath()
          ctx.moveTo(0, 5)
          ctx.lineTo(10, 5)
          ctx.closePath()
          ctx.stroke()

          return patternCanvas
        }

        var hLinePatternBrush = new fabric.PatternBrush(this.canvas)
        hLinePatternBrush.getPatternSrc = function () {
          var patternCanvas = fabric.document.createElement('canvas')
          patternCanvas.width = patternCanvas.height = 10
          var ctx = patternCanvas.getContext('2d')

          ctx.strokeStyle = this.color
          ctx.lineWidth = 5
          ctx.beginPath()
          ctx.moveTo(5, 0)
          ctx.lineTo(5, 10)
          ctx.closePath()
          ctx.stroke()

          return patternCanvas
        }

        var squarePatternBrush = new fabric.PatternBrush(this.canvas)
        squarePatternBrush.getPatternSrc = function () {
          var squareWidth = 10,
            squareDistance = 2

          var patternCanvas = fabric.document.createElement('canvas')
          patternCanvas.width = patternCanvas.height =
            squareWidth + squareDistance
          var ctx = patternCanvas.getContext('2d')

          ctx.fillStyle = this.color
          ctx.fillRect(0, 0, squareWidth, squareWidth)

          return patternCanvas
        }

        var diamondPatternBrush = new fabric.PatternBrush(this.canvas)
        diamondPatternBrush.getPatternSrc = function () {
          var squareWidth = 10,
            squareDistance = 5
          var patternCanvas = fabric.document.createElement('canvas')
          var rect = new fabric.Rect({
            width: squareWidth,
            height: squareWidth,
            angle: 45,
            fill: this.color,
          })

          var canvasWidth = rect.getBoundingRect().width

          patternCanvas.width = patternCanvas.height =
            canvasWidth + squareDistance
          rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 })

          var ctx = patternCanvas.getContext('2d')
          rect.render(ctx)

          return patternCanvas
        }
      }
      switch (value) {
        case 'hline':
          this.canvas.freeDrawingBrush = vLinePatternBrush
          break
        case 'vline':
          this.canvas.freeDrawingBrush = hLinePatternBrush
          break
        case 'square':
          this.canvas.freeDrawingBrush = squarePatternBrush
          break
        case 'diamond':
          this.canvas.freeDrawingBrush = diamondPatternBrush
          break
        case 'pattern':
          this.canvas.freeDrawingBrush = new fabric.PatternBrush(this.canvas)
          break
        case 'spray':
          this.canvas.freeDrawingBrush = new fabric.SprayBrush(this.canvas)
          break
        // case 'crayon':
        //   this.canvas.freeDrawingBrush = new fabric.CrayonBrush(this.canvas)
        //   break
        case 'circle':
          this.canvas.freeDrawingBrush = new fabric.CircleBrush(this.canvas)
          break
        default:
          this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
      }
      if (this.canvas.freeDrawingBrush) {
        var brush = this.canvas.freeDrawingBrush
        brush.color = this.penColor
        if (brush.getPatternSrc) {
          brush.source = brush.getPatternSrc(brush)
        }
        brush.width = this.lineWidth
        brush.shadow = new fabric.Shadow({
          blur: this.shadowWidth,
          offsetX: this.shadowOffset.x,
          offsetY: this.shadowOffset.y,
          affectStroke: true,
          color: this.shadowColor,
        })
      }
    },
    showPopup(popup) {
      var activeObject = this.canvas.getActiveObject()
      if (popup === 'stroke') {
        // console.log(activeObject)
        // var test = new fabric.PatternBrush(this.canvas)
        // test.color = this.penColor
        // if (test.getPatternSrc) {
        //   test.source = test.getPatternSrc(test)
        // }
        // console.log(activeObject.getPattern())
        //         brush.color = this.penColor
        // if (brush.getPatternSrc) {
        //   brush.source = brush.getPatternSrc(brush)
        // }
        var color = this.penColor
        if (
          activeObject &&
          activeObject.stroke &&
          !activeObject.stroke.offsetX
        ) {
          color = activeObject.stroke
        }
        // console.log(color)
        this.$q
          .dialog({
            component: this.$customDialog.PenStyles,
            canvas: this.canvas,
            color: color,
            width: activeObject ? activeObject.strokeWidth : this.lineWidth,
            parent: this,
            showStroke: true,
            brushType: this.brushType,
            strokeUniform: activeObject
              ? activeObject.strokeUniform
              : this.strokeUniform,
            title: 'Stroke/Line',
          })
          .onOk((data) => {
            this.penColor = data.color
            this.strokeUniform = data.strokeUniform
            this.lineWidth = parseInt(data.width, 10) || 1
            this.canvas.freeDrawingBrush.width = this.lineWidth
            this.canvas.freeDrawingBrush.color = data.color
            this.brushType = data.brushType
            this.setBrushType(data.brushType)
            if (activeObject) {
              console.log(activeObject)
              if (
                activeObject.stroke.type &&
                activeObject.stroke.type === 'pattern'
              ) {
                console.log('log')
              } else {
                activeObject.set('stroke', data.color)
                activeObject.set('strokeWidth', this.lineWidth)
                activeObject.set('strokeUniform', this.strokeUniform)
              }
              // this.canvas.getActiveObject().set('opacity', data.width)
              this.canvas.renderAll()
            }
          })
      } else if (popup === 'shadow') {
        this.$q
          .dialog({
            component: this.$customDialog.PenStyles,
            canvas: this.canvas,
            color:
              activeObject && activeObject.shadow
                ? activeObject.shadow.color
                : this.shadowColor,
            width:
              activeObject && activeObject.shadow
                ? activeObject.shadow.blur
                : this.shadowWidth,
            offsetX:
              activeObject && activeObject.shadow
                ? activeObject.shadow.offsetX
                : this.shadowOffset.x,
            offsetY:
              activeObject && activeObject.shadow
                ? activeObject.shadow.offsetY
                : this.shadowOffset.y,
            parent: this,
            title: 'Shadow',
          })
          .onOk((data) => {
            this.shadowColor = data.color
            this.shadowWidth = parseInt(data.width, 10) || 0
            this.shadowOffset.x = parseInt(data.offsetX, 10) || 0
            this.shadowOffset.y = parseInt(data.offsetY, 10) || 0
            this.canvas.freeDrawingBrush.shadow.blur = this.shadowWidth
            this.canvas.freeDrawingBrush.shadow.color = data.color
            this.canvas.freeDrawingBrush.shadow.offsetX = this.shadowOffset.x
            this.canvas.freeDrawingBrush.shadow.offsetY = this.shadowOffset.y
            if (activeObject) {
              activeObject.set('shadow', {
                color: data.color,
                blur: this.shadowWidth,
                offsetX: this.shadowOffset.x,
                offsetY: this.shadowOffset.y,
              })
              // this.canvas.getActiveObject().set('opacity', data.width)
              this.canvas.renderAll()
            }
          })
      } else if (popup === 'background') {
        this.$q
          .dialog({
            component: this.$customDialog.PenStyles,
            canvas: this.canvas,
            color: this.backgroundColor,
            parent: this,
            title: 'Background',
          })
          .onOk((data) => {
            this.backgroundColor = data.color
            this.setBackground()
          })
      } else if (popup === 'fill') {
        this.$q
          .dialog({
            component: this.$customDialog.PenStyles,
            canvas: this.canvas,
            color: activeObject ? activeObject.fill : this.fillColor,
            // width: this.fillOpacity,
            // sliderMax: 1,
            // sliderText: 'Opacity',
            parent: this,
            title: 'Fill',
          })
          .onOk((data) => {
            // console.log(data.color)
            // const colRGB = this.hexToRgb(data.color)
            // const color = `rgba(${colRGB.r},${colRGB.g},${colRGB.b},${data.width})`
            // console.log(color)
            this.fillColor = data.color
            // this.fillOpacity = data.width
            var activeObject = this.canvas.getActiveObject()
            if (activeObject) {
              console.log(activeObject)
              activeObject.set('fill', data.color)
              // this.canvas.getActiveObject().set('opacity', data.width)
              this.canvas.renderAll()
            }
          })
      } else if (popup === 'text') {
        this.$q
          .dialog({
            component: this.$customDialog.PenStyles,
            canvas: this.canvas,
            color:
              activeObject && activeObject.text
                ? activeObject.fill
                : this.textColor,
            font: this.font,
            // width: this.fillOpacity,
            // sliderMax: 1,
            // sliderText: 'Opacity',
            parent: this,
            title: 'Text',
          })
          .onOk((data) => {
            // console.log(data.color)
            // const colRGB = this.hexToRgb(data.color)
            // const color = `rgba(${colRGB.r},${colRGB.g},${colRGB.b},${data.width})`
            // console.log(color)
            this.textColor = data.color
            this.font = data.font
            // this.fillOpacity = data.width
            // var activeObject = this.canvas.getActiveObject()
            if (activeObject && activeObject.text) {
              activeObject.set('fill', data.color)
              activeObject.set('fontFamily', data.font)
              // this.canvas.getActiveObject().set('opacity', data.width)
              this.canvas.renderAll()
            }
          })
      }
    },
    hexToRgb(hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b
      })
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      if (result) {
        return {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      } else {
        return null
      }
    },
    setMode(mode) {
      // for (var key in this.drawMode) {
      //   if (Object.prototype.hasOwnProperty.call(this.drawMode, key)) {
      //     this.drawMode[key] = false
      //   }
      // }
      this.clearPolyFix()
      this.polygonMode = false
      this.pointArray = []
      this.lineArray = []
      this.activeLine = {}
      this.drawMode = mode
      const curObj = this.canvas.getActiveObject()
      if (curObj && curObj.type === 'polygon' && curObj.edit) {
        this.editPolygon()
      }
      switch (mode) {
        case 'freeDraw':
          this.canvas.isDrawingMode = true
          this.$q
            .dialog({
              component: this.$customDialog.CustomForm,
              parent: this,
              fields: [
                {
                  type: 'header',
                  title: 'Brush type',
                },
                {
                  name: 'brushType',
                  value: this.brushType,
                  label: 'Brush type',
                  required: true,
                  type: 'select',
                  options: [
                    {
                      value: 'pencil',
                      label: 'Pencil',
                    },
                    // {
                    //   value: 'crayon',
                    //   label: 'Crayon'
                    // },
                    {
                      value: 'circle',
                      label: 'Circles',
                    },
                    // {
                    //   value: 'spray',
                    //   label: 'Spraypaint'
                    // },
                    {
                      value: 'pattern',
                      label: 'Pattern',
                    },
                    {
                      value: 'hline',
                      label: 'Horizontal lines',
                    },
                    {
                      value: 'vline',
                      label: 'Vertical lines',
                    },
                    {
                      value: 'square',
                      label: 'Squares',
                    },
                    {
                      value: 'diamond',
                      label: 'Diamonds',
                    },
                  ],
                },
              ],
            })
            .onOk((data) => {
              this.brushType = data.brushType
              this.setBrushType(data.brushType)
            })
            .onCancel(() => {
              // this.brushType = 'pencil'
              this.setBrushType(this.brushType)
              // this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
            })
            .onDismiss(() => {
              var brush = this.canvas.freeDrawingBrush
              brush.color = this.penColor
              if (brush.getPatternSrc) {
                brush.source = brush.getPatternSrc(brush)
              }
              brush.width = this.lineWidth
              brush.shadow = new fabric.Shadow({
                blur: this.shadowWidth,
                offsetX: this.shadowOffset.x,
                offsetY: this.shadowOffset.y,
                affectStroke: true,
                color: this.shadowColor,
              })
            })
          break
        case 'edit':
          this.canvas.isDrawingMode = false
          break
        case 'pan':
          this.canvas.isDrawingMode = false
          this.canvas.discardActiveObject()
          break
        case 'polygonDraw':
          this.canvas.isDrawingMode = false
          if (curObj && curObj.type === 'polygon') {
            this.editPolygon()
          } else {
            this.polygonMode = true
          }
          break
        default:
      }
    },
    clearPolyFix() {
      if (this.drawMode === 'polygonDraw') {
        this.drawMode = 'edit'
        this.canvas.isDrawingMode = false
      }
      if (this.activeShape) {
        this.pointArray.forEach((point) => {
          this.canvas.remove(point)
        })
        this.lineArray.forEach((line) => {
          this.canvas.remove(line)
        })
        this.canvas.remove(this.activeShape).remove(this.activeLine)
        this.activeLine = null
        this.activeShape = null
        this.polygonMode = false
      }
    },
    connectEcho() {
      // console.log('connecting...')
      // const auth = this.$axios.defaults.headers.common.Authorization
      // window.Echo = new Echo({
      //   broadcaster: 'socket.io',
      //   host: process.env.ECHO,
      //   namespace: '',
      //   auth: { headers: { Authorization: auth } }
      // })
      // window.Echo.connector.socket.on('connect', this.connected)
      // window.Echo.connector.socket.on('disconnect', this.connectionDown)
      // window.Echo.connector.socket.on('reconnecting', this.connectionDown)
      // window.Echo.connector.socket.on(
      //   'subscription_error',
      //   this.subscriptionError
      // )
      // window.Echo.channel('whiteboard').listen('add', e => {
      //   console.log(e.user, e.message)
      // })
      // window.Echo.private('whiteboard').listen('add', e => {
      //   console.log(e.user, e.message)
      // })
      // window.Echo.join('whiteboard')
      //   .here(members => {
      //     console.log('I am here!')
      //     console.log(members)
      //   })
      //   .listenForWhisper('hi', e => {
      //     console.log(e)
      //   })
      //   .listenForWhisper('add-item', e => {
      //     this.addObjects([e], true)
      //   })
      //   .listenForWhisper('edit-item', e => {
      //     this.editObject(e.item, e.index)
      //   })
      //   .listenForWhisper('delete-item', e => {
      //     this.canvas.remove(this.canvas.item(e.index))
      //     const json = this.canvas.toJSON()
      //     this.lastJSON = json
      //     this.$q.localStorage.set('savedWhiteboard', json)
      //   })
      //   .listenForWhisper('clear', () => {
      //     this.canvas.clear()
      //     this.$q.localStorage.remove('savedWhiteboard')
      //   })
      //   .joining((joiningMember, members) => {
      //     console.log(joiningMember, members)
      //   })
      //   .leaving((leavingMember, members) => {
      //     console.log(leavingMember, members)
      //   })
      // window.Echo.join('whiteboard').whisper('hi', 'data')
      // window.Echo.join(msg.channel).whisper(msg.event, msg.data)
    },
    connected(msg) {
      console.log('connected', msg)
      // .broadcast.emit
      // window.Echo.connector.socket.emit('add', 'whiteboard', { user: 'james', message: 'this is a message' })
    },
    connectionDown(msg) {
      console.log(msg)
    },
    subscriptionError(err, status) {
      console.log('error', err, status)
    },
    downloadFile(key) {
      this.$axios
        .get('/file/' + key)
        .then((response) => {
          // this.viewerLoader = false
          if (response.data === 'Problem retrieving file') {
            this.$GOcommon.popup({
              message:
                'We are sorry. We are currently unable to find the file, please contact <a href="mailto:james@quakefire.com" style="color: lightblue;">james@quakefire.com</a>.',
              html: true,
              title: 'File not found',
            })
            // this.downloadDisabled = true
            // this.fileNotFound = true
          } else {
            // this.tempFileName = response.data.title
            // this.tempHREF = 'data:application/octet-stream;base64,' + response.data.fileData
            // this.tempPDF = this.$GOcommon.base64toPDF(response.data.fileData)
            this.renderAvatar(response.data.fileData)
          }
        })
        .catch((err) => {
          this.$GOcommon.axiosError(err)
        })
    },
    keyHandler(msg) {
      // console.log(msg)
      if (msg.code === 'Delete' || msg.code === 'Backspace') {
        this.deleteItem()
      } else if (msg.code === 'KeyZ' && (msg.metaKey || msg.ctrlKey)) {
        if (msg.shiftKey) {
          this.undoRedo(1)
        } else {
          this.undoRedo(-1)
        }
      }
      // else if (msg.keyCode)
    },
    deleteItem() {
      this.canvas.getActiveObjects().forEach((obj) => {
        this.canvas.remove(obj)
      })
    },
    addText() {
      this.$q
        .dialog({
          // component: this.$customDialog.TextEditor,
          component: this.$customDialog.CustomForm,
          persistent: true,
          parent: this,
          fields: [
            { type: 'header', title: 'Add text' },
            {
              name: 'text',
              type: 'textarea',
              value: '',
              required: true,
            },
          ],
          // label: 'Add text',
          // title: 'Adding some text',
          Ok: 'Add',
          text: '',
        })
        .onOk((data) => {
          const textbox = new fabric.Textbox(data.text, {
            left: 50,
            top: 50,
            width: 150,
            fontSize: 20,
            fill: this.textColor,
            fontFamily: this.font,
          })
          this.setMode('edit')
          this.canvas.add(textbox).setActiveObject(textbox)
          // this.loadAndUseFont('Bangers')
        })
    },
    doClear() {
      this.setMode('edit')
      this.canvas.clear()
      this.sketchproperties = { width: 1000, height: 1000 }
      this.setBackground()
      this.clearHistory()
      this.canvas.requestRenderAll()
      // this.$q.localStorage.set('history-0', this.canvas.toJSON())
      const json = this.canvas.toJSON()
      this.$q.localStorage.set('history', json)
      this.historyStorage['history-0'] = json
    },
    clearCanvas() {
      // console.log(this.canvas.toJSON())
      this.$q
        .dialog({
          dark: true,
          title: 'Clear all?',
          html: true,
          message:
            "Are you sure you wish to clear everything?<br>This action <b>can't</b> be undone.",
          cancel: true,
          class: 'bg-primary',
        })
        .onOk(() => {
          this.doClear()
        })
      // .onCancel(() => {})
      // .onDismiss(() => {})
    },
    hideRejected() {
      var objects = this.canvas.getObjects()
      objects.forEach((o) => {
        if (o.mws) {
          if (o.mws.rejected) {
            this.canvas.remove(o)
          }
        }
      })
      this.rejectedRemoved = true
    },
    generateNewThumbnail() {
      this.loading = true
      var objects = this.canvas.getObjects()
      objects.forEach((o) => {
        if (o.mws) {
          if (o.mws.approved) {
            o.set('objectCaching', false)
            var gObjects = o.getObjects()
            gObjects[gObjects.length - 1].set('opacity', 0)
            // this.canvas.remove(gObjects[gObjects.length - 1])
            // gObjects[gObjects.length - 1].set('stroke', '#00000000')
            // gObjects[gObjects.length - 1].set('fill', '#00000000')
          } else {
            this.canvas.remove(o)
          }
        }
      })
      this.loading = false
    },
    saveCanvas() {
      // window.Echo.join('whiteboard').whisper('hi', 'data')
      if (this.type === 'approval') {
        this.loading = true
        this.generateNewThumbnail()
        this.postSave()
      } else {
        let testData = []
        if (this.isMaster) {
          testData = [
            {
              type: 'header',
              title: 'Save community canvas',
            },
            {
              name: 'title',
              value: this.title,
              label: 'Title',
              required: true,
              type: 'input',
            },
            {
              name: 'description',
              value: this.description,
              label: 'Description',
              required: true,
              type: 'textarea',
              maxlength: 10000,
            },
          ]
        } else {
          testData = [
            {
              type: 'header',
              title: 'Save sketch',
            },
            {
              name: 'title',
              value: this.title,
              label: 'Title',
              required: true,
              type: 'input',
            },
            {
              name: 'description',
              value: this.description,
              label: 'Description',
              required: true,
              type: 'textarea',
              maxlength: 10000,
            },
          ]
          // if (this.user.admin) {
          //   testData.push({
          //     name: 'master',
          //     text: 'Set as a community canvas?',
          //     value: this.isMaster,
          //     type: 'checkbox'
          //   })
          // }
        }
        this.$q
          .dialog({
            component: this.$customDialog.CustomForm,
            parent: this,
            fields: testData,
          })
          .onOk((data) => {
            this.postSave(data)
          })
      }
    },
    postSave(data) {
      console.log(this.sketchproperties)
      this.resetViewpoint()
      this.loading = true
      var vpt = this.canvas.viewportTransform
      this.resizeCanvas(this.sketchproperties)
      vpt[4] = this.canvas.getWidth() / 2 - this.sketchproperties.width / 2
      vpt[5] = this.canvas.getHeight() / 2 - this.sketchproperties.height / 2
      this.canvas.renderAll()
      this.canvas.setZoom(1)
      this.canvas.renderAll()
      this.thumbnail = this.canvas.toDataURL({
        format: 'jpeg',
        quality: 0.95,
        width: this.sketchproperties.width - 2,
        height: this.sketchproperties.height - 2,
        left: 1,
        top: 1,
      })
      this.resizeCanvas()
      var vpt2 = this.canvas.viewportTransform
      vpt2[4] = this.canvas.getWidth() / 2 - this.sketchproperties.width / 2
      vpt2[5] = this.canvas.getHeight() / 2 - this.sketchproperties.height / 2
      this.canvas.renderAll()
      // this.imgSrc = this.thumbnail
      var removed = []
      if (['edit', 'approval'].includes(this.type)) {
        var objects = this.canvas.getObjects()
        objects.forEach((o) => {
          if (o.mws) {
            this.canvas.remove(o)
            removed.push(o)
          }
        })
      }
      const json = this.canvas.toJSON()
      removed.forEach((o) => this.canvas.add(o))
      json.thumbnail = this.thumbnail
      // console.log(json)
      var headers = {}
      headers['Content-Type'] = 'application/json'
      var newMaster = false
      if (data) {
        headers.sketchTitle = data.title
        headers.sketchDescription = data.description
        if (data.master) {
          if (!this.isMaster) {
            newMaster = true
          }
        }
      } else {
        headers.sketchTitle = this.title
        headers.sketchDescription = this.description
      }
      // var formData = new FormData()
      // formData.append('file', file)
      // formData.append('uploadType', this.type)
      // if (this.entityType) {
      //   formData.append('entityType', this.entityType)
      // }
      // if (this.entityTypeId > -1) {
      //   formData.append('entityTypeId', this.entityTypeId)
      // }
      // return this.$axios.post(this.postAPI, formData, {
      //   headers: headers,
      //   onUploadProgress: progressEvent => {
      //     var percentCompleted = Math.min(
      //       Math.round((progressEvent.loaded * 1000) / progressEvent.total) /
      //         10,
      //       100
      //     )
      //     file.__uploaded = percentCompleted / 100
      //     file.__progressLabel = percentCompleted + '%'
      //     this.completed = percentCompleted
      //   }
      // })

      const masterPost = this.isMaster || newMaster ? 'master' : 'whiteboard'
      let toPost = ''
      if (this.isNew || newMaster) {
        toPost = `/${masterPost}/add`
      } else if (this.isMaster) {
        toPost = `/${masterPost}/${this.masterId}/edit`
      } else {
        toPost = `/${masterPost}/${this.sketchId}/edit`
      }
      this.$axios
        .post(toPost, json, { headers: headers })
        .then((response) => {
          this.loading = false
          if (response.data.status === 'Token is Expired') {
            this.saveErrorPopup(data.title)
          } else {
            this.savedPopup(
              data ? data.title : this.title,
              this.isMaster || newMaster
            )
          }
        })
        .catch((err) => this.$GOcommon.axiosError(err))
      // this.canvas.isDrawingMode = !this.canvas.isDrawingMode
    },
    downloadImage() {
      const testData = [
        {
          type: 'header',
          title: 'Download image',
        },
        {
          name: 'format',
          value: '',
          label: 'Please select file format',
          required: true,
          type: 'select',
          options: ['JPG', 'SVG'],
        },
      ]
      this.$q
        .dialog({
          component: this.$customDialog.CustomForm,
          parent: this,
          fields: testData,
        })
        .onOk((data) => {
          console.log(data)
          if (data.format === 'SVG') {
            this.downloadSVG()
          } else {
            this.downloadJPG()
          }
        })
    },
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
            'Ocp-Apim-Subscription-Key': '338eb3862aa24b2a8c5246625c5b8b76',
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
              .flat()
          ).sort((a, b) => a - b)
          this.$GOcommon.popup({
            title: 'numbers',
            message: numbers.join(', '),
          })
        })
    },
    getOCR() {
      let vpt = this.canvas.viewportTransform
      this.resizeCanvas(this.sketchproperties)
      vpt[4] = this.canvas.getWidth() / 2 - this.sketchproperties.width / 2
      vpt[5] = this.canvas.getHeight() / 2 - this.sketchproperties.height / 2
      this.canvas.renderAll()
      this.canvas.setZoom(1)
      this.canvas.renderAll()
      const jpgDownload = this.canvas.toDataURL({
        format: 'jpeg',
        quality: 1.0,
        width: this.sketchproperties.width - 2,
        height: this.sketchproperties.height - 2,
        left: 1,
        top: 1,
      })
      this.resizeCanvas()
      let vpt2 = this.canvas.viewportTransform
      vpt2[4] = this.canvas.getWidth() / 2 - this.sketchproperties.width / 2
      vpt2[5] = this.canvas.getHeight() / 2 - this.sketchproperties.height / 2
      this.canvas.renderAll()
      const jpgBlob = this.b64toBlob(jpgDownload)
      this.$axios
        .post(
          'https://escrut.cognitiveservices.azure.com/vision/v3.2/read/analyze',
          jpgBlob,
          {
            headers: {
              'Content-Type': 'application/octet-stream',
              'Ocp-Apim-Subscription-Key': '338eb3862aa24b2a8c5246625c5b8b76',
            },
          }
        )
        .then(({ headers }) => {
          setTimeout(() => {
            this.getReadResult(headers['operation-location'])
          }, 2000)
        })
        .catch(this.$GOcommon.axiosError)
    },
    downloadJPG() {
      var vpt = this.canvas.viewportTransform
      this.resizeCanvas(this.sketchproperties)
      vpt[4] = this.canvas.getWidth() / 2 - this.sketchproperties.width / 2
      vpt[5] = this.canvas.getHeight() / 2 - this.sketchproperties.height / 2
      this.canvas.renderAll()
      this.canvas.setZoom(1)
      this.canvas.renderAll()
      const jpgDownload = this.canvas.toDataURL({
        format: 'jpeg',
        quality: 1.0,
        width: this.sketchproperties.width - 2,
        height: this.sketchproperties.height - 2,
        left: 1,
        top: 1,
      })
      this.resizeCanvas()
      var vpt2 = this.canvas.viewportTransform
      vpt2[4] = this.canvas.getWidth() / 2 - this.sketchproperties.width / 2
      vpt2[5] = this.canvas.getHeight() / 2 - this.sketchproperties.height / 2
      this.canvas.renderAll()
      var jpgBlob = this.b64toBlob(jpgDownload)
      // this.$axios
      //   .post(
      //     'https://escrut.cognitiveservices.azure.com/vision/v3.2/read/analyze',
      //     jpgBlob,
      //     {
      //       headers: {
      //         'Content-Type': 'application/octet-stream',
      //         'Ocp-Apim-Subscription-Key': '338eb3862aa24b2a8c5246625c5b8b76',
      //       },
      //     }
      //   )
      //   .then((response) => {
      //     console.log(response)
      //   })
      //   .catch(this.$GOcommon.axiosError)
      // new Blob([jpgDownload], { type: 'image/jpg;charset=utf-8' })
      var jpgUrl = URL.createObjectURL(jpgBlob)
      var downloadLink = document.createElement('a')
      downloadLink.href = jpgUrl
      downloadLink.download = 'sketch.jpg'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    },
    downloadSVG() {
      var svgData = this.canvas.toSVG()
      // var svgData = $("#figureSvg")[0].outerHTML;
      var svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      var svgUrl = URL.createObjectURL(svgBlob)
      var downloadLink = document.createElement('a')
      downloadLink.href = svgUrl
      downloadLink.download = 'sketch.svg'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    },
    saveErrorPopup(title) {
      this.$q
        .dialog({
          dark: true,
          title: 'Whiteboard not saved',
          message: `Whiteboard ${title} has not been saved, as you have been logged out - please login again and upload the following SVG as an image on a new sketch. Tip: you may wish to click "ungroup" after loading the SVG back in.`,
          class: 'bg-primary',
        })
        .onDismiss(() => {
          this.downloadSVG()
          this.$router.push('login')
        })
    },
    savedPopup(title, master) {
      this.$q
        .dialog({
          dark: true,
          title: this.isMaster ? 'Community canvas saved' : 'Whiteboard saved',
          message: this.isMaster
            ? `Community canvas ${title} has been saved`
            : `Whiteboard ${title} has been saved`,
          class: 'bg-primary',
        })
        .onDismiss(() => {
          this.doClear()
          if (master) {
            this.$router.push('/community')
          } else {
            this.$router.push('/submitted')
          }
        })
    },
    editObject(objectIn, indexIn) {
      //           this.canvas.insertAt(e.item, e.index, true)
      fabric.util.enlivenObjects([objectIn], (objects) => {
        const origRenderOnAddRemove = this.canvas.renderOnAddRemove
        this.canvas.renderOnAddRemove = false
        objects.forEach((o) => {
          this.canvas.remove(this.canvas.item(indexIn))
          this.canvas.insertAt(o, indexIn, false)
        })
        this.canvas.renderOnAddRemove = origRenderOnAddRemove
        this.canvas.renderAll()
      })
      const json = this.canvas.toJSON()
      this.lastJSON = json
      this.$q.localStorage.set('savedWhiteboard', json)
    },
    addObjects(objectsIn, whisper) {
      if (whisper) {
        this.incomingWhisper = true
      }
      fabric.util.enlivenObjects(objectsIn, (objects) => {
        const origRenderOnAddRemove = this.canvas.renderOnAddRemove
        this.canvas.renderOnAddRemove = false
        objects.forEach((o) => {
          this.canvas.add(o)
        })
        this.canvas.renderOnAddRemove = origRenderOnAddRemove
        this.canvas.renderAll()
      })
      const json = this.canvas.toJSON()
      this.lastJSON = json
      this.$q.localStorage.set('savedWhiteboard', json)
      if (whisper) {
        this.incomingWhisper = false
      }
    },
    handleMouseUp() {
      const json = this.canvas.toJSON()
      // const canvasObjects = this.canvas.toObject().objects
      if (this.canvas.isDrawingMode) {
        // const newObject = canvasObjects[canvasObjects.length - 1]
        // window.Echo.join('whiteboard').whisper('add-item', newObject)
        // this.addObjects([newObject])
        // fabric.Group.fromObject(canvasObjects[canvasObjects.length - 1], (obj) => {
        //  this.canvas.add(obj) // <- like this
        //  console.log('newGroup', obj)
        //  this.canvas.setActiveObject(obj).renderAll()
        // })
        // console.log(json.objects[json.objects.length - 1])
      } else {
        const newObject = this.$_.differenceWith(
          json.objects,
          this.lastJSON.objects,
          this.$_.isEqual
        )[0]
        const editIndex = this.$_.findIndex(json.objects, (o) => {
          return o === newObject
        })
        if (editIndex > -1) {
          window.Echo.join('whiteboard').whisper('edit-item', {
            index: editIndex,
            item: newObject,
          })
        }
      }
      this.lastJSON = json
      this.$q.localStorage.set('savedWhiteboard', json)
    },
    resizeCanvas(arg) {
      if (arg && arg.height) {
        this.canvas.setHeight(arg.height)
        this.canvas.setWidth(arg.width)
        this.canvas.renderAll()
      } else {
        this.canvas.setHeight(window.innerHeight - this.headerSize.height)
        this.canvas.setWidth(window.innerWidth - 58)
        this.canvas.renderAll()
      }
      // this.$d3
      //   .selectAll('#avatarSlot')
      //   // .attr('class', 'user-avatar')
      //   .attr('width', window.innerWidth)
      //   .attr('height', window.innerHeight - 400)
    },
    renderAvatar(avatarBase64) {
      var avatar = ''
      if (avatarBase64) {
        avatar = 'data:image/png;base64,' + avatarBase64
        this.blankAvatar = false
      } else {
        avatar = 'data:image/png;base64,' + this.blankAvatarData
      }
      this.$d3
        .selectAll('#avatarSlot')
        // .attr('class', 'user-avatar')
        .attr('src', avatar)
    },
    defineCanvasSize() {
      const testData = [
        {
          type: 'header',
          title: 'Resize canvas',
        },
        {
          name: 'width',
          value: this.sketchproperties.width,
          label: 'Width',
          required: true,
          type: 'input',
          validation: { content: 'numeric' },
        },
        {
          name: 'height',
          value: this.sketchproperties.height,
          label: 'Height',
          required: true,
          type: 'input',
          validation: { content: 'numeric' },
        },
      ]
      this.$q
        .dialog({
          component: this.$customDialog.CustomForm,
          parent: this,
          fields: testData,
        })
        .onOk((data) => {
          this.sketchproperties = {
            width: parseInt(data.width),
            height: parseInt(data.height),
          }
          this.setBackground()
        })
    },
    zoom(delta) {
      var zoom = this.canvas.getZoom()
      zoom *= delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.01) zoom = 0.01
      this.canvas.setZoom(zoom)
      // var vpt = this.canvas.viewportTransform
      // vpt[4] = this.canvas.getWidth() / 2 - 500 * zoom
      // vpt[5] = this.canvas.getHeight() / 2 - 500 * zoom
      // this.canvas.requestRenderAll()
    },
    storeHistory(event, mode) {
      // console.log(this.undoOrRedoEvent)
      // console.log(event.target)
      if (!this.undoOrRedoEvent && this.drawMode !== 'polygonDraw') {
        this.history = this.history + 1
        const json = this.canvas.toJSON()
        // const newObject = this.$_.differenceWith(
        //   json.objects,
        //   this.lastJSON.objects,
        //   this.$_.isEqual
        // )[0]
        // console.log(newObject)
        // this.$q.localStorage.set(`history-${this.history}`, json)
        this.historyStorage[`history-${this.history}`] = json
        this.disableRedo = true
        this.maxHistory = this.history
        this.canvas.renderAll()
        this.lastJSON = this.json
        if (['edit', ''].includes(this.type)) {
          this.$q.localStorage.set('history', json)
        }
        // this.canvas.requestRenderAll()
        // console.log(
        //   this.$q.localStorage.getAllKeys().filter(o => {
        //     return (
        //       o.slice(0, 7) === 'history'
        //     )
        //   }).map(w => { return parseInt(w.slice(8)) })
        // )
        // const storedHistory = this.$q.localStorage.getAllKeys().filter(o => {
        const storedHistory = Object.keys(this.historyStorage).filter((o) => {
          return (
            o.slice(0, 7) === 'history' &&
            parseInt(o.slice(8)) > parseInt(this.history)
          )
        })
        storedHistory.forEach((o) => {
          delete this.historyStorage[o]
          // this.$q.localStorage.remove(o)
        })
      }
      if (mode === 'object:added' && this.drawMode !== 'polygonDraw') {
        const canvasObjects = this.canvas.toObject().objects
        const newObject = canvasObjects[canvasObjects.length - 1]
        console.log(newObject)
        if (!this.incomingWhisper) {
          // window.Echo.join('whiteboard').whisper('add-item', newObject)
        }
      }
    },
    undoRedo(dir) {
      console.log(dir, this.undoOrRedoEvent)
      this.undoOrRedoEvent = true
      const tempKey = `history-${this.history + dir}`
      console.log(tempKey, Object.keys(this.historyStorage))
      // if (this.$q.localStorage.has(tempKey)) {
      if (Object.keys(this.historyStorage).includes(tempKey)) {
        const tempJSON = this.historyStorage[tempKey]
        this.canvas.loadFromJSON(tempJSON, () => {
          this.undoOrRedoEvent = false
        })
        this.history = this.history + dir
        if (this.history < 0) {
          this.history = 0
        }
      }
    },
    setBackground() {
      // console.log('setting background')
      var bg = new fabric.Rect({
        width: this.sketchproperties.width,
        height: this.sketchproperties.height,
        stroke: '',
        // strokeWidth: 10,
        fill: this.backgroundColor,
        evented: false,
        selectable: false,
      })
      // bg.canvas = this.canvas
      this.canvas.setBackgroundImage(
        bg,
        this.canvas.renderAll.bind(this.canvas)
      )
      bg.dirty = true
      var vpt = this.canvas.viewportTransform
      vpt[4] = this.canvas.getWidth() / 2 - this.sketchproperties.width / 2
      vpt[5] = this.canvas.getHeight() / 2 - this.sketchproperties.height / 2
      this.canvas.requestRenderAll()
    },
    configureCanvas() {
      if (parseInt(this.sketchId) === 0 && !this.isMaster) {
        this.pageTitle = 'New whiteboard'
      } else if (parseInt(this.sketchId) === 0) {
        this.pageTitle = 'Editing community canvas'
      } else if (!this.isMaster) {
        this.pageTitle = 'Editing whiteboard'
      } else {
        this.pageTitle = 'Placing whiteboard'
      }
      const ref = this.$refs.can
      var that
      that = this
      this.canvas = new fabric.Canvas(ref, {
        isDrawingMode: this.isDrawingMode,
      })
      window.addEventListener('resize', this.resizeCanvas, false)
      this.resizeCanvas()
      this.setBackground()
      this.canvas.freeDrawingBrush.color = this.penColor
      this.canvas.freeDrawingBrush.width = parseInt(this.lineWidth, 10) || 1
      this.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: parseInt(this.shadowWidth, 10) || 0,
        offsetX: this.shadowOffset.x,
        offsetY: this.shadowOffset.y,
        affectStroke: true,
        color: this.shadowColor,
      })
      this.canvas.on({
        'touch:gesture': function (e) {
          if (e.e.touches && e.e.touches.length === 2) {
            that.pausePanning = true
            const dMode = that.drawMode
            that.drawMode = 'pinch'
            var point = new fabric.Point(e.self.x, e.self.y)
            if (e.self.state === 'start') {
              var zoomStartScale = self.canvas.getZoom()
            }
            var delta = zoomStartScale * e.self.scale
            self.canvas.zoomToPoint(point, delta)
            that.pausePanning = false
            that.drawMode = dMode
          }
        },
        'object:selected': function () {
          that.pausePanning = true
        },
        'selection:cleared': function () {
          that.pausePanning = false
        },
        'touch:drag': function (e) {
          if (
            that.pausePanning === false &&
            undefined !== e.e.layerX &&
            undefined !== e.e.layerY
          ) {
            that.currentX = e.e.layerX
            that.currentY = e.e.layerY
            var xChange = that.currentX - that.lastX
            var yChange = that.currentY - that.lastY

            if (
              Math.abs(that.currentX - that.lastX) <= 50 &&
              Math.abs(that.currentY - that.lastY) <= 50
            ) {
              var delta = new fabric.Point(xChange, yChange)
              that.canvas.relativePan(delta)
            }

            that.lastX = e.e.layerX
            that.lastY = e.e.layerY
          }
        },
      })
      this.canvas.on('mouse:down', function (opt) {
        var evt = opt.e
        if (evt.altKey === true || that.drawMode === 'pan') {
          this.isDrawingMode = false
          that.isDrawingMode = false
          this.isDragging = true
          this.selection = false
          that.canvas.discardActiveObject()
          this.lastPosX = evt.clientX
          this.lastPosY = evt.clientY
        } else if (that.polygonMode) {
          if (
            opt.target &&
            that.pointArray &&
            that.pointArray[0] &&
            that.pointArray[0].id &&
            opt.target.id === that.pointArray[0].id
          ) {
            that.generatePolygon(that.pointArray)
          } else {
            that.addPolyPoint(opt)
          }
        }
      })
      this.canvas.on('mouse:move', function (opt) {
        if (this.isDragging) {
          // if (this.lastPosX)
          var e = opt.e
          // var vpt = this.viewportTransform
          // console.log(that.lastX, that.lastY)
          // if (that.lastX > 0) {
          //   // vpt[4] += e.clientX - this.lastPosX
          //   // vpt[5] += e.clientY - this.lastPosY
          //   vpt[4] += e.clientX - that.lastX
          //   vpt[5] += e.clientY - that.lastY
          //   this.requestRenderAll()
          // }
          // that.lastX = e.clientX
          // that.lastY = e.clientY
          that.currentX = e.layerX
          that.currentY = e.layerY
          var xChange = that.currentX - that.lastX
          var yChange = that.currentY - that.lastY

          if (
            Math.abs(that.currentX - that.lastX) <= 50 &&
            Math.abs(that.currentY - that.lastY) <= 50
          ) {
            var delta = new fabric.Point(xChange, yChange)
            that.canvas.relativePan(delta)
          }

          that.lastX = e.layerX
          that.lastY = e.layerY

          // this.lastPosX = e.clientX
          // this.lastPosY = e.clientY
        } else if (that.activeLine && that.activeLine.class === 'line') {
          var pointer = this.getPointer(opt.e)
          that.activeLine.set({ x2: pointer.x, y2: pointer.y })

          var points = that.activeShape.get('points')
          points[that.pointArray.length] = {
            x: pointer.x,
            y: pointer.y,
          }
          that.activeShape.set({
            points: points,
          })
          this.renderAll()
        }
      })
      this.canvas.on('mouse:up', function () {
        this.setViewportTransform(this.viewportTransform)
        this.isDragging = false
        this.selection = true
      })
      this.canvas.on('mouse:wheel', function (opt) {
        var delta = opt.e.deltaY
        var zoom = this.getZoom()
        zoom *= 0.999 ** delta
        if (zoom > 20) zoom = 20
        if (zoom < 0.01) zoom = 0.01
        this.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
        opt.e.preventDefault()
        opt.e.stopPropagation()
      })
      this.canvas.on('object:added', (opt) =>
        this.storeHistory(opt, 'object:added')
      )
      this.canvas.on('object:modified', (opt) =>
        this.storeHistory(opt, 'object:modified')
      )
      this.canvas.on('object:removed', (opt) =>
        this.storeHistory(opt, 'object:removed')
      )
      // this.canvas.on('path:created', (opt) => this.storeHistory(opt, 'path:created'))
      this.canvas.on('text:changed', (opt) =>
        this.storeHistory(opt, 'text:changed')
      )
      this.canvas.requestRenderAll()
      if (this.isMaster) {
        this.loadMaster(this.$route.params.masterId)
      } else if (parseInt(this.$route.params.sketchId) > 0) {
        this.loadSketch(this.$route.params.sketchId)
      } else {
        // const storedHistory = this.$q.localStorage.getAllKeys().filter(o => {
        //   return o.slice(0, 7) === 'history'
        // })
        if (this.$q.localStorage.has('history')) {
          const tempJSON = this.$q.localStorage.getItem('history')
          this.historyStorage['history-0'] = tempJSON
          // const historyNumbers = storedHistory.map(o => {
          //   return parseInt(o.slice(8))
          // })
          // this.history = this.$_.max(historyNumbers)
          // this.maxHistory = this.history
          // const tempJSON = this.$q.localStorage.getItem(
          //   `history-${this.history}`
          // )
          // const tempJSON = this.$q.localStorage.getItem(
          //   `history-${this.history}`
          // )
          this.undoOrRedoEvent = true
          this.canvas.loadFromJSON(tempJSON, () => {
            this.undoOrRedoEvent = false
            // this.canvas.renderAll()
            this.resetViewpoint()
            this.loading = false
          })
        } else {
          const json = this.canvas.toJSON()
          if (['edit', ''].includes(this.type)) {
            this.$q.localStorage.set('history', json)
          }
          this.historyStorage['history-0'] = json
          this.loading = false
          this.resetViewpoint()
        }
      }
      var canvasWrapper = document.getElementById('canvasWrap')
      canvasWrapper.tabIndex = 1000
      canvasWrapper.addEventListener('keydown', this.keyHandler, false)
      // fabric.Image.fromURL(this.$TxN.blankAvatar(), (oImg) => {
      //   this.canvas.add(oImg)
      // })
      // this.loadSketch(1)
      // this.canvas.on('mouse:up', this.handleMouseUp)
      // if (this.$q.localStorage.has('savedWhiteboard')) {
      //   this.lastJSON = this.$q.localStorage.getItem('savedWhiteboard')
      //   this.canvas.loadFromJSON(this.lastJSON)
      // }
      // this.user = this.$q.sessionStorage.getItem('user-details')
    },
    resetViewpoint() {
      this.canvas.setZoom(1)
      console.log(this.canvas)
      this.sketchproperties = {
        width: this.canvas.backgroundImage.width,
        height: this.canvas.backgroundImage.height,
      }
      var vpt = this.canvas.viewportTransform
      vpt[4] = this.canvas.getWidth() / 2 - this.sketchproperties.width / 2
      vpt[5] = this.canvas.getHeight() / 2 - this.sketchproperties.height / 2
      this.canvas.requestRenderAll()
    },
    loadSketch(id) {
      this.$axios
        .get(`/whiteboard/${id}`)
        .then((response) => {
          console.log(response.data)
          this.isNew = false
          this.title = response.data.title
          this.pageTitle = `Editing ${this.title}`
          this.description = response.data.description
          this.undoOrRedoEvent = true
          this.canvas.loadFromJSON(response.data.sketch, () => {
            this.undoOrRedoEvent = false
            this.resetViewpoint()
            this.loading = false
          })
          this.$q.localStorage.set('history', response.data.sketch)
          this.historyStorage['history-0'] = response.data.sketch
        })
        .catch((err) => {
          this.$GOcommon.axiosError(err)
        })
    },
    approveSketch() {
      var activeObject = this.canvas.getActiveObject()
      if (activeObject) {
        const location = {
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          top: activeObject.top,
          width: activeObject.width,
          left: activeObject.left,
          height: activeObject.height,
          angle: activeObject.angle,
          zIndex: this.canvas.getObjects().indexOf(activeObject),
        }
        this.$q
          .dialog({
            dark: true,
            title: 'Approve placement?',
            html: true,
            message: `Are you sure you wish to accept the placement of this sketch?<br><strong>User comment: </strong>${activeObject.mws.comment}`,
            cancel: true,
            class: 'bg-primary',
          })
          .onOk(() => {
            this.$axios
              .post(`/mws/${activeObject.mws.mwsId}/approve`, {
                location: location,
              })
              .then(() => {
                var toSet = activeObject.mws
                toSet.approved = true
                activeObject.set('mws', toSet)
                var gObjects = activeObject.getObjects()
                gObjects[gObjects.length - 1].set('stroke', 'green')
                gObjects[gObjects.length - 1].set('fill', '#00FF0033')
                this.canvas.renderAll()
                // this.canvas.generateNewThumbnail()
              })
              .catch((err) => this.$GOcommon.axiosError(err))
          })
      } else {
        this.$q.dialog({
          dark: true,
          title: 'Sketch not selected',
          message:
            'Please select the sketch to approve before clicking approve.',
          class: 'bg-primary',
        })
      }
    },
    rejectSketch() {
      var activeObject = this.canvas.getActiveObject()
      if (activeObject) {
        const location = {
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          top: activeObject.top,
          width: activeObject.width,
          left: activeObject.left,
          height: activeObject.height,
          angle: activeObject.angle,
          zIndex: this.canvas.getObjects().indexOf(activeObject),
        }
        this.$q
          .dialog({
            dark: true,
            title: 'Reject placement?',
            html: true,
            message: `Are you sure you wish to reject the placement of this sketch?<br><strong>User comment: </strong>${activeObject.mws.comment}`,
            cancel: true,
            class: 'bg-primary',
          })
          .onOk(() => {
            this.$axios
              .post(`/mws/${activeObject.mws.mwsId}/reject`, {
                location: location,
              })
              .then(() => {
                var gObjects = activeObject.getObjects()
                gObjects[gObjects.length - 1].set('stroke', 'red')
                gObjects[gObjects.length - 1].set('fill', '#FF000033')
                this.canvas.renderAll()
              })
              .catch((err) => this.$GOcommon.axiosError(err))
          })
      } else {
        this.$q.dialog({
          dark: true,
          title: 'Sketch not selected',
          message: 'Please select the sketch to reject before clicking reject.',
          class: 'bg-primary',
        })
      }
    },
    addSketches() {
      // console.log(this.sketches)
      return new Promise((resolve, reject) => {
        Promise.all(
          this.sketches.map((o) => {
            return this.addSketch(o.sketch.id, o)
          })
        )
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    addSketch(id, mws) {
      return new Promise((resolve, reject) => {
        var location = {}
        if (mws) {
          if (mws.location && mws.location.scaleX) {
            location = mws.location
          } else {
            location = JSON.parse(mws.location)
          }
        }
        this.$axios
          .get(`/whiteboard/${id}`)
          .then((response) => {
            this.undoOrRedoEvent = true
            if (mws) {
              // var rect = new fabric.Rect(response.data.sketch.backgroundImage)
              fabric.util.enlivenObjects(
                response.data.sketch.objects,
                (objects) => {
                  // var obj = fabric.util.groupSVGElements(objects, options)
                  let stroke = 'orange'
                  let fill = '#FFFF0033'
                  if (mws.approved) {
                    stroke = 'green'
                    fill = '#00FF0033'
                  }
                  if (mws.rejected) {
                    stroke = 'red'
                    fill = '#FF000033'
                  }
                  var group = new fabric.Group(objects, location)
                  group.mws = mws
                  if (this.type === 'approval') {
                    // console.log(location)
                    // var rect = new fabric.Rect({
                    //   fill: '#FFFF0033',
                    //   // right: location.right,
                    //   width: location.width,
                    //   height: location.height,
                    //   stroke: stroke,
                    //   strokeWidth: 20,
                    //   strokeDashArray: [50, 50]
                    // })
                    // objects.push(rect)
                    // group.lockMovementX = true
                    // group.lockMovementY = true
                    // group.lockRotation = true
                    // group.lockScalingX = true
                    // group.lockScalingY = true
                    group.set({
                      transparentCorners: false,
                      cornerColor: 'blue',
                      cornerStrokeColor: 'red',
                      borderColor: 'red',
                      cornerSize: 12,
                      padding: 10,
                      cornerStyle: 'circle',
                      borderDashArray: [3, 3],
                    })
                    var rect = new fabric.Rect({
                      fill: fill,
                      // right: location.right,
                      left: -group.width / 2 - 15,
                      top: -group.height / 2 - 15,
                      width: group.width + 30,
                      height: group.height + 30,
                      stroke: stroke,
                      strokeWidth: 5,
                      strokeDashArray: [50, 50],
                    })
                    group.add(rect)
                    this.canvas.add(group)
                    this.canvas.moveTo(group, location.zIndex)
                    this.undoOrRedoEvent = false
                  } else {
                    group.set('selectable', false)
                    if (mws.approved) {
                      this.canvas.add(group)
                      this.canvas.moveTo(group, location.zIndex)
                      this.undoOrRedoEvent = false
                    }
                  }
                  // group.set('clipPath', rect)
                  // group.clipPath = rect
                }
              )
            } else {
              this.sketchTitle = response.data.title
              fabric.util.enlivenObjects(
                response.data.sketch.objects,
                (objects) => {
                  // var obj = fabric.util.groupSVGElements(objects, options)
                  var group = new fabric.Group(objects, {
                    left: 150,
                    top: 100,
                    // scaleX: 0.4790232143792908,
                    // scaleY: 0.4790232143792908,
                    // top: 563.0853975722116,
                    // width: 479.0899999999999,
                    // left: 236.31231153894282,
                    // height: 475.0600000000002,
                    // angle: 26.682177624939506
                  })
                  // group.clipPath = rect
                  this.canvas.add(group)
                  this.undoOrRedoEvent = false
                }
              )
            }
            resolve()
          })
          .catch((err) => {
            this.$GOcommon.axiosError(err)
            reject()
          })
      })
    },
    loadMaster(id) {
      this.$axios
        .get(`/master/${id}`)
        .then((response) => {
          this.isNew = false
          this.title = response.data.master.title
          this.description = response.data.master.description
          if (this.type === 'edit') {
            this.pageTitle = `Editing community canvas: ${this.title}`
            this.undoOrRedoEvent = true
            this.canvas.loadFromJSON(response.data.master.sketch, () => {
              this.undoOrRedoEvent = false
              this.resetViewpoint()
            })
            this.$q.localStorage.set('history', response.data.master.sketch)
            this.historyStorage['history-0'] = response.data.master.sketch
          } else {
            this.pageTitle = `Community canvas: ${this.title}`
            this.canvas.loadFromJSON(
              response.data.master.sketch,
              this.canvas.renderAll.bind(this.canvas),
              function (o, object) {
                object.set('selectable', false)
              }
            )
            this.resetViewpoint()
          }
          if (response.data.sketches.length > 0) {
            this.sketches = response.data.sketches
            this.addSketches().then(() => {
              if (parseInt(this.sketchId) > 0) {
                this.addSketch(this.sketchId).then(() => {
                  this.loading = false
                })
              } else {
                this.loading = false
              }
            })
          } else if (parseInt(this.sketchId) > 0) {
            this.addSketch(this.sketchId).then(() => {
              this.loading = false
            })
          } else {
            this.loading = false
          }
        })
        .catch((err) => {
          this.$GOcommon.axiosError(err)
        })
    },
    placeSketch() {
      var activeObject = this.canvas.getActiveObject()
      if (activeObject) {
        const location = {
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          top: activeObject.top,
          width: activeObject.width,
          left: activeObject.left,
          height: activeObject.height,
          angle: activeObject.angle,
          zIndex: this.canvas.getObjects().indexOf(activeObject),
        }
        const testData = [
          {
            type: 'header',
            title: 'Place sketch',
          },
          {
            tyoe: 'p',
            text: `Do you wish to place ${this.sketchTitle} at this location and submit it for consideration?`,
          },
          {
            name: 'comment',
            value: '',
            label: 'Comment',
            required: true,
            type: 'input',
          },
        ]
        this.$q
          .dialog({
            component: this.$customDialog.CustomForm,
            parent: this,
            fields: testData,
          })
          .onOk((data) => {
            this.$axios
              .post(
                `/master/${this.masterId}/sketch/${this.sketchId}`,
                location,
                // { location: location, approved: false },
                { headers: { comment: data.comment } }
              )
              .then((response) => {
                console.log(response)
                this.$router.push('/submitted')
              })
              .catch((err) => {
                this.$GOcommon.axiosError(err)
              })
          })
        console.log(activeObject)
        console.log(location)
      } else {
        this.$q.dialog({
          dark: true,
          title: 'Sketch not selected',
          message: 'Please select the sketch to submit before clicking add.',
          class: 'bg-primary',
        })
      }
    },
    clearHistory() {
      this.history = 0
      this.maxHistory = 0
      this.historyStorage = {}
      if (this.$q.localStorage.has('history')) {
        this.$q.localStorage.remove('history')
      }
      // if (this.$q.localStorage.has('history'))
      // const storedHistory = this.$q.localStorage.getAllKeys().filter(o => {
      //   return o.slice(0, 7) === 'history'
      // })
      // storedHistory.forEach(o => {
      //   this.$q.localStorage.remove(o)
      // })
    },
  },
}
</script>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Dancing+Script:wght@562&display=swap'); */
@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Amatic+SC:wght@700&family=Amiri:ital@1&family=Anton&family=Bebas+Neue&family=Dancing+Script:wght@600&family=Indie+Flower&family=Josefin+Sans:wght@500&family=Lobster&family=Open+Sans+Condensed:wght@300&family=Playfair+Display&family=Roboto+Condensed&family=Source+Code+Pro&display=swap');
</style>

<style lang="scss">
.img-container {
  position: relative;
  overflow: hidden;
  height: 100%;
  padding: 0;
  // display: block;
  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
}
.img-primary {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}
.img-blur {
  -webkit-filter: blur(2px);
  filter: blur(20px);
  position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // background-position: 50%;
  // background-repeat: no-repeat;
  // background-size: cover;
  // height: unset;
  // max-width: unset;
  overflow: hidden;
  // margin: -45px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
