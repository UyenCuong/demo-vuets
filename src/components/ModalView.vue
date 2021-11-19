<template>
  <div class="modal">
    <div class="overlay"></div>
    <div class="modal-card">
      <button
        type="button"
        class="close"
        aria-label="Close"
        @click="emit('closeModal')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {
    return {
      emit,
    };
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  /* display: none; */
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
  display: flex;
}
</style>
