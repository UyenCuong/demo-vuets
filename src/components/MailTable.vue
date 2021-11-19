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
          {{ format(new Date(email.sentAt), "do MMM yyy") }}
        </td>
        <td>
          <Button @click="archiveEmail(email)">Archive</Button>
        </td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="dataDetail" @closeModal="dataDetail = null">
    <MailView :email="dataDetail" @changeEmail="changeEmail" />
  </ModalView>
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
import { format,parseISO } from "date-fns";
import axios from "axios";
import MailView from "@/components/MailView.vue";
import ModalView from "@/components/ModalView.vue";
export default {
  components: {
    MailView,
    ModalView,
  },
  async setup() {
    const { data: emails } = await axios.get("http://localhost:3000/emails");
    const dataDetail = ref();
    const openEmail = (email: any) => {
      email.read = true;
      dataDetail.value = email;
      emails.updateEmail(email);
    };
    const archiveEmail = (email: any) => {
      email.archived = true;
      dataDetail.value.updateEmail(email);
    };
    const updateEmail = (email: any) => {
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    };
    const changeEmail = ({
      toggleRead,
      toggleArchive,
      save,
      closeModal,
      changeIndex,
    }: {
      toggleRead: any;
      toggleArchive: any;
      save: any;
      closeModal: any;
      changeIndex: any;
    }) => {
      const email = dataDetail.value;
      if (toggleRead) {
        email.read = !email.read;
      }
      if (toggleArchive) {
        email.archived = !email.archived;
      }
      if (save) {
        emails.updateEmail(email);
      }
      if (closeModal) {
        dataDetail.value = null;
      }
      if (changeIndex) {
        let emails = dataDetail.value.unarchivedEmails;
        let currentIndex = emails.indexOf(dataDetail.value);
        let newEmail = emails[currentIndex + changeIndex];
        dataDetail.value(newEmail);
      }
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
      parseISO,
      emails: ref(emails),
      openEmail,
      dataDetail,
      archiveEmail,
      sortedEmails,
      unarchivedEmails,
      updateEmail,
      changeEmail,
    };
  },
};
</script>

<style>
.ant-checkbox-inner {
  top: -10px;
}
</style>
