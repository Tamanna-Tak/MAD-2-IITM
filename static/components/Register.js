export default {
    template: `
    <div class='d-flex justify-content-center' style="margin-top:25vh">
        <div class="mb-3 p-5 bg-light">
             <div class='text-danger'>{{error}}</div>
             <label for="username" class="form-label">UserName</label>
             <input type="text" class="form-control" id="username"  v-model='cred.username'>
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model='cred.email'>
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password">
            <label for="user-role" class="form-label">User Role</label>
            <input type="role" class="form-control" id="user-role" placeholder="man OR user" v-model='cred.role'>
            <button class="btn btn-primary mt-2" @click="register">Register</button>

            </div>
        </div>

`,
data(){
    return{
        cred:{
            "username":null,
            "email":null,
            "password":null,
            "role":null,
        },
        error:null,
    }
   
},
methods:{
    // Inside your Vue component's methods
async register() {
    try {
        const res = await fetch('/user-register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.cred),
        });
        const data = await res.json();

        if (res.ok) {
            console.log(data)
            // localStorage.setItem('auth-token', data.token);
            this.$router.push('/login');
        } else {
            throw new Error(data.message); // Throw an error with the received message
        }
    } catch (error) {
        this.error = error.message; // Update the error message in case of an error
    }
},


}
}


// export default {
//     template: `
//       <div class="login-box">
//         <br>
//         <h1>New User</h1>
//         <div>
//           <div>
//             <label>Username</label><br>
//             <input v-model="user_name" type="text" placeholder="Enter Username" required />
//             <p v-if="usernameExists" class="error-message">Username already exists. Please choose another username.</p>
//           </div>
//           <div>
//             <label>Email</label><br>
//             <input v-model="user_email" type="text" placeholder="Enter Email" required />
//             <p v-if="emailExists" class="error-message">Email already exists. Please use another email.</p>
//           </div>
//           <div>
//             <label>Password</label><br>
//             <input v-model="user_password" type="password" placeholder="Enter password" required />
//           </div>
//           <div>
//             <label>Role</label><br>
//             <input v-model="user_role" type="text" placeholder="Enter user role" required />
//           </div>
//           <br><br>
//           <button @click="registerUser">Register</button>
//         </div>
//       </div>
//     `,
//     data() {
//       return {
//         user_name: '',
//         user_email: '',
//         user_password: '',
//         user_role: '', // Added role field
//         usernameExists: false,
//         emailExists: false,
//         // Other data properties
//       };
//     },
//     methods: {
//       async registerUser() {
//         try {
//           const userData = {
//             username: this.user_name,
//             email: this.user_email,
//             password: this.user_password,
//             role: this.user_role // Pass the role to the server
//           };
  
//           const res = await fetch('/user-register', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(userData),
//           });
  
//           const data = await res.json();
  
//           if (res.ok) {
//             // Handle successful registration response
//             console.log('User registered successfully!', data);
//             // Redirect or perform other actions as needed
//           } else {
//             throw new Error(data.message);
//           }
//         } catch (error) {
//           console.error('Registration failed:', error);
//           // Handle error scenarios and display appropriate messages
//         }
//       },
//       // Other methods
//     },
//     // Other component options
//   };
  