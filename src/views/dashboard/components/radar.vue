<template>
  <!-- 雷达图组件  必须给高和宽-->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// 完整加载过程
// const echarts = require('echarts')
const echarts = require('echarts/lib/echarts') // 引入echarts主模块
require('echarts/lib/chart/radar') // 引入雷达图
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  // 页面渲染完毕之后
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv)
    // 绘制图表
    myChart.setOption({
      title: {
        text: 'Basic Radar Chart'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        // 每个区域的最高值
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [34, 29, 32, 17, 43, 60],
              name: '张三'
            },
            {
              value: [80, 70, 60, 90, 100, 87],
              name: '李四'
            }
          ]
        }
      ]
    })
  }

}
</script>

<style scoped>
.radar-echart {
  width: 600px;
  height: 400px;
}

</style>
