<template>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in emails"
        :key="email.id"
        class="clickable"
        :class="{ read: email.read }"
        @click="listItem(email)"
      >
        <td>
          <a-checkbox></a-checkbox>
        </td>
        <td>{{ email.from }}</td>
        <td>
          <p>
            <strong> {{ email.subject }} </strong> -{{ email.bode }}
          </p>
        </td>
        <td class="date">
          {{ format(new Date(email.sentAt), "MMM do yyyy") }}
        </td>
        <td><Button @click="listArchived(email)">Archive</Button></td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { format } from "date-fns";
import axios from "axios";
import MailView from '@/components/MailView.vue';
export default {
  async setup() {
    const { data: emails } = await axios.get("http://localhost:3000/emails");

    const listItem = (email: any) => {
      email.read = !email.read;
      console.log(email.read);
    };
    const listArchived = (email: any) => {
      email.archived = !email.archived;
      console.log(email.archived);
    };
    // const sortedEmail = computed(() => {
    // return sortedEmail.email.sort(item1, item2)=>{
    //   return item1.sentAt <item2.sentAt  ? 1 : -1
    // }
    // })
    // const unarchivedEmails = computed(() => {

    // });

    return {
      format,
      emails: ref(emails),
      listItem,
      listArchived,
      // sortedEmail,
      // unarchivedEmails
    };
  },
};
</script>

<style></style>
