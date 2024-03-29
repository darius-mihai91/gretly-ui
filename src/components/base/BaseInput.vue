<template>
  <div
    class="form-group"
    :class="[
      { 'input-group': hasIcon },
      { 'has-danger': error },
      { focused: focused },
      { 'input-group-alternative': alternative },
      { 'has-label': label || $slots.label },
      { 'has-success': valid === true },
      { 'has-danger': valid === false },
    ]"
  >
    <slot name="label">
      <label v-if="label" :class="labelClasses">
        {{ label }}
        <span v-if="required">*</span>
      </label>
    </slot>

    <div v-if="addonLeftIcon || $slots.addonLeft" class="input-group-prepend">
      <span class="input-group-text">
        <slot name="addonLeft">
          <i :class="addonLeftIcon"></i>
        </slot>
      </span>
    </div>
    <slot v-bind="slotData">
      <input
        :value="value"
        :type="type"
        v-on="listeners"
        v-bind="$attrs"
        class="form-control"
        :class="[{ 'is-valid': valid === true }, { 'is-invalid': valid === false }, inputClasses]"
        aria-describedby="addon-right addon-left"
      />
    </slot>
    <div v-if="addonRightIcon || $slots.addonRight" class="input-group-append">
      <span class="input-group-text">
        <slot name="addonRight">
          <i :class="addonRightIcon"></i>
        </slot>
      </span>
    </div>
    <slot name="infoBlock"></slot>
    <slot name="helpBlock">
      <div class="text-danger invalid-feedback" style="display: block" :class="{ 'mt-2': hasIcon }" v-if="error">
        {{ error }}
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  inheritAttrs: false,
  name: 'BaseInput',
  props: {
    required: {
      type: Boolean,
      description: 'Whether input is required (adds an asterisk *)',
      default: false,
    },
    valid: {
      type: Boolean,
      description: 'Whether is valid',
      default: undefined,
    },
    alternative: {
      type: Boolean,
      description: 'Whether input is of alternative layout',
      default: false,
    },
    label: {
      type: String,
      description: 'Input label (text before input)',
    },
    error: {
      type: String,
      description: 'Input error (below input)',
      default: '',
    },
    labelClasses: {
      type: String,
      description: 'Input label css classes',
      default: '',
    },
    inputClasses: {
      type: String,
      description: 'Input css classes',
      default: '',
    },
    value: {
      type: [String, Number],
      description: 'Input value',
      default: '',
    },
    addonRightIcon: {
      type: String,
      description: 'Addon right icon',
      default: '',
    },
    addonLeftIcon: {
      type: String,
      description: 'Addon left icon',
      default: '',
    },
    type: {
      type: String,
      description: 'The input of the input(default="text")',
      default: 'Text',
      validator: (type: string) => ['text', 'email', 'date', 'number', 'time', 'search', 'file'].includes(type),
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  computed: {
    listeners(): Object {
      return {
        ...this.$listeners,
        input: this.updateValue,
        focus: this.onFocus,
        blur: this.onBlur,
      };
    },
    slotData(): Object {
      return {
        focused: this.focused,
        ...this.listeners,
      };
    },
    hasIcon(): boolean {
      const { addonRight, addonLeft } = this.$slots;
      return (
        addonRight !== undefined ||
        addonLeft !== undefined ||
        this.addonRightIcon !== undefined ||
        this.addonLeftIcon !== undefined
      );
    },
  },
  methods: {
    updateValue(evt: Event) {
      let value = evt.target['value'];
      this.$emit('input', value);
    },
    onFocus(value: boolean) {
      this.focused = true;
      this.$emit('focus', value);
    },
    onBlur(value: boolean) {
      this.focused = false;
      this.$emit('blur', value);
    },
  },
});
</script>

<style></style>
