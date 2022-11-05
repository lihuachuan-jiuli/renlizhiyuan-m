<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- 多选框组  v-model双向绑定-->
    <el-checkbox-group v-model="roleIds">
      <!-- 要循环的选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 定义 footer的插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      // 用户的Id 当前要处理哪个用户
      type: String,
      default: null,
      require: true // 要求必须传该id
    }
  },
  data() {
    return {
      list: [], // 负责存储当前所有角色Id
      roleIds: [] // 这个数组负责存储 当前用户拥有的角色Id
    }
  },
  created() {
    // 获取所有的角色
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 }) // 默认只取10条数据 角色不会太多
      // rows是循环的记录
      this.list = rows
    },
    // 这个方法是给父组件调用的
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id) // 将用户所拥有的的角色赋值给当前用户的对象
      this.roleIds = roleIds
    },
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 关闭弹层
      // this.$emit('update:showRoleDialog', false)
      this.$parent.showRoleDialog = false
    },
    btnCancel() {
      // 取消
      this.roleIds = []

      this.$emit('update:showRoleDialog', false)
    }
  }

}
</script>

<style>

</style>
