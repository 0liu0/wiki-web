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
            <span>
                <component v-bind:is="'FileOutlined'" style="margin-right: 8px" />
                {{ item.docCount }}
              </span>
              <span>
                <component v-bind:is="'UserOutlined'" style="margin-right: 8px" />
                {{ item.viewCount }}
              </span>
              <span>
                <component v-bind:is="'LikeOutlined'" style="margin-right: 8px" />
                {{ item.voteCount }}
              </span>
          </template>
          <a-list-item-meta :description="item.description">
            <template #title>
              <router-link :to="`/doc?ebookId=${item.id}`">{{ item.name }}</router-link>
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
  FileOutlined,
  LikeOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "WiKiList",
  props:['ebooks'],
  components: {
    FileOutlined,
    LikeOutlined,
    UserOutlined
  },
  setup() {
    return {
    };
  },
});
</script>

<style scoped>
.ant-avatar {
    width: 50px;
    height: 50px;
    border-radius: 8%;
    line-height: 50px;
    margin: 5px 0;
}
</style>