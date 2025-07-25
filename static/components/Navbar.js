export default{
  template:`
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
<div class="container-fluid">
  <a class="navbar-brand" href="#">Grocery Store</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item">
        <router-link class="nav-link active" aria-current="page"to="/">Home</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link active" aria-current="page"to="/login">Login</router-link>
      </li>
      <li class="nav-item" v-if="role=='admin'">
        <router-link class="nav-link" to="/users">Users</router-link>
      </li>
      <li class="nav-item" v-if="role === 'admin' || role === 'man'">
      <router-link class="nav-link" to="/create-category">Create Category</router-link>
    </li>
    <li class="nav-item" v-if="role === 'man'">
      <router-link class="nav-link" to="/create-product">Create Product</router-link>
    </li>
    <li class="nav-item" v-if="role === 'user'">
    <router-link class="nav-link" to="/cart">Cart</router-link>
  </li>
  <li class="nav-item" v-if="role === 'user' || role ==='man'">
  <router-link class="nav-link" to="/search">Search</router-link>
</li>
      <li class="nav-item" v-if="is_login"> 
      <span class="nav-link" @click='logout'>Logout</span>
    </li>
    </ul>
  </div>
</div>
</nav>`,
data(){
  return{
    role:localStorage.getItem('role'),
    is_login:localStorage.getItem('auth-token'),
}
},
methods:{
  logout(){
    localStorage.removeItem('auth-token')
    localStorage.removeItem('role')
    this.$router.push('/login')
  }
}
}