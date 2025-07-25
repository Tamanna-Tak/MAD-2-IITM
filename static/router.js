import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Users from './components/Users.js'
import CategoryForm from './components/CategoryForm.js'
import CategoryEdit from './components/CategoryEdit.js'
import CategoryAdminEdit from './components/CategoryAdminEdit.js'
import ProductCreate from './components/ProductCreate.js'
import ProductList from './components/ProductList.js'
import ProductEdit from './components/ProductEdit.js'
import Cart from './components/Cart.js'
import Search from './components/Search.js'

const routes=[
    { path:'/', component: Home },
    { path:'/login', component: Login , name:'Login'},
    { path:'/register', component: Register},
    { path:'/users', component:Users},
    {path:'/create-category',component:CategoryForm},
    {path:'/edit-category/:id',component:CategoryEdit},
    {path:'/admin/edit-category/:id',component:CategoryAdminEdit},
   { path:'/create-product',component:ProductCreate},
   { path:'/product-list/:id',component:ProductList},
   {path:'/edit-product/:id', component:ProductEdit},
   {path:'/cart',component:Cart},
   {path:'/search',component:Search}
   
]

export default new VueRouter({
    routes,
})