<template>
  <!-- Sign In Form -->
  <AuthForm :slogan="sloganMessage">
    <div class="text-center mb-3">
      <Title heading="h2">
        {{ $t('sign_in_label', { appName: $t('app_name') }) }}
      </Title>
    </div>
    <div class="card bg-secondary shadow border-0">
      <div class="card-header bg-white pb-4">
        <div class="text-muted text-center mb-3">
          <h6>{{ $t('sign_in_with') }}</h6>
        </div>
        <SocialAuth :action="'sign_up'" @auth:action="resetForm" />
      </div>

      <div class="card-body px-lg-5 py-lg-4">
        <div class="text-center text-muted mb-3">
          <div class="divider">
            <span>{{ $t('or') }}</span>
          </div>
        </div>

        <form id="login-form" role="form" class="mt-4 px-4" @submit.prevent="submitForm">
          <!-- username or email field -->
          <div class="form-group mb-3">
            <label for="inputUsername">{{ $t('username_or_email') }}</label>
            <input
              v-model="form.username"
              name="inputUsername"
              type="text"
              class="form-control"
              :class="{
                'is-valid': isValidUsername,
                'is-invalid': usernameValidationField.$dirty && !isValidUsername,
              }"
              @input="delayTouch(usernameValidationField)"
            />
            <div v-if="usernameValidationField.$invalid" class="error">
              <span v-if="usernameValidationField.$dirty && !usernameValidationField.required">
                <BaseFormInputError>{{ $t('messages.please_enter_username_or_email') }}</BaseFormInputError>
              </span>
              <span v-else-if="usernameValidationField.$dirty && !usernameValidationField.valid">
                <BaseFormInputError>{{ $t('messages.invalid_username_or_email') }}</BaseFormInputError>
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
                'is-invalid': passwordValidationField.$dirty && !isValidPassword,
              }"
              @input="delayTouch(passwordValidationField)"
            />
            <i
              class="fa password-eye"
              :class="!passwordViewIsToggled ? 'fa-eye' : 'fa-eye-slash'"
              v-show="form.password.length > 0 && !isIeOrEdge"
              @click="togglePassword"
            ></i>
            <div v-if="passwordValidationField.$invalid" class="error">
              <span v-if="passwordValidationField.$dirty && !passwordValidationField.required">
                <BaseFormInputError>{{ $t('messages.please_enter_password') }}</BaseFormInputError>
              </span>
            </div>
          </div>

          <!-- the error from server will be displayed here !-->
          <BaseFormInputError v-if="error">{{ error }}</BaseFormInputError>

          <div class="form-group d-flex justify-content-between">
            <div class="custom-control custom-control-alternative custom-checkbox">
              <input id="remember-me" type="checkbox" class="custom-control-input" v-model="form.rememberMe" />
              <label for="remember-me" class="custom-control-label">
                <span>{{ $t('remember_me') }}</span>
              </label>
            </div>
            <div class="forgot-password">
              <BaseButton tag="a" type="link" class="font-bold text-sm align-right" href="/reset-password">{{
                $t('forgot_password')
              }}</BaseButton>
            </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary px-5 mt-3" :disabled="isBusy">
              {{ $t('sign_in') }}
            </button>
          </div>
          <hr class="mt-6" />
          <div class="flex justify-center pt-0">
            <span>
              {{ $t('not_registered_yet') }}
              <a class="link" @click="showRegister">{{ $t('join_us') }}</a>
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
import { required, or, email } from 'vuelidate/lib/validators';

import { LoginInfo } from '~/interfaces/LoginInfo';
import { delayTouch, getBrowserAgent } from '~/utils/helpers';
import { Validations } from '~/utils/validations';
import { usernameValidator } from '~/utils/validators';

import AuthForm from '~/components/AuthForm.vue';
import SocialAuth from '~/components/SocialAuth.vue';
import { ApiError } from '~/utils/apiError';
import { PASSWORD_VISIBLE_TIMEOUT } from '~/const/const';
import { LayoutType } from '~/enums/LayoutType';
import { eventBus } from '~/utils/eventBus';
import { Events } from '~/const/events';
import { ErrorReasons } from '~/enums/ErrorReasons';
import { loginRedirect } from '~/utils/loginRedirect';

const formData: LoginInfo = {
  username: '',
  password: '',
  rememberMe: false,
};

@Component({
  components: {
    AuthForm,
    SocialAuth,
  },
  layout: LayoutType.SIMPLE,
  head() {
    return {
      titleTemplate: `${this.$t('app_name')} - ${this.$t('sign_in')}`,
    };
  },
})
export default class Login extends Vue {
  // data
  form = {
    ...formData,
  };
  isBusy = false;
  passwordViewIsToggled = false;
  error: string = null;

  // validations
  @Validations({
    form: {
      username: {
        required,
        valid: or(usernameValidator, email),
      },
      password: {
        required,
      },
    },
  })

  // computed props
  get usernameValidationField() {
    return this.$v.form.username;
  }

  get passwordValidationField() {
    return this.$v.form.password;
  }

  get isValidUsername() {
    return this.$v.form.username.$dirty && !this.$v.form.username.$invalid;
  }

  get isValidPassword() {
    return this.$v.form.password.$dirty && !this.$v.form.password.$invalid;
  }

  get sloganMessage() {
    return this.$t('login_slogan') as string;
  }

  get isIeOrEdge() {
    const agent = getBrowserAgent();
    return agent === 'edge' || agent === 'chromium based edge (dev or canary)' || agent === 'ie';
  }

  // methods
  delayTouch($v: IValidator) {
    return delayTouch($v);
  }

  async submitForm(_evt: Event) {
    this.$v.$touch();
    this.error = '';
    this.isBusy = true;
    if (!this.$v.$invalid) {
      this.$auth
        .login(this.form)
        .then(() => {
          this.isBusy = false;

          loginRedirect(this);
          setTimeout(
            () => eventBus.$emit(Events.GLOBAL_SHOW_SUCCESS, this.$t('welcome', { appName: this.$t('app_name') })),
            200
          );
        })
        .catch((err: ApiError) => {
          if (err.errorCode === 400 && err.details.reason === ErrorReasons.INVALID_CREDENTIALS) {
            this.error = this.$t('messages.invalid_credentials').toString();
          }
          this.isBusy = false;
        });
    } else {
      this.isBusy = false;
    }
  }

  resetForm() {
    this.error = '';
    this.form = {
      ...formData,
    };
    this.$nextTick(() => this.$v.$reset());
  }

  showRegister() {
    this.$router.push('/register');
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
