<template>
  <a-layout-header class="header">
    <div class="logo" />
    <a-menu
      v-model:selectedKeys="selectedKeys1"
      theme="dark"
      mode="horizontal"
      :style="{ lineHeight: '64px' }"
    >
      <a-menu-item key="1"><router-link to="/">首页</router-link></a-menu-item>
      <a-menu-item key="2">ro</a-menu-item>
      <a-menu-item key="3">关于我们</a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
    name: 'WiKiHeader',
});
</script>

<style>
</style>