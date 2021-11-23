<template>
  <!-- <div :style="{ borderBottom: '1px solid #E9E9E9' }">
    <a-checkbox
      v-model:checked="checkAll"
      :indeterminate="indeterminate"
      @change="onCheckAllChange"
    >
      Check all
    </a-checkbox>
  </div> -->
  <a-checkbox />
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({
      indeterminate: true,
      checkAll: false,
      checkedList: [],
    });

    const onCheckAllChange = (e: any) => {
      Object.assign(state, {
        indeterminate: false,
      });
    };

    return {
      ...toRefs(state),
      onCheckAllChange,
    };
  },
});
</script>
