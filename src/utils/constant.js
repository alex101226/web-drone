const Login = require("@/pages/user/login/index.jsx");
globalThis.CONSTANTS = {
  THEME: [
    {label: '浅色', mode: 'light', color: '#fff'},
    {label: '蓝色', mode: 'blue', color: '#376fd0'},
    // {label: '暗色', mode: 'dark', color: '#233044'},
  ],
  CURRENT_SYSTEM: ['hashrate', 'car', 'project', 'user', 'origin'],
  MAP_AK: '777W5OPtOvfQCtNaRwvcJZ2tXoFJ1h4Y',
  MAP_STYLE_ID: 'b28706738ee88f2cf1bd8d31c4d1be74',
  BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://122.51.216.157',
  STATIC_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://122.51.216.157',
  LOGO_TITLE: '越泰科技',
  SYSTEM_NAME: '低空经济管理系统',
  SYSTEM_LOGO: require('../assets/images/logo-1.svg'),
  //  https://1072558463339856.appflow.aliyunnest.com/webhook/home/b271bff129da247a59cfcb099ddc6ee574a135b05884a311439ec738477491ef919008c041108265f3/index
  SERVICE_URL: 'http://yzluck.cn/webhook/home/b271bff129da247a59cfcb099ddc6ee574a135b05884a311439ec738477491ef919008c041108265f3/index',
};
