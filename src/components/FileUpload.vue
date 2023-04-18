<template>
  <q-card bordered flat class="text-primary bg-cream q-mx-sm">
    <q-uploader
      flat
      dense
      with-credentials
      :multiple="multiple"
      method="post"
      :accept="toAccept"
      color="primary"
      :max-total-size="$common.fromHumanReadable(maxTotalFileSize)"
      :max-file-size="$common.fromHumanReadable(maxFileSize)"
      style="min-height: 3rem; min-width: 500px; width: 93vw; max-width: 1390px;"
      class="bg-white text-black q-page-container"
      @rejected="onRejected"
    >
      <template #header="scope">
        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
          <div class="col">
            <div class="q-uploader__title">{{ title }}</div>
            <div class="q-uploader__subtitle">
              {{ scope.files.length }} file{{
                scope.files.length > 1 ? 's' : ''
              }}: {{ scope.uploadSizeLabel }} /
              {{ maxTotalFileSize.toUpperCase() }}
            </div>
          </div>
        </div>
        <div
          class="row no-wrap items-center justify-center q-pa-sm q-gutter-xs"
        >
          <q-btn
            v-if="scope.canAddFiles"
            type="a"
            dense
            icon="add_box"
            :label="$q.screen.lt.sm ? '' : 'Add'"
            color="yellow"
            flat
            class="q-pl-sm q-pr-sm"
          >
            <q-uploader-add-trigger />
            <q-tooltip>Pick Files</q-tooltip>
          </q-btn>
          <q-btn
            v-if="scope.queuedFiles.length > 0"
            icon="clear"
            dense
            :label="$q.screen.lt.sm ? '' : 'Clear'"
            color="red"
            flat
            class="q-pl-sm q-pr-sm"
            @click="scope.removeQueuedFiles"
          >
            <q-tooltip>Clear All</q-tooltip>
          </q-btn>
          <q-btn
            v-if="scope.canUpload"
            icon="cloud_upload"
            dense
            :label="$q.screen.lt.sm ? '' : 'Upload'"
            color="green"
            flat
            class="q-pl-sm q-pr-sm"
            @click="postFiles(scope.files)"
          >
            <q-tooltip>Upload Files</q-tooltip>
          </q-btn>
        </div>
      </template>
      <template #list="scope">
        <q-inner-loading :showing="isUploading">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
        <q-list separator>
          <q-item v-for="file in scope.files" :key="file.name">
            <q-linear-progress
              :stripe="file.__status !== 'Uploaded'"
              class="absolute-full full-height"
              :value="file.__uploaded"
              :label="file.__progressLabel"
              color="green-2"
              track-color="grey-2"
            />
            <q-item-section
              v-if="file.__status === 'Uploaded'"
              avatar
              class="gt-xs"
            >
              <q-icon name="done" />
            </q-item-section>
            <q-item-section style="z-index: 666;">
              <q-item-label class="full-width ellipsis">
                {{ file.name }}
              </q-item-label>

              <q-item-label caption> Status: {{ file.__status }} </q-item-label>
              <q-item-label caption :data-completed="completed">
                {{ file.__sizeLabel }} / {{ file.__progressLabel }}
              </q-item-label>
            </q-item-section>

            <q-item-section
              v-if="file.__img"
              thumbnail
              style="width: 100px; z-index: 665;"
              class="gt-xs"
            >
              <img :src="file.__img.src" />
            </q-item-section>

            <q-item-section top side>
              <q-btn
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="
                  () => {
                    scope.removeFile(file)
                    $emit('delete', file)
                  }
                "
              />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-uploader>
  </q-card>
</template>
<script>
import { defineComponent } from 'vue'

const acceptable = [
  '.mp3',
  '.mp4',
  '.wav',
  '.aac',
  '.mp2',
  '.wmv'
]

export default defineComponent({
  name: 'FileUploader',
  components: {},
  props: {
    title: { type: String, required: true },
    type: { type: String, required: true },
    maxTotalFileSize: { type: String, default: '1Gb' },
    maxFileSize: { type: String, default: '100Mb' },
    headers: {
      type: Object,
      default: function() {
        return {}
      }
    },
    params: {
      type: Object,
      default: function() {
        return {}
      }
    },
    entityType: { type: String, default: '' },
    entityTypeId: { type: Number, default: -1 },
    postAPI: { type: String, default: '/file/upload' },
    accept: {
      type: Array,
      default: function() {
        return acceptable
      }
    },
    multiple: { type: Boolean, default: false },
    persistent: {
      type: Boolean,
      default: false
    }
  },
emits: ['uploaded', 'delete'],
  data() {
    return {
      isUploading: false,
      completed: 0
    }
  },
  computed: {
    toAccept() {
      return this.accept.join(',')
    },
    uploadStatus() {
      if (this.isUploading) {
        return 'Uploading...'
      } else {
        return 'Ready'
      }
    }
  },
  created() {
    console.log('creation')
  },
  methods: {
    // REQUIRED METHODS
    show() {
      // this.$refs.dialog.show()
    },
    hide() {
      // this.$refs.dialog.hide()
    },
    onDialogHide() {
      // this.$emit('hide')
    },
    onOKClick(payload) {
      // this.$emit('ok', payload)
      this.$emit('uploaded', payload)
      // .onOk(response => {
      //   response.files.forEach(o => {
      //     this.model[o.id] = { locked: o.locked, visible: o.visible }
      //   })
      //   this.$emit('uploaded', response)
      // })
      // this.hide()
    },
    onCancelClick() {
      // this.hide()
    },
    // JAMES CUSTOM CODE
    //     {
    //   uploadedAt: {
    //     date: '2020-07-24 10:31:30.000000',
    //     timezone_type: 3,
    //     timezone: 'UTC'
    //   },
    //   locked: false,
    //   visible: false
    // }
    calculateExtension(fileName) {
      const extArr = fileName.split('.')
      return extArr[extArr.length - 1]
    },
    calculateFileType(arg) {
      const type = arg.split('/')
      if (type.length > 0) {
        if (type[0] === 'image') {
          return 'image'
        } else {
          return 'doc'
        }
      } else {
        return 'doc'
      }
    },
    postFiles(files) {
      this.isUploading = true
      const toPost = files.filter(o => {
        return o.__status != 'Uploaded'
      })
      Promise.all(toPost.map(this.submitFile))
        .then(responses => {
          var filesReturn = responses.map((o, i) => {
            if (o) {
              files[i].__status = 'Uploaded'
              files[i].id = o.data
              return {
                id: o.data,
                name: files[i].name,
                extension: this.calculateExtension(files[i].name),
                fileType: this.calculateFileType(files[i].type),
                uploadedAt: {
                  date: this.$moment(Date.now()).format('YYYY-MM-DD HH:MM')
                },
                locked: false,
                visible: false,
                contentType: this.type
              }
            } else {
              files[i].__status = 'Error'
              files[i].__uploadColor = 'red-2'
              return 'error'
            }
          })
          filesReturn = filesReturn.filter(o => {
            return o !== 'error'
          })
          const payload = {
            message: 'success',
            data: responses,
            fileNames: files,
            files: filesReturn,
            contentType: this.type
          }
          this.onOKClick(payload)
          this.isUploading = false
        })
        .catch(err => {
          this.$common.axiosError(err)
          this.isUploading = false
        })
    },
    submitFile(file) {
      file.__status = 'Uploading...'
      var headers = this.headers
      headers['Content-Type'] = 'multipart/form-data'
      var formData = new FormData()
      formData.append('file', file)
      formData.append('uploadType', this.type)
      if (this.entityType) {
        formData.append('entityType', this.entityType)
      }
      if (this.entityTypeId > -1) {
        formData.append('entityTypeId', this.entityTypeId)
      }
      if (this.params) {
        const oKeys = Object.keys(this.params)
        oKeys.map(o => {
          formData.append(o, this.params[o])
        })
      }
      return this.$axios.post(this.postAPI, formData, {
        headers: headers,
        onUploadProgress: progressEvent => {
          var percentCompleted = Math.min(
            Math.round((progressEvent.loaded * 1000) / progressEvent.total) /
              10,
            100
          )
          file.__uploaded = percentCompleted / 100
          file.__progressLabel = percentCompleted + '%'
          this.completed = percentCompleted
        }
      })
    },
    onRejected(rejectedEntries) {
      rejectedEntries.forEach(o => {
        if (o.failedPropValidation === 'max-file-size') {
          this.$q.notify({
            type: 'negative',
            timeout: 5000,
            message:
              o.file.name +
              ' is ' +
              this.$common.toHumanReadable(o.file.size) +
              ', and maximum file size is ' +
              this.maxFileSize +
              '.'
          })
        } else if (o.failedPropValidation === 'max-total-size') {
          this.$q.notify({
            type: 'negative',
            timeout: 5000,
            message:
              'Unable to add ' +
              o.file.name +
              ' as total upload size has reached the maximum (' +
              this.maxTotalFileSize +
              ').'
          })
        } else if (o.failedPropValidation === 'accept') {
          var msg = this.accept.toLowerCase().split(',')
          msg = [...new Set(msg)]
          msg = msg.map(o => {
            return '<li>' + o + '</li>'
          })
          msg = '<ol>' + msg.join('') + '</ol>'
          this.$q.notify({
            type: 'negative',
            timeout: 5000,
            message:
              o.file.name + ' is not a standard image, pdf, or document file.',
            actions: [
              {
                label: 'Details',
                color: 'amber',
                handler: () => {
                  this.$common.popup({
                    title: 'Accepted file types',
                    message: msg,
                    html: true
                  })
                }
              }
            ]
          })
        }
      })
    }
  }
})
</script>
