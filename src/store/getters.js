// 快捷访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 将user模块下的token作为快捷方式放出来
  name: state => state.user.userInfo.username, //建立用户名的快捷访问
  userId: state => state.user.userInfo.userId,
}
export default getters
