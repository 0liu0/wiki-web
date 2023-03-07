<template>
  <a-layout>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        style="width: 256px"
        mode="inline"
        :open-keys="openKeys"
        @openChange="onOpenChange"
      >
        <!-- <div>
          nihaoa
        </div> -->
        <a-sub-menu key="sub1">
          <template #icon>
            <MailOutlined />
          </template>
          <template #title>Navigation One</template>
          <a-menu-item key="1">Option 1</a-menu-item>
          <a-menu-item key="2">Option 2</a-menu-item>
          <a-menu-item key="3">Option 3</a-menu-item>
          <a-menu-item key="4">Option 4</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        minHeight: '280px',
      }"
    >
      <WiKiList :ebooks="ebooks" />
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import WiKiList from "@/components/WiKiList.vue";
import { message, Pagination } from "ant-design-vue";
export default defineComponent({
  name: "HomeView",
  components: {
    WiKiList,
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
  },
  setup() {
    const ebooks = ref();
    onMounted(() => {
      console.log("onmouted");
      axios
        .get("/ebook/list", {
          params: {
            page: 1,
            size: 1000,
          },
        })
        .then((resp) => {
          const data = resp.data;
          if (data.success) {
            ebooks.value = resp.data.content.list;
            // 重置分页按钮
          } else {
            message.error(data.message);
          }
        });
    });
    return { ebooks };
  },
});
</script>
