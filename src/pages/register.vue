<template>
  <!-- Register Layout -->
  <AuthForm :slogan="sloganMessage" class="register-form-container">
    <div class="text-center mb-3">
      <Title heading="h2">
        {{ $t('register_form.register_label', { appName: $t('app_name') }) }}
      </Title>
    </div>
    <div class="card bg-secondary shadow border-0">
      <div class="card-header bg-white pb-4">
        <div class="text-muted text-center mb-3">
          <h6>{{ $t('register_form.register_with', { appName: $t('app_name') }) }}</h6>
        </div>
        <SocialAuth :action="'sign_up'" @auth:action="resetForm" />
      </div>

      <div class="card-body px-lg-5 py-lg-4">
        <div class="text-center text-muted mb-3">
          <div class="divider">
            <span>{{ $t('or') }}</span>
          </div>
        </div>

        <form id="register-form" role="form" class="mt-4 px-4" @submit.prevent="submitForm">
          <!-- email field -->
          <div class="form-group mb-3">
            <label for="inputEmail">{{ $t('email') }}</label>
            <input
              v-model="form.email"
              name="inputEmail"
              class="form-control"
              :class="{
                'is-valid': isValidEmail,
                'is-invalid': emailValidationField?.$dirty && !isValidEmail,
              }"
              @input="delayTouch(emailValidationField)"
            />
            <div v-if="emailValidationField?.$invalid" class="error">
              <span v-if="emailValidationField.$dirty && !emailValidationField.required">
                <BaseFormInputError>{{ $t('messages.please_enter_email') }}</BaseFormInputError>
              </span>
              <span v-else-if="emailValidationField.$dirty && !emailValidationField.valid">
                <BaseFormInputError>{{ $t('messages.invalid_email') }}</BaseFormInputError>
              </span>
            </div>
          </div>

          <!-- password field -->
          <div class="form-group position-relative">
            <label for="inputPassword">{{ $t('password') }}</label>
            <input
              v-model="form.password"
              name="inputPassword"
              :type="passwordViewIsToggled ? 'text' : 'password'"
              class="form-control"
              :class="{
                'is-valid': isValidPassword,
                'is-invalid': passwordValidationField?.$dirty && !isValidPassword,
              }"
              @input="delayTouch(passwordValidationField)"
            />
            <i
              class="fa password-eye"
              :class="!passwordViewIsToggled ? 'fa-eye' : 'fa-eye-slash'"
              v-show="form.password.length > 0"
              @click="togglePassword"
            ></i>
            <div v-if="passwordValidationField?.$invalid" class="error">
              <span v-if="passwordValidationField.$dirty && !passwordValidationField.required">
                <BaseFormInputError>{{ $t('messages.please_enter_password') }}</BaseFormInputError>
              </span>
              <span v-else-if="passwordValidationField.$dirty && !passwordValidationField.goodPassword">
                <BaseFormInputError>{{
                  $t('messages.not_good_password', { minLength: passwordMinLength })
                }}</BaseFormInputError>
              </span>
            </div>
          </div>

          <!-- full name field -->
          <div class="form-group mb-3">
            <label for="inputName">{{ $t('register_form.full_name') }}</label>
            <input
              v-model="form.name"
              name="inputName"
              class="form-control"
              :class="{ 'is-valid': isValidName, 'is-invalid': nameValidationField?.$dirty && !isValidName }"
              @input="delayTouch(nameValidationField)"
            />
            <div v-if="nameValidationField?.$invalid" class="error">
              <span v-if="nameValidationField.$dirty && !nameValidationField.required">
                <BaseFormInputError>{{ $t('messages.please_enter_name') }}</BaseFormInputError>
              </span>
              <span v-else-if="nameValidationField.$dirty && !nameValidationField.minLength">
                <BaseFormInputError>{{
                  $t('messages.name_minlength_error', { minLength: nameMinLength })
                }}</BaseFormInputError>
              </span>
              <span v-else-if="nameValidationField.$dirty && !nameValidationField.valid">
                <BaseFormInputError>{{ $t('messages.invalid_name') }}</BaseFormInputError>
              </span>
            </div>
            <p class="py-3 font-weight-normal" style="font-size: 0.93rem">
              {{ $t('register_form.agree_to') }}
              <NuxtLink to="/terms-and-conditions">{{ $t('terms_and_conditions') }}</NuxtLink>
            </p>
          </div>

          <!-- the error from server will be displayed here !-->
          <BaseFormInputError v-if="errors.length > 0">
            <div v-for="(error, idx) in errors" :key="idx">
              {{ error }}
            </div>
          </BaseFormInputError>

          <div class="text-center">
            <button type="submit" class="btn btn-primary px-5 mt-1" :disabled="isBusy">
              {{ $t('register_form.register') }}
            </button>
          </div>
          <hr class="mt-6" />
          <div class="flex justify-center pt-0">
            <span>
              {{ $t('register_form.already_registered') }}
              <a class="link" @click="showLogin">{{ $t('sign_in') }}</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  </AuthForm>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator';
import { IValidator } from 'vuelidate';
import { required, email, minLength } from 'vuelidate/lib/validators';
import { ApiError } from '@supabase/supabase-js';

import { RegisterInfo } from '@/store/auth/interfaces/RegisterInfo';
import { delayTouch } from '@/utils/helpers';
import { Validations } from '@/utils/validations';
import { PASSWORD_VISIBLE_TIMEOUT } from '@/const/const';
import { LayoutType } from '@/enums/LayoutType';

import AuthForm from '@/components/auth/AuthForm.vue';
import SocialAuth from '@/components/auth/SocialAuth.vue';

const passwordMinLength = 8,
  nameMinLength = 5;

const formData: RegisterInfo = {
  email: '',
  password: '',
  name: '',
};

@Component({
  components: {
    AuthForm,
    SocialAuth,
  },
  layout: LayoutType.SIMPLE,
  head() {
    return {
      titleTemplate: `${this.$t('app_name')} - ${this.$t('register_form.register')}`,
    };
  },
})
export default class Register extends Vue {
  // data
  form = {
    ...formData,
  };

  isBusy = false;
  passwordViewIsToggled = false;
  passwordMinLength = passwordMinLength;
  nameMinLength = nameMinLength;
  errors: string[] = [];

  // validations
  @Validations({
    form: {
      email: {
        required,
        valid: email,
      },
      password: {
        required,
        goodPassword: (password: string) => {
          // password validator
          return (
            password.length >= passwordMinLength &&
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password)
          );
        },
      },
      name: {
        required,
        minLength: minLength(nameMinLength),
        valid: (value: string) => {
          return /^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\\.\s])){1,})(['’\-,\\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\\.\s])){2,})?)*)$/.test(
            value
          );
        },
      },
    },
  })
  get emailValidationField() {
    return this.$v.form?.email;
  }

  get passwordValidationField() {
    return this.$v.form?.password;
  }

  get nameValidationField() {
    return this.$v.form?.name;
  }

  get isValidEmail() {
    return this.$v.form?.email?.$dirty && !this.$v.form.email.$invalid;
  }

  get isValidPassword() {
    return this.$v.form?.password?.$dirty && !this.$v.form.password.$invalid;
  }

  get isValidName() {
    return this.$v.form?.name?.$dirty && !this.$v.form.name.$invalid;
  }

  get sloganMessage(): string {
    return this.$t('register_form.slogan') as string;
  }

  // methods
  delayTouch($v: IValidator | undefined): void {
    return delayTouch($v);
  }

  async submitForm(_evt: Event) {
    this.errors = [];
    this.isBusy = true;
    this.$v.$touch();

    if (!this.$v.$invalid) {
      this.$auth
        .signUp(this.form)
        .then(() => {
          this.$router.push('/login');
          this.isBusy = false;
        })
        .catch((err: ApiError) => {
          if (err.status === 400) {
            switch (err.message) {
              case 'User already registered':
                this.errors.push(this.$t('user_already_registered').toString());
                break;
            }
          }
          this.isBusy = false;
          console.error(err);
        });
    } else {
      this.isBusy = false;
    }
  }

  resetForm() {
    this.errors = [];
    this.form = {
      ...formData,
    };
    this.$nextTick(() => this.$v.$reset());
  }

  showLogin() {
    this.$router.push('/login');
  }

  togglePassword() {
    this.passwordViewIsToggled = !this.passwordViewIsToggled;
  }

  @Watch('passwordViewIsToggled')
  onPasswordViewIsToggled(val: boolean) {
    // make the password visible for 3s only
    if (val) {
      setTimeout(() => {
        this.passwordViewIsToggled = false;
      }, PASSWORD_VISIBLE_TIMEOUT);
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/style.scss';
</style>
