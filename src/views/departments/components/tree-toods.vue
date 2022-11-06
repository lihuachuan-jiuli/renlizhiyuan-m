<!-- eslint-disable vue/require-default-prop -->
<template>

  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%;">

    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>

    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }} </el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 内容 -->
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add" :disabled="!checkPermission('add-dept')"> 添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del"> 删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

</template>

<script>
import { dalDepartments } from '@/api/departments'
export default {
  props: {
    // 定义一个转入的属性
    // eslint-disable-next-line vue/require-default-prop
    treeNode: {
      require: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击编辑 删除 新增时触发
    operateDepts(type) {
      if (type === 'add') {
        // 添加子部门
        // 添加子部门 在当前点击的部门下, 添加子部门  ==> this.treeNode 就是当前点击的部门
        this.$emit('addDepts', this.treeNode) // 触发自定义事件 , 告诉父组件, 显示弹层
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除部门
        this.$confirm('你确定要删除该组织部门吗').then(() => {
          return dalDepartments(this.treeNode.id)
        }).then(() => {
          // 只需要等到成功的时候 调用接口删除了 后端数据变化了, 但是前端没有变化
          this.$emit('delDepts') // 触达自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }

}
</script>

<style>

</style>
