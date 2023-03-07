<template>
  <a-layout>
    <a-layout-sider width="200" style="background: #fff">
      <!-- <div>nihaoa</div> -->
      <a-menu
        v-model:selectedKeys="selectedKeys"
        style="width: 256px"
        mode="inline"
        :open-keys="openKeys"
        @openChange="onOpenChange"
      >
        <a-sub-menu v-for="(item,index) in level1" :key="index">
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
import { Tool } from "@/util/tool";
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
      initEBookView(); // 初始化数据，显示全部
      handleQueryCategory(); // 得到分类菜单里的所有数据
    });
    // 初始化
    const initEBookView = () => {
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
    };
    // 得到分类菜单里的所有信息
    const level1 = ref(); // 第一级菜单
    const handleQueryCategory = () => {
      axios.get("/category/list").then((resp) => {
        const data = resp.data;
        if (data.success) {
          const categorys = data.content.list;
          level1.value = [];
          level1.value = Tool.array2Tree(categorys, 0);
          console.log("value", level1.value);
        } else {
          message.error(data.message);
        }
      });
    };

    return { ebooks, level1 };
  },
});
</script>
