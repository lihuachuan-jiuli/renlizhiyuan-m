<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容 -->
      <el-card class="tree-card">

        <TreeToods :tree-node="company" :is-root="true" />

        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!--  传入内容 插槽内容  会循环多少次 有多少节点 就循环多少次-->
          <!-- 作用域插槽 slot-scope="obj" -->
          <TreeToods slot-scope="{data}" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeToods from './components/tree-toods.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  components: {
    TreeToods
  },
  data() {
    return {
      company: { name: '四川九离科技有限公司', manager: '九离' }, // 就是头部的数据结构
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        children: 'children', // 表示 从这个属性显示内容
        label: 'name' // 表示重这个属性显示子节点
      }
    }
  },

  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '李华川' }
      // 需要将获取过来的数据转化成树结构 ==== 递归算法
      this.departs = tranListToTreeData(result.depts, '')
      console.log(result)
    }

  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
