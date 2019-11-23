<template>
  <div>
    <headertit title="搜索" />
    <!-- 搜索框加按钮 -->
    <el-input placeholder="请搜索关键词" prefix-icon="el-icon-search" v-model="keyword"></el-input>
    <el-button class="searchbtn" @click="search">搜索</el-button>
    <!-- 数据 -->
    <ul>
      <li v-for="(item) in agentlisttwo" :key="item.id">
        <p>{{item.userID}}</p>
        <p>{{item.agentnum}}</p>
        <p>{{item.username}}</p>
        <p>{{item.phone}}</p>
      </li>
    </ul>
  </div>
</template>
 
 <script>
export default {
  data() {
    return {
      keyword: "", //搜索关键词
      agentlisttwo: "", //搜索重定义数组
    };
  },

  // 创建完成时
  created() {
    //重定义数组
    this.agentlisttwo = this.agentlist;
  },

  methods: {
    search() {
      //搜索
      var keyword = this.keyword;
      if (keyword) {
        this.agentlisttwo = this.agentlist.filter(function(agentlist) {
          return Object.keys(agentlist).some(function(key) {
            return (
              String(agentlist[key])
                .toLowerCase()
                .indexOf(keyword) > -1
            );
          });
        });
      } else {
        this.agentlisttwo = this.agentlist;
      }
    }
  }
};
</script>

<style scoped>
p {
  width: 300px;
  height: 30px;
  line-height: 30px;
  border: 1px solid black;
  text-align: center;
}
.p1 {
  color: red;
}
</style>