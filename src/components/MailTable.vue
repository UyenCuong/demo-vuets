<template>
  <!-- <a-checkbox
    v-model:checked="checkAll"
    :indeterminate="indeterminate"
    @change="onCheckAllChange"
    >checkall</a-checkbox
  > -->
  <input type="checkbox" v-model="allSelected" @click="CheckAll" />
  <p>CheckAll</p>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
      >
        <td>
          <input type="checkbox" v-model="email.comleted" @change="hasSelect" />
          <!-- <a-checkbox @change="onCheckChange" v-model="checkedList" /> -->
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
import { ref, computed, reactive, toRefs, watch } from "vue";
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
    // const plainOptions = ref(false);
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
    // const state = reactive({
    //   indeterminate: true,
    //   checkAll: false,
    //   checkedList: [],
    // });
    // const onCheckAllChange = (e: any) => {
    //   Object.assign(state, {
    //     checkedList: e.target.checked ? plainOptions : [],
    //     indeterminate: false,
    //   });
    // };
    // const onCheckChange = (e: any, item: any) => {
    //   if (e.target.checked) {
    //     plainOptions.value.push(item);
    //   }
    //   console.log(plainOptions.value, "plainOptions");
    // };
    // const onCheckChange = () => {
    //   const count = countCheck();
    //   if (count === emails.length) {
    //     plainOptions.value = true;
    //   } else {
    //     plainOptions.value = false;
    //   }
    //   // console.log(plainOptions.value, "plainOptions");
    // };
    // const countCheck = () => {
    //   let count = 0;
    //   emails.forEach((item: any) => {
    //     if (item.comleted) {
    //       count += 1;
    //     }
    //   });
    //   return count;
    // };
    const allSelected = ref(false);
    const CheckAll = () => {
      allSelected.value = !allSelected.value;
      if (allSelected.value) {
        emails.forEach((item: any) => {
          if (!item.comleted) {
            item.comleted = true;
          }
        });
      } else {
        emails.forEach((item: any) => {
          if (item.comleted) {
            item.comleted = false;
          }
        });
      }
    };
    const hasSelect = () => {
      const count = countCheck()
      if (count === emails.length) {
        allSelected.value = true
      } else {
        allSelected.value = false
      }
    }
    const countCheck = () => {
      let count = 0
      emails.forEach((item:any) => {
        if (item.comleted) {
          count += 1
        }
      })
      return count
    }
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
      // onCheckAllChange,
      // ...toRefs(state),
      // onCheckChange,
      hasSelect,
      CheckAll,
      allSelected,
    };
  },
};
</script>

<style>
.ant-checkbox-inner {
  top: -10px;
}
</style>
