import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import { hasBtnPermission } from './utils/permission'
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';
import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';

import * as echarts from 'echarts'
// import MavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// import MarkdownItMermaid from '@liradb2000/markdown-it-mermaid'
// import mermaidPlugin from 'markdown-it-mermaid-plugin'
// import markdownItMermaid from 'markdown-it-mermaid'
// import 'mermaid'
// import mermaid from 'mermaid'
// mermaid.initialize({startOnload:false})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

VMdPreview.use(createMermaidPlugin())
VMdPreview.use(createKatexPlugin())
VMdPreview.use(createTodoListPlugin())
VueMarkdownEditor.use(githubTheme, {Hljs: hljs,})
VueMarkdownEditor.use(createMermaidPlugin())
VueMarkdownEditor.use(createKatexPlugin())
VueMarkdownEditor.use(createTodoListPlugin())
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(VueMarkdownEditor)
Vue.use(VMdPreview)
// Vue.use(MavonEditor)
// const md = MavonEditor.mavonEditor.getMarkdownIt()
// MavonEditor.mavonEditor.getMarkdownIt().use(MarkdownItMermaid);

// md.use(markdownItMermaid)
// md.use(mermaidPlugin)
// md.use(MarkdownItMermaid,{
//   startOnLoad: false,
//   securityLevel: true,
//   theme: "default",
//   flowchart:{
//     htmlLabels: false,
//     useMaxWidth: true,
//   },
//   dictionary:{
//     token: "mermaid",
//     graph:"graph",
//     sequenceDiagram: "sequenceDiagram",
//   }})
// Vue.use(VueMavonEditor)
// const md = VueMavonEditor.mavonEditor.getMarkdownIt()
// markdownIt.use(markdownItMermaid)
// md.use(markdownItMermaid)
// md.set({ breaks: false });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// Vue.use(MarkdownItVue)
Vue.config.productionTip = false

Vue.prototype.hasPerm = hasBtnPermission
Vue.prototype.$echarts = echarts



new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
