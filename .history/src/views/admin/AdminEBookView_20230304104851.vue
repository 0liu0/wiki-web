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
        <img class="cover" v-if="cover" :src="cover" alt="avatar" />
      </template>
      <template v-slot:action="{ text, record }">
        <a-space size="small">
          <a-button type="primary" @click="edit"> 编辑 </a-button>
          <a-button type="danger"> 删除 </a-button>
        </a-space>
      </template>
    </a-table>
  </a-layout-content>
  <a-modal
    title="电子书表单"
    v-model:visible="modalVisible"
    :confirm-loading="modalLoading"
    @ok="handleModalOk"
  >
    <p>刘祖彻</p>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
export default defineComponent({
  name: "AdminEBookView",
  setup() {
    const ebooks = ref();
    const pagination = ref({
      current: 1,
      pageSize: 4,
      total: 0,
    });
    const loading = ref(false);
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
        title: "分类一",
        key: "category1Id",
        dataIndex: "category1Id",
      },
      {
        title: "分类二",
        key: "category2Id",
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
    // 数据查询
    const handleQuery = (params: any) => {
      loading.value = true;
      axios
        .get("/ebook/list", {
          params: {
            page: params.page,
            size: params.size,
          },
        })
        .then((resp) => {
          loading.value = false;
          const data = resp.data;
          ebooks.value = data.content.list;
          // 重置分页按钮
          pagination.value.current = params.page;
          pagination.value.total = data.content.total;
        });
    };

    // 控制表单的显现
        const modalLoading = ref(false)
    const modalVisible = ref(false)
    const handleModalOk = () => {
      modalVisible.value = false
      setTimeout(()=> {
        modalVisible.value = false
        modalLoading.value = false
      },2000)
    }
    // 编辑表单
    const edit = () => {
      modalVisible.value = true;
    }

    // 表格点击页码时触发
    const handleTableChange = (pagination: any) => {
      console.log("看看自带的分页参数都有啥:" + pagination);
      handleQuery({
        page: pagination.current,
        size: pagination.pageSize,
      });
    };
    onMounted(() => {
      handleQuery({
        page: 1,
        size: pagination.value.pageSize,
      });
    });
    return {
      columns,
      ebooks,
      pagination,
      loading,
      handleTableChange,
    };
  },
});
</script>

<style scoped>
.cover {
  width: 50px;
  height: 50px;
  border-radius: 8%;
  line-height: 50px;
  margin: 5px 0;
}
</style>