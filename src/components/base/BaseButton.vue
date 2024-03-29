<template>
  <component :is="tag" :type="tag === 'button' ? nativeType : ''" @click="handleClick" :class="classes">
    <span class="btn-inner--icon" v-if="!iconAfterText && ($slots.icon || (icon && $slots.default))">
      <slot name="icon">
        <i :class="icon"></i>
      </slot>
    </span>
    <i v-if="!$slots.default" :class="icon"></i>
    <span class="btn-inner--text" v-if="$slots.icon || (icon && $slots.default)">
      <slot>
        {{ text }}
      </slot>
    </span>
    <span class="btn-inner--icon" v-if="iconAfterText && ($slots.icon || (icon && $slots.default))">
      <slot name="icon">
        <i :class="icon"></i>
      </slot>
    </span>
    <slot v-if="!$slots.icon && !icon"></slot>
  </component>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BaseButton',
  props: {
    tag: {
      type: String,
      default: 'button',
      description: 'Button tag (default -> button)',
      validator: (val: string) => ['button', 'a', 'input'].includes(val),
    },
    type: {
      type: String,
      default: 'default',
      description: 'Button type (e,g primary, danger etc)',
      validator: (val: string) =>
        ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'link', 'info'].includes(val),
    },
    size: {
      type: String,
      default: '',
      description: 'Button size lg|sm',
      validator: (val: string) => ['', 'lg', 'md', 'sm'].includes(val),
    },
    textColor: {
      type: String,
      default: '',
      description: 'Button text color (e.g primary, danger etc)',
      validator: (val: string) => ['', 'primary', 'default', 'secondary', 'success', 'warning', 'danger'].includes(val),
    },
    nativeType: {
      type: String,
      default: 'button',
      description: 'Button native type (e.g submit,button etc)',
      validator: (val: string) => ['button', 'submit'].includes(val),
    },
    icon: {
      type: String,
      default: '',
      description: 'Button icon',
    },
    text: {
      type: String,
      default: '',
      description: 'Button text in case not provided via default slot',
    },
    outline: {
      type: Boolean,
      default: false,
      description: 'Whether button style is outline',
    },
    rounded: {
      type: Boolean,
      default: false,
      description: 'Whether button style is rounded',
    },
    iconOnly: {
      type: Boolean,
      default: false,
      description: 'Whether button contains only an icon',
    },
    block: {
      type: Boolean,
      default: false,
      description: 'Whether button is of block type',
    },
    iconAfterText: {
      type: Boolean,
      default: false,
      description: 'Whether the icon should be positioned after the text',
    },
  },
  computed: {
    classes(): Object {
      let btnClasses = [
        { 'btn-block': this.block },
        { 'rounded-circle': this.rounded },
        { 'btn-icon-only': this.iconOnly },
        { [`text-${this.textColor}`]: this.textColor },
        { 'btn-icon': this.icon || this.$slots.icon },
        this.type && !this.outline ? `btn-${this.type}` : '',
        this.outline ? `btn-outline-${this.type}` : '',
      ];
      if (this.size) {
        btnClasses.push(`btn-${this.size}`);
      }
      if (this.type !== 'link') {
        btnClasses.push('btn');
      }
      return btnClasses;
    },
  },
  methods: {
    handleClick(evt: Event) {
      this.$emit('click', evt);
    },
  },
});
</script>

<style></style>
