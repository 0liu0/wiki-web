<template>
  <a-layout-content
    :style="{
      background: '#fff',
      padding: '24px',
      margin: 0,
      minHeight: '280px',
    }"
  >
    <a-table :columns="columns" :data-source="data" :pagination="">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>
            <smile-outlined />
            封面
          </span>
        </template>
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

<script>
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { defineComponent } from "vue";
const columns = [
  {
    name: "封面",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "名称",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "分类一",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "分类二",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "文档数",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "阅读数",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "点赞数",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "Action",
    key: "action",
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
  }
];

export default defineComponent({
  name: "AdminEBookView",
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