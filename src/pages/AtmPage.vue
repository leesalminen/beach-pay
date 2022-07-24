<template>
  <q-page v-if="user != null" class="">
    <div class="row">
      <div class="col">
        <p style="margin: 25px;"><b>ATM For {{ user.id }}</b></p>
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

          <div v-show="!loading">
            <q-badge color="green" style="font-size: 16px; padding: 5px;">
              <b>{{parseInt(wallet.balance / 1000)}} sats</b>
            </q-badge>
          </div>

          <br>

          <div class="row">
            <div class="col">

              <q-form @submit="createWithdraw" class="q-gutter-md" v-show="sellForm.link == null && !loading">
                <q-select
                  filled
                  dense
                  emit-value
                  v-model="sellForm.data.currency"
                  :options="currencyOptions"
                  label="Currency *"
                ></q-select>

                <q-input
                  filled
                  dense
                  v-model.trim="sellForm.data.amount"
                  label="Amount to sell in fiat"
                />

                <div class="row q-mt-lg">
                  <q-btn
                    unelevated
                    color="primary"
                    :disable="sellForm.data.currency == null || sellForm.data.amount == null"
                    type="submit"
                    >Sell Bitcoin!</q-btn
                  >
                </div>
              </q-form>

              <div v-show="sellForm.link != null">
                <vue-qrcode
                  :value="sellForm.link ? sellForm.link.lnurl : 'na'"
                  :options="{width: 200}"
                  class="rounded-borders"
                ></vue-qrcode>
                <br>
                <q-btn
                  unelevated
                  color="primary"
                  @click="resetForm"
                  >All Done!</q-btn
                >
              </div>

            </div>
          </div>



          
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import VueQrcode from 'vue-qrcode'
const axios = require('axios')

export default defineComponent({
  name: 'AtmPage',

  components: {
    VueQrcode,
  },

  data: function() {
    return {
      user: null,
      loading: false,
      wallet: {},
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
      sellForm: {
        data: {
          currency: null,
          amount: null,
        },
        link: null,
      },
    }
  },

  computed: {
    
  },

  methods: {

    resetForm: function() {
      this.loading = true
      
      this.sellForm = {
        data: {
          currency: null,
          amount: null,
        },
        link: null,
      }

      this.loadWallets();
    },

    createWithdraw: function() {
      var self = this;
      const selectedCurrency = this.sellForm.data.currency

      return axios.get('https://api.opennode.co/v1/rates')
      .then((response) => {
        const exchangeRate = response.data.data['BTC' + selectedCurrency][selectedCurrency]

        return Math.ceil((this.sellForm.data.amount / exchangeRate) * 100000000)
      })
      .then((max_withdrawable) => {
        if(max_withdrawable > this.wallet.balance / 1000) {
          this.$q.notify({
            message: "Your balance is too low",
            position: "bottom"
          })

          return
        }

        return axios.post(
          window.apiBaseUrl + "/api/proxy",
          {
            path: "/withdraw/api/v1/links",
            data: {
              is_unique: false,
              title: "Bitcoin ATM Sale",
              uses: 1,
              min_withdrawable: max_withdrawable,
              max_withdrawable: max_withdrawable,
              wait_time: 1,
            },
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": this.wallet.adminkey,
            },
          }
        )
      })
      .then((res) => {

        self.sellForm.link = res.data.data
       
        self.withdrawFormDialog.amount = null

        self.$q.notify({
          message: "Link created successfully!",
          position: "bottom",
        })

        return
      })
    },

    loadWallets: function() {
      return axios.post(
        window.apiBaseUrl + "/api/proxy", 
        {
          path: "/usermanager/api/v1/wallets/" + this.user.id,
          method: "GET",
          data: {
            
          }
        }
      )
      .then(response => {
        const wallets = response.data.data

        return wallets.filter((el) => el.id == this.$route.params.wallet)
      })
      .then(wallets => {
        let promises = []
        wallets.forEach(wallet => {
          promises.push(
            axios.post(
              window.apiBaseUrl + "/api/proxy", 
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
        this.wallet = result.map(item => item.data.data)[0]

        this.loading = false

        return
      })
    },

  },


  created: function() {
    this.loading = true

    const userId = this.$route.params.id

    if(!userId) {
      return
    }

    return axios.post(
      window.apiBaseUrl + "/api/proxy", 
      {
        path: "/usermanager/api/v1/users/" + userId,
        method: "GET",
        data: {
          
        }
      }
    )
    .then(response => {

      if(!response.data.success) {
        this.$router.push('/new')
        throw "User record not found"
      }

      const user = response.data.data

      return user
    })
    .then(user => {      
      this.user = user
    })
    .then(this.loadWallets)
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
