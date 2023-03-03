<template>
  <div id="wikilist">
    <a-list
      item-layout="vertical"
      size="large"
      :data-source="ebooks"
      :grid="{ gutter: 20, column: 3 }"
    >
      <template #renderItem="{ item }">
        <a-list-item key="item.name">
          <template #actions>
            <span v-for="{ type, text } in actions" :key="type">
              <component :is="type" style="margin-right: 8px" />
              {{ text }}
            </span>
          </template>
          <a-list-item-meta :description="item.description">
            <template #title>
              <a :href="item.href">{{ item.name }}</a>
            </template>
            <template #avatar><a-avatar :src="item.cover" /></template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts">
import {
  StarOutlined,
  LikeOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "WiKiList",
  props:['ebooks'],
  components: {
    StarOutlined,
    LikeOutlined,
    MessageOutlined,
  },
  setup() {
    console.log("@");
    const actions: Record<string, string>[] = [
      { type: "StarOutlined", text: "156" },
      { type: "LikeOutlined", text: "156" },
      { type: "MessageOutlined", text: "2" },
    ];
    return {
      listData,
      actions,
    };
  },
});
</script>

<style scoped>
#wikilist {
  /* width: 100px;
    height: 100px;
    background-color: #444; */
}
</style>