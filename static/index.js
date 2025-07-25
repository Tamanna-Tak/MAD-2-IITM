import router from './router.js'
import Navbar from './components/Navbar.js'
// const isAuthenticated=localStorage.getItem('auth-token')?true: false

// router.beforeEach((to, from, next) => {
//     if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//     else next()
//   })

new Vue({
    el: '#app', //vue instance is mounted to id=app
    template: `<div>
    <Navbar :key="has_changed"/> 
    <router-view class="m-3"/></div>`,
    router,
    components:{
        Navbar,//local component
    },
    data:{
        has_changed:true,
    },
    watch:{    //so that no need to refresh page for seeng changes in navbar
        $route(to,from){
            this.has_changed=!this.has_changed
        },
    }

})