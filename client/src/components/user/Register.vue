<template>
  <v-layout column>
    <v-flex xs6 offset-xs3>
      <div class="white elevation-2 top-120">
        <v-toolbar class="blue darken-2" flat dense dark>
          <v-toolbar-title>Register</v-toolbar-title>
        </v-toolbar>
        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field name="firstName" label="First Name" id="firstName" type="text"
                        v-model="form.firstName" v-validate="'required'" data-vv-as="first name"
                        :error-messages="errors.collect('firstName')"/>
          <v-text-field name="lastName" label="Last Name" id="lastName" type="text"
                        v-model="form.lastName" v-validate="'required'"
                        :error-messages="errors.collect('lastName')"/>
          <v-text-field name="email" label="Email" id="email" type="email"
                        v-model="form.email" v-validate="'required|email'"
                        :error-messages="errors.collect('email')"/>
          <v-text-field name="password" label="Password" id="password" type="password"
                        v-model="form.password" v-validate="'required|min:6'"
                        :error-messages="errors.collect('password')"/>
          <v-text-field name="password_confirmation" label="Repeat password" id="password_confirmation" type="password"
                        v-model="form.password_confirmation" v-validate="'required|confirmed:password'" data-vv-as="password"
                        :error-messages="errors.collect('password_confirmation')"/>
        </div>
        <v-btn class="blue darken-2" @click="register" dark>Register</v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthService from '../../services/AuthService';
import bus from '../../store/eventBus';

export default {
  name: 'register',
  data () {
    return {
      form: {
        email: '',
        password: '',
        password_confirmation: '',
        firstName: '',
        lastName: '',
        phone: '',
        birthDate: ''
      }
    };
  },
  methods: {
    async register () {
      const isValid = await this.$validator.validateAll();

      if (!isValid) {
        bus.flash('Fill required fields', 'error');
        return false;
      }

      try {
        const response = await AuthService.register(this.form);
        this.$store.commit('setToken', response.data.token);
        this.$store.commit('setUser', response.data.user);
        bus.flash('You have registered', 'success');
        this.$router.push('/');
      } catch (error) {
        bus.flash(error.response.data.message, 'error');
      }
    }
  }
};
</script>
