<template>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in sortedEmails"
        :key="email.id"
        class="clickable"
        :class="{ read: email.read }"
        @click="actionEmail(email)"
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
        <td><Button @click="archivedEmail(email)">Archive</Button></td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { format } from "date-fns";
import axios from "axios";

export default {
  async setup() {
    const { data: emails } = await axios.get("http://localhost:3000/emails");

    const actionEmail = (email: any) => {
      email.read = !email.read;
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
      console.log(email.read);
    };
    const archivedEmail = (email: any) => {
      email.archived = !email.archived;
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    };
    const sortedEmails = computed(() => {
      return emails.sort((item1: any, item2: any) => {
        return item1.sentAt < item2.sentAt ? 1 : -1;
      });
    });
    const unarchivedEmails = computed(() => {
      return emails.sortedEmails.filter((item: any) => !item.archived);
    });

    return {
      format,
      emails: ref(emails),
      actionEmail,
      archivedEmail,
      sortedEmails,
      unarchivedEmails,
    };
  },
};
</script>

<style></style>
