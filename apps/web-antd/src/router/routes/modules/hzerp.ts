import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta:{
      icon:'mdi:home',
      title:'行展财务管理'
    },
    name:'hzerp',
    path:'/',
    children:[
      {
        name:'workbench',
        path:'/hzerp/workbench',
        meta:{
          icon:'mdi:home',
          title:'工作台'
        },
        component: () => import('#/views/hzerp/workbench/index.vue'),
      },
      {
        name:'pendingTasks',
        path:'/hzerp/pendingTasks',
        meta:{
          icon:'mdi:book',
          title:'待办事项'
        },
        children:[
          {
            name:'toReview',
            path:'/hzerp/pendingTasks/toReview',
            meta:{
              icon:'mdi:home',
              title:'待审核',
            },
            component: () => import('#/views/hzerp/pendingTasks/toReview/index.vue'),
          },
          {
            name:'doneReviewed',
            path:'/hzerp/pendingTasks/doneReviewed',
            meta:{
              icon:'mdi:home',
              title:'已审核'
            },
            component: () => import('#/views/hzerp/pendingTasks/doneReviewed/index.vue'),
          },
          {
            name:'toDeal',
            path:'/hzerp/pendingTasks/toDeal',
            meta:{
              icon:'mdi:home',
              title:'待处理'
            },
            component: () => import('#/views/hzerp/pendingTasks/toDeal/index.vue'),
          }
        ]
      },
      {
        name:'receipt',
        path:'/hzerp/receipt',
        meta:{
          icon:'mdi:book',
          title:'单据管理'
        },
        children:[
          {
            name:'reimburse',
            path:'/hzerp/receipt/reimburse',
            meta:{
              icon:'mdi:home',
              title:'报销',
            },
            component: () => import('#/views/hzerp/receipt/reimburse/index.vue'),
          },
          {
            name:'reimburseadd',
            path:'/hzerp/pendingTasks/reimburseadd',
            meta:{
              icon:'mdi:home',
              title:'新增报销',
              hidden:true,
            },
            component: () => import('#/views/hzerp/receipt/reimburse/modules/add.vue'),
          },
        ]
      },
      {
        name:'receiptAccount',
        path:'/hzerp/receiptAccount',
        meta:{
          icon:'mdi:book',
          title:'单据记账管理'
        },
        children:[
          {
            name:'account',
            path:'/hzerp/receiptAccount/account',
            meta:{
              icon:'mdi:home',
              title:'记账列表',
            },
            component: () => import('#/views/hzerp/receiptAccount/index.vue'),
          },
        ]
      }
    ]
  }
];

export default routes;
