<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容 -->
      <el-card class="tree-card">

        <TreeToods :tree-node="company" :is-root="true" @addDepts="addDept" />

        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!--  传入内容 插槽内容  会循环多少次 有多少节点 就循环多少次-->
          <!-- 作用域插槽 slot-scope="obj" -->
          <TreeToods slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDept" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹出层 -->
    <addDept :show-dialog="showDialog" :tree-node="node" @addDepts="getDepartments" />

  </div>
</template>

<script>
import TreeToods from './components/tree-toods.vue'
import addDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'

export default {
  components: {
    TreeToods,
    addDept
  },
  data() {
    return {
      company: { name: '四川九离科技有限公司', manager: '九离' }, // 就是头部的数据结构
      departs: [],
      defaultProps: {
        children: 'children', // 表示 从这个属性显示内容
        label: 'name' // 表示重这个属性显示子节点
      },
      showDialog: false, // 默认不显示弹出层
      node: null // 记录当前点击的node 节点
    }
  },

  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      // this.company = { name: result.companyName, manager: '' }
      // 需要将获取过来的数据转化成树结构 ==== 递归算法
      this.departs = tranListToTreeData(result.depts, '')
      this.company = { name: '四川九离科技有限公司', manager: '九离', id: '' }
      console.log(result)
    },

    // 监听tree-tools中触发的点击添加子部门的事件
    // node 是我们当前点击的部门
    addDept(node) {
      this.showDialog = true // 显示弹层
      this.node = node
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
