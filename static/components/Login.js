export default {
    template: `
    <div class='d-flex justify-content-center' style="margin-top:25vh">
        <div class="mb-3 p-5 bg-light">
             <div class='text-danger'>{{error}}</div>
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model='cred.email'>
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password">
            <button class="btn btn-primary mt-2" @click="login">Login</button>
            <button class="btn btn-primary mt-2" @click="register">Register</button>
            </div>
        </div>

`,
data(){
    return{
        cred:{
            "email":null,
            "password":null,
        },
        error:null,
    }
   
},
methods:{
    async login(){ //use async because further we are going to use await keyword
        const res=await fetch ('/user-login',{
            method:'POST',
            headers:{
                'Content-Type':"application/json",
            },
            body:JSON.stringify(this.cred), //convert javascript object in json string

        })
        const data=await res.json() //reads the response in json string and pass/convert it to javascript object
        if(res.ok){ //response between 200 & 300
            // console.log(data)
            localStorage.setItem('auth-token',data.token)
            localStorage.setItem('role',data.role)
            localStorage.setItem('user_id',data.user_id)
            
            this.$router.push('/')//based on role render page
        }
        else{
            this.error=data.message
        }
    },
    
    register() {
        this.$router.push(`/register`)
       },
}
}