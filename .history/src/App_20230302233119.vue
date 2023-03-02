<template>
  <a-layout id="components-layout-demo-top-side-2">
    <router-view/>
  </a-layout>
</template>

<script lang="ts">
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import { Header } from "ant-design-vue/lib/layout/layout";
import WiKiHeader from "./components/WiKiHeader.vue";
import WiKiFooter from "./components/WiKiFooter.vue";
export default defineComponent({
  components: {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    WiKiHeader,

  },
  setup() {
    return {
      selectedKeys1: ref<string[]>(["2"]),
      selectedKeys2: ref<string[]>(["1"]),
      collapsed: ref<boolean>(false),
      openKeys: ref<string[]>(["sub1"]),
    };
  },
});
</script>

<style>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
