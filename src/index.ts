import { createApp, h } from 'vue'
import App from './components/App.vue'
import AppIcon from './components/AppIcon.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
export default function registerVueModule (plugins: any, modules: any = []) {
  const app = createApp({
    render () {
      return (
        h(App)
      )
    }
  })
  modules.map((Module: any) => new Module().install(app))
  app.component('app-icon', AppIcon)
  Object.values(plugins).forEach((plugin: any) => app.use(plugin))
  app.mount('#app')
}
