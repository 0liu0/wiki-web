<template>
  <a-layout-content
    :style="{
      background: '#fff',
      padding: '24px',
      margin: 0,
      minHeight: '280px',
    }"
  >
    <a-table
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="ebooks"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #cover="{ text: cover }">
        <img v-if="cover" :src="cover" alt="avatar" />
      </template>
      <template v-slot:action="{ text, record }">
        <a-space size="small">
          <a-button type="primary"> 编辑 </a-button>
          <a-button type="danger"> 删除 </a-button>
        </a-space>
      </template>
    </a-table>
  </a-layout-content>
</template>

<script lang="ts">
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "AdminEBookView",
  setup() {
    const ebooks = ref()
    const pagination
    const columns = [
      {
        title: "封面",
        dataIndex: "cover",
        slots: { customRender: "cover" },
      },
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "分类",
        slots: { customRender: "category" },
      },
      {
        title: "文档数",
        dataIndex: "docCount",
      },
      {
        title: "阅读数",
        dataIndex: "viewCount",
      },
      {
        title: "点赞数",
        dataIndex: "voteCount",
      },
      {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
      },
    ];
    return {
      data,
      columns,
    };
  },
});
</script>

<style>
</style>