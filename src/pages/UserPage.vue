<template>
  <q-page v-if="user != null" class="">
    <div class="row">
      <div class="col">
        <p style="margin: 25px;"><b>User {{ user.id }}</b></p>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-12 col-md">
        <div class="q-pa-md">
          <q-spinner-hearts
            color="primary"
            size="5em"
            v-show="loading"
          />
          <q-list bordered separator v-if="wallets.length > 0">
            <div v-for="(wallet, index) in wallets" :key="wallet.id">
              <q-item clickable v-ripple @click="selectedWalletIndex = index; loadWallet()">
                <q-item-section>{{wallet.name}}</q-item-section>
                <q-item-section side>
                  <div class="row" style="align-items: center;">
                    <div class="col">
                      <q-btn
                        unelevated
                        icon="link"
                        @click="openWallet(wallet)"
                      >
                      </q-btn>
                    </div>
                    <div class="col">
                      <q-badge color="green" style="font-size: 16px; padding: 5px;">
                        <b>{{parseInt(wallet.balance / 1000)}} sats</b>
                      </q-badge>
                    </div>  
                  </div>
                </q-item-section>
              </q-item>

              <q-item v-if="wallet.id == selectedWallet.id">
                <q-item-section>
                  
                  <div class="row justify-center">
                    
                    <div class="col-4">
                      <q-btn
                        unelevated
                        color="primary"
                        @click="formDialog.show = true"
                      >
                        New Deposit
                      </q-btn>
                    </div>
                    <div class="col-4">
                      <q-btn
                        unelevated
                        color="secondary"
                        @click="withdrawFormDialog.show = true"
                        :disable="wallet.balance == 0"
                      >
                        New Wristband Link
                      </q-btn>
                    </div>
                  </div>

                  <div class="row q-gutter-y-md q-gutter-md">
                    <div class="col-12 col-md">
                      <q-card>
                        <q-card-section>
                          <p>
                            <b>Wristbands</b>
                          </p>

                          <q-list bordered separator v-if="selectedWallet.links && selectedWallet.links.length > 0">
                            <q-item clickable v-ripple>
                              <q-item-section side><b>Delete</b></q-item-section>
                              <q-item-section side><b>Write</b></q-item-section>
                              <q-item-section><b>Name</b></q-item-section>
                              <q-item-section><b>Max Amount</b></q-item-section>
                              <q-item-section><b>Max Uses</b></q-item-section>
                              <q-item-section><b>Wait Time</b></q-item-section>
                            </q-item>
                            <q-item clickable v-ripple v-for="link in selectedWallet.links" :key="link.id">
                              <q-item-section side>
                                <q-btn @click="deleteLink(link.id)" flat color="grey" class="q-ml-auto" icon="delete" />
                              </q-item-section>
                              <q-item-section side>
                                <q-btn @click="writeNfc(link.lnurl)" flat color="grey" class="q-ml-auto" icon="nfc" />
                              </q-item-section>
                              <q-item-section>{{link.title}}</q-item-section>
                              <q-item-section>{{link.max_withdrawable}}</q-item-section>
                              <q-item-section>{{link.uses}}</q-item-section>
                              <q-item-section>{{link.wait_time}}</q-item-section>
                              
                            </q-item>
                          </q-list>

                          <p v-if="!selectedWallet.links || !selectedWallet.links.length">
                            No Wristband Links Found
                          </p>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>

                  

                  
                </q-item-section>
               
              </q-item>
            </div>
          </q-list>
        </div>
      </div>
    </div>

    <q-dialog v-model="withdrawFormDialog.show" position="top">
      <q-card class="q-pa-lg q-pt-xl">
        <q-form @submit="createWithdraw" class="q-gutter-md">
          
          <q-input
            filled
            dense
            v-model="withdrawFormDialog.data.title"
            label="Name your wristband"
          />

          <q-select
            filled
            dense
            emit-value
            v-model="withdrawFormDialog.data.currency"
            :options="currencyOptions"
            label="Currency *"
          ></q-select>

          <q-input
            filled
            dense
            v-model.trim="withdrawFormDialog.data.max_withdrawable"
            label="Max amount per transaction"
          />

          <q-input
            filled
            dense
            v-model.trim="withdrawFormDialog.data.uses"
            label="Max number of uses"
            type="number"
          />

          <q-input
            filled
            dense
            v-model.trim="withdrawFormDialog.data.wait_time"
            label="# of seconds between each use"
            type="number"
          />

          <div class="row q-mt-lg">
            <q-btn
              unelevated
              color="primary"
              :disable="withdrawFormDialog.data.title == null || withdrawFormDialog.data.currency == null || withdrawFormDialog.data.max_withdrawable == null || withdrawFormDialog.data.uses == null || withdrawFormDialog.data.wait_time == null"
              type="submit"
              >Create New Wristband Link</q-btn
            >
            <q-btn v-close-popup flat color="grey" class="q-ml-auto"
              >Cancel</q-btn
            >
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="formDialog.show" position="top">
      <q-card class="q-pa-lg q-pt-xl">
        <q-form @submit="createPayment" class="q-gutter-md">
          <q-input
            filled
            dense
            v-model.trim="formDialog.data.payment_amount"
            label="Payment Amount"
            placeholder="4.20"
          />
            
          <q-select
            filled
            dense
            emit-value
            v-model="formDialog.data.currency"
            :options="currencyOptions"
            label="Currency *"
          ></q-select>

          <div class="row q-mt-lg">
            <q-btn
              unelevated
              color="primary"
              :disable="formDialog.data.payment_amount == null || formDialog.data.currency == null"
              type="submit"
              >Make Deposit</q-btn
            >
            <q-btn v-close-popup flat color="grey" class="q-ml-auto"
              >Cancel</q-btn
            >
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="qrCodeDialog.show"
      position="top"
    >
      <q-card class="q-pa-lg q-pt-xl text-center">
        <a :href="'lightning:' + qrCodeDialog.data.payment_request">
          <q-responsive :ratio="1" class="q-mx-xs">
            <vue-qrcode
              :value="qrCodeDialog.data.payment_request"
              :options="{width: 400}"
              class="rounded-borders"
            ></vue-qrcode>
          </q-responsive>
        </a>
        <br />
        <q-btn
          outline
          color="grey"
          @click="copyText('lightning:' + qrCodeDialog.data.payment_request, 'Invoice copied to clipboard!')"
          >Copy Invoice</q-btn
        >
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import VueQrcode from 'vue-qrcode'
import { copyToClipboard } from 'quasar'
const axios = require('axios')

export default defineComponent({
  name: 'IndexPage',

  components: {
    VueQrcode,
  },

  data: function() {
    return {
      user: null,
      loading: false,
      wallets: [],
      selectedWalletIndex: 0,
      links: {},
      currencyOptions: [
        'CRC',
        'USD',
        'EUR',
        'GBP',
        'AED',
        'AFN',
        'ALL',
        'AMD',
        'ANG',
        'AOA',
        'ARS',
        'AUD',
        'AWG',
        'AZN',
        'BAM',
        'BBD',
        'BDT',
        'BGN',
        'BHD',
        'BIF',
        'BMD',
        'BND',
        'BOB',
        'BRL',
        'BSD',
        'BTN',
        'BWP',
        'BYN',
        'BZD',
        'CAD',
        'CDF',
        'CHF',
        'CLF',
        'CLP',
        'CNH',
        'CNY',
        'COP',
        'CUC',
        'CUP',
        'CVE',
        'CZK',
        'DJF',
        'DKK',
        'DOP',
        'DZD',
        'EGP',
        'ERN',
        'ETB',
        'EUR',
        'FJD',
        'FKP',
        'GBP',
        'GEL',
        'GGP',
        'GHS',
        'GIP',
        'GMD',
        'GNF',
        'GTQ',
        'GYD',
        'HKD',
        'HNL',
        'HRK',
        'HTG',
        'HUF',
        'IDR',
        'ILS',
        'IMP',
        'INR',
        'IQD',
        'IRR',
        'IRT',
        'ISK',
        'JEP',
        'JMD',
        'JOD',
        'JPY',
        'KES',
        'KGS',
        'KHR',
        'KMF',
        'KPW',
        'KRW',
        'KWD',
        'KYD',
        'KZT',
        'LAK',
        'LBP',
        'LKR',
        'LRD',
        'LSL',
        'LYD',
        'MAD',
        'MDL',
        'MGA',
        'MKD',
        'MMK',
        'MNT',
        'MOP',
        'MRO',
        'MUR',
        'MVR',
        'MWK',
        'MXN',
        'MYR',
        'MZN',
        'NAD',
        'NGN',
        'NIO',
        'NOK',
        'NPR',
        'NZD',
        'OMR',
        'PAB',
        'PEN',
        'PGK',
        'PHP',
        'PKR',
        'PLN',
        'PYG',
        'QAR',
        'RON',
        'RSD',
        'RUB',
        'RWF',
        'SAR',
        'SBD',
        'SCR',
        'SDG',
        'SEK',
        'SGD',
        'SHP',
        'SLL',
        'SOS',
        'SRD',
        'SSP',
        'STD',
        'SVC',
        'SYP',
        'SZL',
        'THB',
        'TJS',
        'TMT',
        'TND',
        'TOP',
        'TRY',
        'TTD',
        'TWD',
        'TZS',
        'UAH',
        'UGX',
        'USD',
        'UYU',
        'UZS',
        'VEF',
        'VES',
        'VND',
        'VUV',
        'WST',
        'XAF',
        'XAG',
        'XAU',
        'XCD',
        'XDR',
        'XOF',
        'XPD',
        'XPF',
        'XPT',
        'YER',
        'ZAR',
        'ZMW',
        'ZWL'
      ],
      qrCodeDialog: {
        data: {
          payment_request: null,
        },
        show: false,
      },
      formDialog: {
        data: {
          payment_amount: null,
          currency: null,
        },
        show: false,
        firstTime: true,
      },
      withdrawFormDialog: {
        data: {
          
        },
        show: false,
      },
    }
  },

  computed: {
    selectedWallet: function() {
      const selectedWallet = this.wallets[this.selectedWalletIndex]
      selectedWallet.links = this.links[selectedWallet.id]

      return selectedWallet
    },
  },

  methods: {

    firstTime: function() {
      formDialog.firstTime = true; 
      formDialog.show = true;
    },

    writeNfc: async function(lnurl) {
      try {
        const ndef = new NDEFReader();

        this.$q.notify({
          message: "Now, tap your wristband to your device...",
          position: "bottom",
        })


        await ndef.write(lnurl);
        
        this.$q.notify({
          message: "Write successful!",
          position: "bottom",
        })

      } catch (error) {
        if(error.name == "ReferenceError") {
          this.$q.notify({
            message: "NFC writing not supported on this device",
            position: "bottom",
          })
        }
      }
    },

    openWallet: function(wallet) {
      window.open('https://69d36a7a39.d.voltageapp.io/wallet?usr=' + this.user.id + '&wal=' + wallet.id, '_blank')
    },

    copyText: function (text, message, position) {
      var notify = this.$q.notify
      copyToClipboard(text).then(function () {
        notify({
          message: message || 'Copied to clipboard!',
          position: position || 'bottom'
        })
      })
    },

    createWithdraw: function() {
      var self = this;
      const selectedCurrency = this.withdrawFormDialog.data.currency

      return axios.get('https://api.opennode.co/v1/rates')
      .then((response) => {
        const exchangeRate = response.data.data['BTC' + selectedCurrency][selectedCurrency]

        return Math.ceil((this.withdrawFormDialog.data.max_withdrawable / exchangeRate) * 100000000)
      })
      .then((max_withdrawable) => {
        return axios.post(
          "https://beach-pay.netlify.app/api/proxy",
          {
            path: "/withdraw/api/v1/links",
            data: {
              is_unique: false,
              title: this.withdrawFormDialog.data.title,
              uses: this.withdrawFormDialog.data.uses,
              min_withdrawable: 10,
              max_withdrawable: max_withdrawable,
              wait_time: this.withdrawFormDialog.data.wait_time,
            },
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": this.selectedWallet.adminkey,
            },
          }
        )
      })
      .then((res) => {
        self.links[self.selectedWallet.id].push(res.data.data)
        self.withdrawFormDialog.show = false
        self.withdrawFormDialog.data = {}

        self.writeNfc()

        return
      })
    },

    loadWallet: function() {
      const wallet = this.selectedWallet
      const self = this

      return axios.post(
        "https://beach-pay.netlify.app/api/proxy",
        {
          path: "/withdraw/api/v1/links",
          data: {
 
          },
          method: "GET",
          headers: {
            "X-Api-Key": this.selectedWallet.inkey,
          },
        }
      )
      .then((res) => {
        self.links[self.selectedWallet.id] = res.data.data

        return
      })
    },

    createPayment: function () {
      var self = this
      var qrCodeDialog = this.qrCodeDialog
      var formDialog = this.formDialog
      var famount = parseInt(formDialog.data.payment_amount * 100)

      const walletInkey = this.selectedWallet.inkey

      return axios.post(
        "https://beach-pay.netlify.app/api/proxy", 
        {
          path: "/api/v1/payments",
          method: "POST",
          headers: {
            "X-Api-Key": walletInkey,
          },
          data: {
            out: false,
            amount: parseFloat(formDialog.data.payment_amount),
            unit: formDialog.data.currency,
            memo: "Deposit to Beach Pay",
          }
        }
      )
      .then(response => {
        formDialog.show = false
        formDialog.data = {}

        qrCodeDialog.data = response.data.data
        qrCodeDialog.show = true

        qrCodeDialog.dismissMsg = self.$q.notify({
          timeout: 0,
          message: 'Waiting for payment...'
        })

        qrCodeDialog.paymentChecker = setInterval(function () {
          axios.post(
            "https://beach-pay.netlify.app/api/proxy",
            {
              path: "/api/v1/payments/" + qrCodeDialog.data.payment_hash,
              method: "GET",
              headers: {
                "X-Api-Key": walletInkey,
              },
              data: {
               
              }
            }
          ) 
          .then(function (res) {
            if (res.data.data.paid) {
              clearInterval(qrCodeDialog.paymentChecker)
              qrCodeDialog.dismissMsg()
              qrCodeDialog.show = false

              if(formDialog.firstTime) {
                self.$q.notify({
                  message: "Payment received successfully!",
                  position: "bottom",
                })

                self.withdrawFormDialog.show = true
              } else {
                setTimeout(function () {
                  window.location.reload()
                }, 500)
              }
            }
          })
        }, 3000)
      })
      .catch(function (error) {
        self.$q.notify({
          message: "Error! " + error,
          position: "bottom"
        })
      })
    },

    deleteLink: function(linkId) {
      if(confirm('Are you sure you want to delete this link?')) {
        axios.post(
          "https://beach-pay.netlify.app/api/proxy",
          {
            path: "/withdraw/api/v1/links/" + linkId,
            method: "DELETE",
            headers: {
              "X-Api-Key": this.selectedWallet.adminkey,
            },
            data: {
             
            }
          }
        ) 
        .then(function (res) {
          window.location.reload()
        })
      }
    }

  },

  created: function() {
    this.loading = true

    const userId = this.$route.params.id

    if(!userId) {
      return
    }

    return axios.post(
      "https://beach-pay.netlify.app/api/proxy", 
      {
        path: "/usermanager/api/v1/users/" + userId,
        method: "GET",
        data: {
          
        }
      }
    )
    .then(response => {
      const user = response.data.data

      return user
    })
    .then(user => {      
      this.user = user
    })
    .then(() => {
      return axios.post(
        "https://beach-pay.netlify.app/api/proxy", 
        {
          path: "/extensions?usr=" + userId + "&enable=withdraw",
          method: "GET",
          data: {
            
          }
        }
      )
    })
    .then(() => {
      return axios.post(
        "https://beach-pay.netlify.app/api/proxy", 
        {
          path: "/usermanager/api/v1/wallets/" + userId,
          method: "GET",
          data: {
            
          }
        }
      )
    })
    .then(response => {
      const wallets = response.data.data

      return wallets
    })
    .then(wallets => {
      let promises = []
      wallets.forEach(wallet => {
        promises.push(
          axios.post(
            "https://beach-pay.netlify.app/api/proxy", 
            {
              path: "/api/v1/wallet",
              method: "GET",
              headers: {
                "X-Api-Key": wallet.inkey,
              },
              data: {
                
              }
            }
          )
          .then(response => {
            response.data.data = {
              ...response.data.data,
              ...wallet,
            }

            return response
          })
        )
      })

      return Promise.all(promises)
    })
    .then(result => {
      this.wallets = result.map(item => item.data.data)

      this.loading = false

      return
    })
    .then(() => {
      return this.loadWallet()
    })
    .catch(error => {
      this.$q.notify({
        message: "Error! " + error,
        position: "bottom"
      })

      this.loading = false
    })
  }
})
</script>
