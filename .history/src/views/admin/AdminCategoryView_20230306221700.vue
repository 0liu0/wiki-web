<template>
  <a-layout-content
    :style="{
      background: '#fff',
      padding: '24px',
      margin: 0,
      minHeight: '280px',
    }"
  >
    <a-space :size="small">
      <a-input-search
        v-model:value="value"
        placeholder="input search text"
        enter-button
        @search="onSearch(value)"
      />
      <a-button type="primary" @click="add"> 新增 </a-button>
    </a-space>
    <a-table
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="categorys"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #cover="{ text: cover }">
        <img class="cover" v-if="cover" :src="cover" alt="avatar" />
      </template>
      <template v-slot:action="{ text, record }">
        <a-space size="small">
          <a-button type="primary" @click="edit(record)"> 编辑 </a-button>
          <a-button type="danger">
            <a-popconfirm
              title="确认删除这本书吗?"
              ok-text="是的"
              cancel-text="我再想想"
              @confirm="confirm(record.id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
          </a-button>
        </a-space>
      </template>
    </a-table>
  </a-layout-content>
  <a-modal
    title="分类表单"
    v-model:visible="modalVisible"
    :confirm-loading="modalLoading"
    @ok="handleOk"
    :mask="true"
  >
    <a-form :model="category" :labelCol="{ span: 6 }">
      <a-form-item label="名称">
        <a-input v-model:value="category.name" />
      </a-form-item>
      <a-form-item label="父分类">
        <a-input v-model:value="category.parent" />
      </a-form-item>
      <a-form-item label="顺序">
        <a-input v-model:value="category.sort" />
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import {Tool} from '@/util/tool';
export default defineComponent({
  name: "AdminCategoryView",
  setup() {
    const value = ref();
    const categorys = ref();
    const pagination = ref({
      current: 1,
      pageSize: 4,
      total: 0,
    });
    const loading = ref(false);
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "父分类",
        key: "parent",
        dataIndex: "parent",
      },
      {
        title: "顺序",
        dataIndex: "sort",
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
        .get("/category/list", {
          params: {
            page: params.page,
            size: params.size,
          },
        })
        .then((resp) => {
          loading.value = false;
          const data = resp.data;
          if (data.success) {
            categorys.value = data.content.list;
            // 重置分页按钮
            pagination.value.current = params.page;
            pagination.value.total = data.content.total;
          } else {
            message.error(data.message);
          }
        });
    };

    // 控制表单的显现
    const modalLoading = ref(false);
    const modalVisible = ref(false);
    const category = ref({});
    const handleOk = () => {
      modalVisible.value = true;
      modalLoading.value = true;
      axios.post("/category/save", category.value).then((resp) => {
        const data = resp.data;
        if (data.success) {
          modalVisible.value = false;
          modalLoading.value = false;
          message.success("操作成功！");
          // 重新加载列表
          handleQuery({
            page: pagination.value.current,
            size: pagination.value.pageSize,
          });
        } else {
          modalVisible.value = false;
          modalLoading.value = false;
          message.error(data.message);
        }
      });
    };
    // 新增接口
    const add = () => {
      modalVisible.value = true;
      category.value = {};
    };
    // 编辑表单
    const edit = (record: any) => {
      modalVisible.value = true;
      category.value = Tool.copy(record)
    };
    // 删除提示框
    const confirm = (id: any) => {
      axios.delete("/category/delete/" + id).then((resp) => {
        const data = resp.data;
        if (data.success) {
          // 重新加载列表
          handleQuery({
            page: pagination.value.current,
            size: pagination.value.pageSize,
          });
          message.success("删除成功！");
        } else {
          message.info("请稍后再试");
        }
      });
    };

    const cancel = (e: MouseEvent) => {
      console.log(e);
      message.info("已取消");
    };

    // 表格点击页码时触发
    const handleTableChange = (pagination: any) => {
      console.log("看看自带的分页参数都有啥:" + pagination);
      handleQuery({
        page: pagination.current,
        size: pagination.pageSize,
      });
    };
    const onSearch = (value: string) => {
      console.log(value);
      if (value != "") {
        let obj = {
          name: value,
          page: pagination.value.current,
          size: pagination.value.pageSize,
        };
        axios.get("/category/list", { params: obj }).then((resp) => {
          const data = resp.data;
          if (data.success&&data.content.total!=0) {
            categorys.value = data.content.list;
            pagination.value.total = data.content.total
          } else {
            message.error("抱歉，没有取值相对应的名称");
          }
        });
      } else {
        handleQuery({
          page: 1,
          size: pagination.value.pageSize,
        });
      }
    };
    onMounted(() => {
      handleQuery({
        page: 1,
        size: pagination.value.pageSize,
      });
    });
    return {
      columns,
      categorys,
      pagination,
      loading,
      value,
      onSearch,
      handleTableChange,
      edit,
      add,
      cancel,
      confirm,
      modalVisible,
      modalLoading,
      handleOk,
      category,
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