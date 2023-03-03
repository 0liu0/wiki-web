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
        <img v-if="cover" :src="cover" alt="avatar">
      </template>

      <template >
            
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a>
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'tags'">
          <span>
            <a-tag
              v-for="tag in record.tags"
              :key="tag"
              :color="
                tag === 'loser'
                  ? 'volcano'
                  : tag.length > 5
                  ? 'geekblue'
                  : 'green'
              "
            >
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a>Invite 一 {{ record.name }}</a>
            <a-divider type="vertical" />
            <a>Delete</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link">
              More actions
              <down-outlined />
            </a>
          </span>
        </template>
      </template>
    </a-table>
  </a-layout-content>
</template>

<script lang="ts">
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { defineComponent } from "vue";
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

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

export default defineComponent({
  components: {
    SmileOutlined,
    DownOutlined,
  },
  setup() {
    return {
      data,
      columns,
    };
  },
});
</script>

<style>
</style>