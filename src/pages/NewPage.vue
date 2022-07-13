<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section>
        <p><b>New Wristband</b></p>

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
                  @submit="onSubmit"
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
                  @submit="onSubmit"
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

export default defineComponent({
  name: 'NewPage'
})
</script>
