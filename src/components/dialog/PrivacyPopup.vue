<template>
  <q-dialog
    ref="dialog"
    maximized
    :persistent="persistent"
    class="full-width"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin bg-sei-grey-light-1 text-dark border-primary"
    >
      <q-card-section
        class="bg-dark text-white shadow-2 text-center q-pt-sm q-pa-none underlined-after"
      >
        <div class="row items-center no-wrap q-pa-none q-ma-none">
          <div class="col">
            <div class="text-h6">eScrut Privacy Policy</div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-lg q-mt-lg bg-sei-grey-light-1 text-dark">
        <p>
          eScrut is run by and on behalf of the Inter Varsity Dance Association
          (IVDA) and administered and maintained by QuakeFire Ltd, a limited
          company registered in England as number 12677231. This privacy policy
          will explain how eScrut uses the personal data we collect from you
          when you use our app.
        </p>
      </q-card-section>
      <q-card-section>
        <div class="text-h5">What data do we collect?</div>
      </q-card-section>
      <q-card-section class="q-pa-lg bg-sei-grey-light-1 text-dark">
        <p>eScrut collects the following data:</p>
        <ul>
          <li>Personal identification information: name and email.</li>
          <li>
            Affiliation information: University or dance school you are
            affiliated with.
          </li>
          <li>
            Competition entries: competitions, partners, events, results, and
            any further information you provide as part of entering a
            competition.
          </li>
        </ul>
      </q-card-section>
      <q-card-section>
        <div class="text-h5">How do we collect your data?</div>
      </q-card-section>
      <q-card-section class="q-pa-lg bg-sei-grey-light-1 text-dark">
        <p>
          You directly provide eScrut with most of the data we collect. We
          collect data and process data when you:
        </p>
        <ul>
          <li>Register online</li>
          <li>Submit competition entries into the system</li>
        </ul>
        <!-- <p>
          Our Company may also receive your data indirectly from the following
          sources:
        </p>
        <ul>
          <li>
            Office 365
          </li>
        </ul> -->
      </q-card-section>
      <q-card-section>
        <div class="text-h5">How will we use your data?</div>
      </q-card-section>
      <q-card-section class="q-pa-lg bg-sei-grey-light-1 text-dark">
        <p>eScrut collects your data so that we can:</p>
        <ul>
          <li>
            Record and process your competition entries and manage your account.
          </li>
          <li>
            Email you with information about the app or competitions that we
            think might be of interest to you, or that you have entered.
          </li>
        </ul>
      </q-card-section>
      <q-card-section>
        <div class="text-h5">How do we store your data?</div>
      </q-card-section>
      <q-card-section class="q-pa-lg bg-sei-grey-light-1 text-dark">
        <p>
          Our Company securely stores your data on its servers and data is
          encrypted in transit to and from the app.
        </p>
        <p>
          Our Company will keep your personal data for 2 years for the date you
          last agreed to the eScrut privacy policy. Once this time period has
          expired, we will delete your personal data from the servers, excluding
          competition results.
        </p>
        <p>
          Once your personal data has been deleted, any personal profile data in
          the system relating to you will be anonymized. Competition results
          will be stored indefinitely, for statistical and archiving purposes,
          as they form part of a public archive of competition results.
          <!-- The only personal data retained for this
          purpose will be your name and any relevant school affiliations. -->
          <!-- Anonymised trip data will be
          stored for a period of 10 years so that you organisation can monitor
          carbon reduction footprints. -->
        </p>
      </q-card-section>
      <q-card-section>
        <div class="text-h5">What are your data protection rights?</div>
      </q-card-section>
      <q-card-section class="q-pa-lg bg-sei-grey-light-1 text-dark">
        <p>
          eScrut would like to make sure you are fully aware of all of your data
          protection rights. Every user is entitled to the following:
        </p>
        <ul>
          <li>
            The right to access - You have the right to request Our Company for
            copies of your personal data. We may charge you a small fee for this
            service.
          </li>
          <li>
            The right to rectification - You have the right to request that Our
            Company correct any information you believe is inaccurate. You also
            have the right to request Our Company to complete information you
            believe is incomplete.
          </li>
          <li>
            The right to erasure - You have the right to request that Our
            Company erase your personal data, under certain conditions.
          </li>
          <li>
            The right to restrict processing - You have the right to request
            that Our Company restrict the processing of your personal data,
            under certain conditions.
          </li>
          <li>
            The right to object to processing - You have the right to object to
            Our Company's processing of your personal data, under certain
            conditions.
          </li>
          <li>
            The right to data portability - You have the right to request that
            Our Company transfer the data that we have collected to another
            organization, or directly to you, under certain conditions.
          </li>
          <li>
            If you make a request, we have one month to respond to you. If you
            would like to exercise any of these rights, please contact us at our
            email:
            <a
              :href="`mailto:results@universitydancesport.com?subject=eScrut%20GDPR%20Request`"
              rel="EMAIL"
              >results@universitydancesport.com</a
            >
          </li>
        </ul>
      </q-card-section>
      <q-card-section>
        <div class="text-h5">Changes to our privacy policy</div>
      </q-card-section>
      <q-card-section class="q-pa-lg bg-sei-grey-light-1 text-dark">
        <p>
          eScrut keeps its privacy policy under regular review and places any
          updates on this web page. This privacy policy was last updated on 8
          January 2021.
        </p>
      </q-card-section>
      <q-card-section>
        <div class="text-h5">How to contact us</div>
      </q-card-section>
      <q-card-section class="q-pa-lg bg-sei-grey-light-1 text-dark">
        <p>
          If you have any questions about eScrut’s privacy policy, the data we
          hold on you, or you would like to exercise one of your data protection
          rights, please do not hesitate to contact us.
        </p>
        <p>
          Email us at:
          <a
            :href="`mailto:results@universitydancesport.com?subject=eScrut%20question`"
            rel="EMAIL"
            >results@universitydancesport.com</a
          >
        </p>
      </q-card-section>
      <q-card-section>
        <div class="text-h5">How to contact the appropriate authority</div>
      </q-card-section>
      <q-card-section class="q-pa-lg bg-sei-grey-light-1 text-dark">
        <p>
          Should you wish to report a complaint or if you feel that eScrut has
          not addressed your concern in a satisfactory manner, you may contact
          the Information Commissioner's Office in the United Kingdom.
        </p>
      </q-card-section>
      <q-card-section>
        <div class="text-h5">Consent</div>
      </q-card-section>
      <q-card-section class="q-pa-lg bg-sei-grey-light-1 text-dark">
        <q-field borderless>
          <template #control>
            <q-checkbox
              v-model="agree"
              color="green"
              class="q-pr-lg"
              :disable="!loggedIn"
            >
              <q-tooltip v-if="!loggedIn">Please log in first</q-tooltip>
            </q-checkbox>
            <div v-if="inDate && agree" class="col">
              You consented to our Privacy Policy and agreed to its terms on {{ gdprDate.format('Do MMMM YYYY') }}. 
              You may withdraw consent at any time below.
            </div>

            <div v-else class="col">
              I hereby consent to our Privacy Policy and agree to its terms.
            </div>
          </template>
        </q-field>
      </q-card-section>
      <q-card-section class="bg-dark text-white shadow-2 text-center q-pa-sm">
        <div class="row items-center no-wrap q-pt-sm">
          <div class="col">
            <q-btn
              icon="clear"
              :label="loggedIn ? inDate ? 'withdraw' : 'reject' : 'close'"
              :color="loggedIn ? 'negative' : 'amber'"
              unelevated
              class="q-mx-sm"
              :class="loggedIn ? 'text-white' : 'text-black'"
              @click="onCancelClick"
            />
            <q-btn
              v-if="loggedIn"
              :disable="!agree"
              icon="cloud_upload"
              label="consent"
              color="positive"
              unelevated
              class="q-mx-sm"
              @click="onOKClick"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
// import stateComputed from 'components/js/state-computed'
export default {
  components: {},
  props: {
    // ...your custom props
    maximized: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: 'WEBSITE',
    },
    submit: {
      type: String,
      default: 'Ok',
    },
    clear: {
      type: String,
      default: 'reset',
    },
    cancel: {
      type: Boolean,
      default: false,
    },
    lastDateDefault: { type: String, default: '' },
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['hide', 'ok'],
  data() {
    return {
      agree: false,
      company: 'SEI and Quakefire',
    }
  },
  computed: {
    // ...stateComputed
    loggedIn() {
      return this.$store.state.command.loggedIn
    },
    userDetails() {
      if (this.loggedIn) {
        return this.$store.state.command.userDetails
      } else {
        return {}
      }
    },
    gdprDate() {
      return this.$moment(this.userDetails.gdpr.date)
    },
    inDate() {
      if ('gdpr' in this.userDetails) {
        const now = this.$moment(Date.now())
        return now.diff(this.gdprDate, 'days') < 366
      } else {
        return false
      }
    },
  },
  mounted() {
    if (this.inDate) {
      this.agree = true
    }
    // console.log(this.lastDateDefault)
    // this.refreshTrick = !this.refreshTrick
  },
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      // this.$nextTick((() => )
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick(arg) {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      const gdprDate = this.$moment(Date.now()).format('YYYY-MM-DD')
      // ${this.$store.state.command.userDetails.id}
      this.$axios
        .put('/user', {
          field: 'gdpr',
          newValue: gdprDate,
        })
        .then(() => {
          this.$store.commit('command/setGDPR', gdprDate)
        })
        .catch((err) => {
          this.$common.axiosError(err)
        })
      this.$emit('ok', arg)
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick() {
      if (this.loggedIn) {
        this.$axios
          .put('/user', {
            field: 'gdpr',
            newValue: '2001-01-01',
          })
          .then(() => {
            // this.$store.commit('tmr/setGDPR', gdprDate)
          })
          .catch((err) => {
            this.$common.axiosError(err)
          })
        this.$q
          .dialog({
            dark: true,
            title: 'Policy rejected',
            message:
              'As you have not consented to sharing your data, we are unable to provide access to eScrut.',
            class: 'bg-primary',
          })
          .onDismiss(() => {
            this.$axios
              .post('/auth/logout')
              .then(() => {
                this.$store.commit('command/clearStore')
                this.loggedIn = false
                this.$router.push('/login')
              })
              .catch((err) => {
                this.$common.axiosError(err)
              })
          })
      }
      // console.log('closed...')
      // we just need to hide dialog
      this.hide()
    },
  },
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 800px
</style>
