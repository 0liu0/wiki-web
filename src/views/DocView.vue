<template>
  <a-layout-content
    :style="{
      background: '#fff',
      padding: '24px',
      margin: 0,
      minHeight: '280px',
    }"
  >
    <h1>欢迎来到帅帅的网站</h1>
    <h3 v-if="!isShow">对不起，相关连接已失效</h3>
    <a-row :gutter="24" v-if="isShow">
      <a-col :span="6">
        <a-tree
          class="draggable-tree"
          draggable
          block-node
          :tree-data="level1"
          :fieldNames="{ title: 'name', key: 'id' }"
          @dragenter="onDragEnter"
          @drop="onDrop"
          @select="checkHandle"
          v-model:selectedKeys="selectedKey"
        />
      </a-col>
      <a-col :span="18">
        <div class="content">
          <div>
            <h2>{{ doc.name }}</h2>
            <div>
              <span>阅读数：{{ doc.viewCount }}</span> &nbsp; &nbsp;
              <span>点赞数：{{ doc.voteCount }}</span>
            </div>
            <!-- <a-divider style="height: 2px; background-color: #9999cc" /> -->
          </div>
          <div class="wangeditor" :innerHTML="htmlTxt"></div>
          <div class="vote-div">
            <a-button
              type="primary"
              shape="round"
              :size="'large'"
              @click="vote"
            >
              &nbsp;点赞：{{ doc.voteCount }}
              <template #icon>
                <LikeOutlined />
              </template>
            </a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-layout-content>
</template>

<script lang="ts">
import { Tool } from "@/util/tool";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import axios from "axios";
import { LikeOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "DocView",
  components: {
    LikeOutlined,
  },
  setup() {
    let isShow: any = ref(false);
    let route = useRoute();
    let id = route.query.ebookId; // 得到ebook的id为后面的查询做准备
    const level1: any = ref(); // 树形数组
    let selectedKey = ref(); // 被选中节点的id
    let htmlTxt = ref(); // content界面
    let doc: any = ref(); // 对应doc
    doc.value = {};
    let docContentShow: any = ref(false);
    onMounted(() => {
      handleQuery();
      //   setTimeout(() => {

      //   },100);
    });
    // 初始化数据
    const handleQuery = () => {
      axios.get("/doc/get-one/" + id).then((resp) => {
        const data = resp.data;
        console.log(resp);
        if (data.success) {
          let docs = data.content.list;
          level1.value = [];
          level1.value = Tool.array2Tree(docs, 0);
          console.log("level1@@@", level1.value);
          if (level1.value.length > 0) {
            let firstId = level1.value[0].id;
            getContent(firstId);
            isShow.value = true;
          }
        } else {
          message.error(data.message);
        }
      });
    };

    // 拖动调用的方法
    const onDragEnter = () => {
      console.log("onDragEnter被调用了"); // 正在拖动时调用
    };
    const onDrop = () => {
      console.log("onDrop被调用了"); // 拖动完调用
    };

    // 点击调用
    const checkHandle = () => {
      if (selectedKey.value.length != 0) {
        // 判断有没有选择任何节点，没有选择的话就不发请求
        getContent(selectedKey.value);
      }
    };
    // 得到对应节点的content内容
    const getContent = (contentId: any) => {
      axios.get("/doc/get-content/" + contentId).then((resp) => {
        const data = resp.data;
        if (data.success) {
          htmlTxt.value = data.content;
          console.log(htmlTxt.value);
        } else {
          message.error("网络繁忙，请稍后重试");
        }
      });
      // 获得doc
      axios.get("/doc/get-one-doc/" + contentId).then((resp) => {
        const data = resp.data;
        console.log(resp);
        if (data.success) {
          doc.value = data.content;
          docContentShow = true;
          console.log("doc:", doc.value);
        } else {
          message.error(data.message);
        }
      });
    };
    // 点赞
    const vote = () => {
      axios.get("/doc/vote/" + doc.value.id).then((resp) => {
        const data = resp.data;
        if (data.success) {
          doc.value.voteCount++;
        } else {
          message.error(data.message);
        }
      });
    };

    return {
      level1,
      isShow,
      selectedKey,
      htmlTxt,
      doc,
      docContentShow,

      onDragEnter,
      onDrop,
      checkHandle,
      vote,
    };
  },
});
</script>

<style>
/* wangeditor默认样式, 参照: http://www.wangeditor.com/doc/pages/02-%E5%86%85%E5%AE%B9%E5%A4%84%E7%90%86/03-%E8%8E%B7%E5%8F%96html.html */
/* table 样式 */
.wangeditor table {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
.wangeditor table td,
.wangeditor table th {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 3px 5px;
}
.wangeditor table th {
  border-bottom: 2px solid #ccc;
  text-align: center;
}

/* blockquote 样式 */
.wangeditor blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 5px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
.wangeditor code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}
.wangeditor pre code {
  display: block;
}

/* ul ol 样式 */
.wangeditor ul,
ol {
  margin: 10px 0 10px 20px;
}

/* 和antdv p冲突，覆盖掉 */
.wangeditor blockquote p {
  font-family: "YouYuan";
  margin: 20px 10px !important;
  font-size: 16px !important;
  font-weight: 600;
}

/* 点赞 */
.vote-div {
  padding: 15px;
  text-align: right;
}

/* 图片自适应 */
.wangeditor img {
  max-width: 100%;
  height: auto;
}

/* 视频自适应 */
.wangeditor iframe {
  width: 100%;
  height: 400px;
}
</style>