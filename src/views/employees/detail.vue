<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="用户名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="个人详情">
            <!-- <UserInfo /> -->
            <!-- vue.js中 内置了一个组件  component 动态组件-->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="UserComponent" />
          </el-tab-pane>

          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components: { UserInfo, JobInfo },
  data() {
    return {
      UserComponent: UserInfo,
      JobComponent: JobInfo,
      userId: this.$route.params.id, // 直接将路由中的参数赋值给data中的属性
      userInfo: 'user-info',
      jobInfo: 'job-info',
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }, { min: 1, max: 6, message: '姓名长度为1-4位', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },

  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    saveUser() {
      // 调用方法时, 应该校验
      this.$refs.userForm.validate().then(async() => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$$message.success('修改用户信息成功')
      })
    }
  }

}
</script>

<style>

</style>
