<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section>
        <p><b>Login</b></p>

        <q-list bordered separator>
          <q-expansion-item
            expand-separator
            icon="login"
            label="I Have a Beach Pay Account"
            group="logingroup"
          >
            <q-item-section>
              <div class="q-pa-md" style="max-width: 400px">
                <q-form
                  @submit="onLogin"
                  @reset="onReset"
                  class="q-gutter-md"
                >
                  <q-input
                    filled
                    type="email"
                    v-model="email"
                    label="Email"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />

                  <q-input
                    filled
                    type="password"
                    v-model="password"
                    label="Password"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />

                  <div>
                    <q-btn label="Log In" type="submit" color="primary"/>
                    <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                  </div>
                </q-form>
              </div>
            </q-item-section>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            icon="add"
            label="I Do Not Have a Beach Pay Account"
            group="logingroup"
          >
            <q-item-section>
              <div class="q-pa-md" style="max-width: 400px">
                <q-form
                  @submit="onRegister"
                  @reset="onReset"
                  class="q-gutter-md"
                >
                  <q-input
                    filled
                    type="email"
                    v-model="email"
                    label="Email"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />

                  <q-input
                    filled
                    type="password"
                    v-model="password"
                    label="Password"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />

                  <q-input
                    filled
                    type="password"
                    v-model="password_confirm"
                    label="Password (confirm)"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />

                  <div>
                    <q-btn label="Sign Up" type="submit" color="primary"/>
                    <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                  </div>
                </q-form>
              </div>
            </q-item-section>
          </q-expansion-item>
        </q-list>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
const axios = require('axios')

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export default defineComponent({
  name: 'NewPage',
  
  data: function() {
    return {
      email: null,
      password: null,
      password_confirm: null,
    }
  },
  methods: {
    onReset: function() {
      this.email = null
      this.password = null
      this.password_confirm = null
    },
    onLogin: function(e) {
      e.preventDefault()

      const self = this

      axios.post(
        window.apiBaseUrl + "/api/login", 
        {
          email: this.email,
          password: this.password, 
        }
      )
      .then(response => {
        if(!response.data.success) {
          throw response.data.message
        }

        const user = response.data.data

        return user
      })
      .then(user => {
        console.log('user', user)
        this.$router.push('/user/' + user.id)
      })
      .catch(error => {
        this.$q.notify({
          message: error,
          position: "bottom"
        })
      })

    },
    onRegister: function(e) {
      e.preventDefault()

      const self = this

      if(this.password !== this.password_confirm) {
        this.$q.notify({
          message: "Passwords do not match",
          position: "bottom"
        })
        return false
      }

      const userName = "user-" + makeid(8)
      const walletName = userName + "-wallet-" + makeid(8)

      axios.post(
        window.apiBaseUrl + "/api/register", 
        {
          user_name: userName,
          wallet_name: walletName,
          admin_id: "REPLACE_ME",
          email: this.email,
          password: this.password,
        }
      )
      .then(response => {
        if(!response.data.success) {
          throw response.data.message
        }

        const user = response.data.data

        return user
      })
      .then(user => {
        console.log('registered user', user)
        this.$router.push('/user/' + user.id)
      })
      .catch(error => {
        this.$q.notify({
          message: error,
          position: "bottom"
        })
      })

    }
  }
})
</script>
