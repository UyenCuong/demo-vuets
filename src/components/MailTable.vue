<template>
  <div class="bulk-action-bar">
    <span class="checkbox">
      <input type="checkbox" v-model="allSelected" @click="CheckAll" />
    </span>
    <span class="buttons">
      <button @click="markRead()">Mark Read</button>
      <button>Mark Unread</button>
      <button>Archive</button>
    </span>
  </div>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
      >
        <td>
          <input type="checkbox" v-model="email.comleted" @change="hasSelect" />
        </td>
        <td @click="openEmail(email)">{{ email.from }}</td>
        <td @click="openEmail(email)">
          <p>
            <strong> {{ email.subject }} </strong> -{{ email.bode }}
          </p>
        </td>
        <td class="date" @click="openEmail(email)">
          {{ format(new Date(email.sentAt), "do MMM yyy") }}
        </td>
        <td>
          <a-button @click="archiveEmail(email)">Archive</a-button>
        </td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="dataDetail" @closeModal="closeModalView">
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
  comleted: boolean;
}
import { ref, computed } from "vue";
import { format, parseISO } from "date-fns";
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
    const closeModalView = () => {
      dataDetail.value = null;
    };
    const openEmail = (email: any) => {
      dataDetail.value = email;
      if (email) {
        email.read = true;
        updateEmail(email);
      }
    };
    const archiveEmail = (email: any) => {
      email.archived = true;
      updateEmail(email);
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
        updateEmail(email);
      }
      if (closeModal) {
        dataDetail.value = null;
      }
      if (changeIndex) {
        const emails = unarchivedEmails.value;
        // const currentIndex = emails.indexOf(dataDetail);
        const currentIndex = emails
          .map(function (item: any) {
            return item.id;
          })
          .indexOf(dataDetail.value.id);
        console.log(currentIndex, "hdhdk");
        const newEmail = emails[currentIndex + changeIndex];
        openEmail(newEmail);
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

    const allSelected = ref(false);
    const CheckAll = () => {
      allSelected.value = !allSelected.value;
      if (allSelected.value) {
        unarchivedEmails.value.forEach((item: any) => {
          if (!item.comleted) {
            item.comleted = true;
          }
        });
      } else {
        unarchivedEmails.value.forEach((item: any) => {
          if (item.comleted) {
            item.comleted = false;
          }
        });
      }
    };
    const hasSelect = () => {
      const count = countCheck();
      if (count === unarchivedEmails.value.length) {
        allSelected.value = true;
      } else {
        allSelected.value = false;
      }
    };
    const countCheck = () => {
      let count = 0;
      unarchivedEmails.value.forEach((item: any) => {
        if (item.comleted) {
          count += 1;
        }
      });
      return count;
    };
    const markRead = () => {
      emails.forEach((email: any) => {
        if (email.comleted === true) {
          email.read = true;
        }
        axios.put(`http://localhost:3000/emails/${email.id}`, email);
      });
    };

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
      closeModalView,
      hasSelect,
      CheckAll,
      allSelected,
      markRead,
    };
  },
};
</script>

<style>
.ant-checkbox-inner {
  top: -10px;
}
</style>
