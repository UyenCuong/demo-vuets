<template>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
        @click="openEmail(email)"
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
        <td><Button @click="archiveEmail(email)">Archive</Button></td>
      </tr>
    </tbody>
  </table>
  <div v-if="openedEmail">
    {{ emails.openedEmail.subject }}
  </div>
</template>

<script lang="ts">
interface Email {
  id: number;
  from: string;
  subject: string;
  body: string;
  sentAt: string;
  archived: boolean;
  read: boolean;
}
import { ref, computed } from "vue";
import { format } from "date-fns";
import axios from "axios";

export default {
  async setup() {
    const { data: emails } = await axios.get("http://localhost:3000/emails");

    const openEmail = (email: any) => {
      email.read = true;
      emails.openedEmail = email;
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
      console.log(emails.openedEmail.subject);
    };
    const archiveEmail = (email: any) => {
      email.archived = true;
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    };
    const sortedEmails = computed(() => {
      return emails.sort((item1: any, item2: any) => {
        return item1.sentAt < item2.sentAt ? 1 : -1;
      });
    });
    const unarchivedEmails = computed(() => {
      return sortedEmails.value.filter((item: any) => !item.archived);
    });

    return {
      format,
      emails: ref(emails),
      openEmail,
      openedEmail: ref(null),
      archiveEmail,
      sortedEmails,
      unarchivedEmails,
    };
  },
};
</script>

<style></style>
