<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <!-- 左侧显示总记录数 -->
        <!-- 方式一: -->
        <!-- <span slot="before">共16条记录</span> -->
        <!-- 方式二: -->
        <template v-slot:before>
          <span slot="before">共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 excel导入 excel导出 新增员工 -->
        <template v-slot:after>
          <el-button size="small" type="success">excel导入</el-button>
          <el-button size="small" type="danger">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-table v-loading="loading" border="" :data="list">
        <!-- 在表格中如何显示序号 -->
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column prop="username" label="姓名" sortable="" />
        <el-table-column prop="workNumber" label="工号" sortable="" />
        <el-table-column prop="formOfEmployment" label="聘用形式" sortable="" :formatter="formatEmployment" />
        <el-table-column prop="departmentName" label="部门" sortable="" />

        <!-- 作用域插槽 + 过滤器 -->
        <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
          <!-- <template slot-scope="obj"></template> -->
          <template v-slot="{row}">
            <!-- 将时间进行格式化 -->
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>

        <el-table-column prop="enableState" label="账户状态" sortable="">
          <template v-slot="{row}">
            <el-switch :value="row.enableState === 2" />
          </template>
        </el-table-column>

        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height:60px">
        <el-pagination
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          layout="prev,pager,next"
          @current-change="changePage"
        />
      </el-row>

    </div>
    <!-- 放置组件弹层 -->
    <!-- sync修饰符 子组件 去改变父组件的数据的语法糖-->
    <add-Employee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddEmployee from '@/views/employees/components/add-employee.vue'
export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      list: [], // 接收数组
      page: {
        page: 1,
        size: 10,
        total: 0 // 总数
      },
      loading: false, // 显示遮罩层
      showDialog: false // 默认是弹出层
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage // 赋值最新的页码
      this.getEmployeeList() // 重新拉取数据
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定删除该员工吗')
        // 点击了确定
        await delEmployee(id)

        // 重新拉取数据
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    }

  }

}
</script>

<style>

</style>
