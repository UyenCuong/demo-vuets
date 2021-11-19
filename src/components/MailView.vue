<template>
  <div class="email-display">
    <div>
      <a-button @click="toggleArchive">{{
        email.archived ? "Move to Inbox" : "Archive"
      }}</a-button>
      <a-button @click="toggleRead">{{
        email.read ? "Mark Unread" : "Mark Read"
      }}</a-button>
      <a-button @click="goNewer">Newer</a-button>
      <a-button @click="goOlder">Older</a-button>
    </div>
    <h2 class="mb-0">
      Subject: <strong>{{ email.subject }}</strong>
    </h2>
    <div>
      <em
        >From {{ email.from }} on
        {{ format(new Date(email.sentAt), "MMM do yyyy") }}
      </em>
    </div>
    <div v-html="marked(email.body)" />
  </div>
</template>

<script lang="ts">
import { format } from "date-fns";
import marked from "marked";
import axios from "axios";
import { ref } from "vue";
export default {
  props: {
    email: {
      type: Object,
      required: true,
    },
  },
  setup(props: any, { emit }: any) {
    const email = ref<any>(props.email);
    // const toggleRead = () => {
    //   email.value.read = !email.value.read;
    //   axios.put(`http://localhost:3000/emails/${email.value.id}`, email);
    // };
    // const toggleArchive = () => {
    //   email.value.archived = !email.value.archived;
    //   axios.put(`http://localhost:3000/emails/${email.value.id}`, email);
    // };
    const toggleRead = () => {
      emit("changeEmail", { toggleRead: true, save: true });
    };
    const toggleArchive = () => {
      emit("changeEmail", {
        toggleArchive: true,
        save: true,
        closeModal: true,
      });
    };
    const goNewer = () => {
      emit("changeEmail", { changeIndex: -1 });
    };
    const goOlder = () => {
      emit("changeEmail", { changeIndex: 1 });
    };
    const goNewerAndArchive = () => {
      emit("changeEmail", { changeIndex: -1, toggleArchive: true, save: true });
    };
    const goOlderAndArchive = () => {
      emit("changeEmail", { changeIndex: 1, toggleArchive: true, save: true });
    };
    return {
      format,
      marked,
      toggleRead,
      toggleArchive,
      goNewer,
      goOlder,
      goNewerAndArchive,
      goOlderAndArchive,
    };
  },
};
</script>

<style scoped></style>
