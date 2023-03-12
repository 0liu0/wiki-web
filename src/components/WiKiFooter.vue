<template>
  <a-layout-footer style="text-align: center"> @甲蛙电子书{{user.name}} </a-layout-footer>
</template>

<script>
import store from "@/store";
import { computed, defineComponent, ref } from "vue";
export default defineComponent({
    name:'WiKiFooter',
    setup() {
      let user = computed(()=> store.state.user) // 计算属性检测store里面的值如果有更改就赋值给user
      return {user}
    }
});
</script>

<style>
</style>