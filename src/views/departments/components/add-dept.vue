<template>
  <!-- 放置弹出组件 -->
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单数据  label-width设置标题的宽度 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native 修饰符, 可以找到原生元素事件 -->
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 建立选项 -->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>

    <!-- 确定和取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click.native="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click.native="btnOk">确认</el-button>
      </el-col>
    </el-row>

  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }

  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // value 是部门名称 要去和同级部门下的部门去比较, 有没有相同的 不能过/ 没有就可以过
      const { depts } = await getDepartments()

      // 去找同级部门下 有没有和value相同的数据
      // 找到所有的子部门
      let isRepeat = false
      if (this.fromDate.id) {
        // 有id就是编辑模式
        // 编辑的数据, 在数据库里有!!! 同级部门下 我的名字不能和其他的同级部门的名字进行重复
        // 首先要找到我的同级部门 this.fromDate.id 就是当前的id 我的pid是 this.fromDate.pid
        debugger
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 没有就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      // 如果isRepeat 为true 表示 找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式下
        // 要就是不能有一样的code
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式下
        isRepeat = depts.some(item => item.code === value && value)
      }
      // 要求编码 和所有的部门编码都不能重复, 由于历史数据有可能没有Code 所以说致力加一个强制性条件 就是value 值不能为空

      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}了`)) : callback()
    }
    return {
      // 定义一个表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 校验规则 {key : 数组}
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, {
            trigger: 'blur', validator: checkNameRepeat
          }],

        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, {
            trigger: 'blur', validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },

  methods: {

    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },

    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      // 因为我们是父组件调用子组件的方法, 先设置了 node 数据 直接调用方法
      // props 传值是异步的
    },

    btnOk() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          // 判断现在是编辑还是新增
          if (this.fromDate) {
            // 编辑
            await updateDepartments(this.fromDate)
          } else {
            // 将 ID 设成我们的 pid
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 表单校验通过

          // 告诉父组件 更新数据
          this.$emit('addDepts') // 触发一个自定义事件
          // 关闭弹层 此时应该去修改 showDialog 值
          // update: props名称
          this.$emit('update:showDialog', false)
          // this.$emit('delBtn', false)
        }
      })
    },

    btnCancel() {
      // 重置数据
      this.fromDate = {
        name: '',
        code: '',
        manger: '',
        introduce: ''

      }
      // 关闭弹层
      this.$emit('delBtn', false)
      //  清除之前的校验
      // resetFields() 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      // 只能重置 定义在data中的数据
      this.$refs.deptForm.resetFields()
    }

  }

}
</script>

<style>

</style>
