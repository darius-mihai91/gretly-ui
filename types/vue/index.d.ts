import { Vue } from 'vue/types/vue';

import './umd';

export default Vue;

export { CreateElement, VueConstructor } from 'vue/types/vue';

export {
  Component,
  AsyncComponent,
  ComponentOptions,
  FunctionalComponentOptions,
  RenderContext,
  PropType,
  PropOptions,
  ComputedOptions,
  WatchHandler,
  WatchOptions,
  WatchOptionsWithHandler,
  DirectiveFunction,
  DirectiveOptions,
} from 'vue/types/options';

export { PluginFunction, PluginObject } from 'vue/types/plugin';

export {
  VNodeChildren,
  VNodeChildrenArrayContents,
  VNode,
  VNodeComponentOptions,
  VNodeData,
  VNodeDirective,
} from 'vue/types/vnode';
