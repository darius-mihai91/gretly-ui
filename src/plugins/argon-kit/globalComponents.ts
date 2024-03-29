import Badge from '@/components/base/Badge.vue';
import BaseAlert from '@/components/base/BaseAlert.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCheckbox from '@/components/base/BaseCheckbox.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseDropdown from '@/components/base/BaseDropdown.vue';
import BaseNav from '@/components/base/BaseNav.vue';
import BasePagination from '@/components/base/BasePagination.vue';
import BaseProgress from '@/components/base/BaseProgress.vue';
import BaseRadio from '@/components/base/BaseRadio.vue';
import BaseSlider from '@/components/base/BaseSlider.vue';
import BaseSwitch from '@/components/base/BaseSwitch.vue';
import CloseButton from '@/components/base/CloseButton.vue';
import Card from '@/components/base/Card.vue';
import Icon from '@/components/base/Icon.vue';
import Modal from '@/components/base/Modal.vue';
import FormInputError from '@/components/base/FormInputError.vue';

export default {
  install(Vue) {
    Vue.component(Badge.name, Badge);
    Vue.component(BaseAlert.name, BaseAlert);
    Vue.component(BaseButton.name, BaseButton);
    Vue.component(BaseInput.name, BaseInput);
    Vue.component(BaseDropdown.name, BaseDropdown);
    Vue.component(BaseCheckbox.name, BaseCheckbox);
    Vue.component(BasePagination.name, BasePagination);
    Vue.component(BaseProgress.name, BaseProgress);
    Vue.component(BaseRadio.name, BaseRadio);
    Vue.component(BaseSlider.name, BaseSlider);
    Vue.component(BaseSwitch.name, BaseSwitch);
    Vue.component(BaseNav.name, BaseNav);
    Vue.component(CloseButton.name, CloseButton);
    Vue.component(Card.name, Card);
    Vue.component(Icon.name, Icon);
    Vue.component(Modal.name, Modal);
    Vue.component(FormInputError.name, FormInputError);
  },
};
