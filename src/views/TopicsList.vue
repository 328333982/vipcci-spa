<template>
  <div>
    <div style="margin:0.5em">
      <Button type="warning" style="50%" size="default" @click="add_app">
        <h4>+ 添加新软件</h4>
      </Button>
      <Input
        size="default"
        v-model="search_content"
        style="width:20em;margin-left:3em"
        search
        @on-search="search"
        placeholder="搜索软件"
      />
    </div>

    <Table :loading="loading" :columns="columns" :data="data1"></Table>
    <Page
      :total="topicTotal"
      :current="pageNum"
      :page-size="10"
      show-elevator
      show-total
      placement="top"
      @on-change="handlePage"
    ></Page>
  </div>
</template>
<script>
export default {
  data() {
    return {
      topicTotal: 100,
      pageNum: 1,
      loading: false,
      search_content: "",
      columns: [
        {
          title: "唯一ID号",
          key: "id",
          width: 90
        },
        {
          title: "标题",
          key: "title"
        },
        {
          title: "关键词",
          key: "keywords"
        },
        {
          title: "分类",
          key: "category_name"
        },
        {
          title: "描述",
          key: "description"
        },
        {
          title: "下载量",
          key: "download"
        },
        {
          title: "最后更新时间",
          key: "updated_at"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.edit(params.index);
                    }
                  }
                },
                "编辑"
              ),

              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data1: []
    };
  },
  mounted() {
    axios.get("http://vipcci.test/api/topics?page=1").then(response => {
      this.data1 = response.data.data;
      this.topicTotal = response.data.meta.pagination.total;
      this.pageNum = response.data.meta.pagination.current_page;
      this.pageSize = response.data.meta.pagination.per_page;
    });
  },
  methods: {
    handlePage(index) {
      if (this.search_content != "") {
        axios
          .get("http://vipcci.test/api/topic_search/"+this.search_content+"?page=" + index)
          .then(response => {
            this.data1 = response.data.data;
            this.topicTotal = response.data.meta.pagination.total;
            this.pageNum = response.data.meta.pagination.current_page;
            this.pageSize = response.data.meta.pagination.per_page;
          });
      } else {
        axios
          .get("http://vipcci.test/api/topics?page=" + index)
          .then(response => {
            this.data1 = response.data.data;
            this.topicTotal = response.data.meta.pagination.total;
            this.pageNum = response.data.meta.pagination.current_page;
            this.pageSize = response.data.meta.pagination.per_page;
          });
      }
    },
    edit(index) {
      // console.log(this.data1[index]['id'])
      this.$router.push({
        name: "edit",
        params: { id: this.data1[index]["id"] }
      });
    },
    remove(index) {
      // console.log(index);
      axios
        .delete("http://vipcci.test/api/topic_delete/" + this.data1[index].id)
        .then(response => {
          this.$Message.success({
            content: "删除成功",
            duration: 3
          });
          // console.log(response.data);
        });
      this.data1.splice(index, 1);
    },
    add_app() {
      this.$router.push({
        name: "new-app"
      });
    },
    search() {
      if (this.search_content != "") {
        axios
          .get("http://vipcci.test/api/topic_search/" + this.search_content)
          .then(response => {
            this.data1 = response.data.data;
            this.topicTotal = response.data.meta.pagination.total;
            this.pageNum = response.data.meta.pagination.current_page;
            this.pageSize = response.data.meta.pagination.per_page;
          });
      }
    }
  }
};
</script>
