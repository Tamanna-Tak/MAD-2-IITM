//display the info about created study resource
export default{
    template:`<div class="p-2">
    <h5 style="colour:red">{{category.id}}</h5>
    <h4>{{category.name}}</h4>
    <p>{{category.description}}</p>

    <div v-if="!role=='user'">Creator:  {{category.creator}}</div>
    <button v-if="!category.is_approved && role=='admin'" class="btn btn-success" @click='approveCategory'>Approve</button>
    <button v-if="category.is_approved && role == 'man'" class="btn btn-danger" @click="requestCategoryDeletion">Delete request</button>
    <button v-if="role == 'admin'" class="btn btn-danger" @click="deleteCategory">Delete Category</button>
    <button v-if="category.is_approved && role === 'man' && !category.edit_requested" class="btn btn-warning" @click="requestEdit">Request Edit</button>
    <button v-if="category.is_approved && role == 'admin' &&  !category.is_approved_edit " class="btn btn-info" @click="approveEdit">Approve Edit</button>
    <button v-if="category.is_approved && role === 'man' && !category.edit_requested && category.is_approved_edit" @click="editPage">Edit</button>
    <button v-if="category.is_approved && role == 'admin'" class="btn btn-secondary" @click="editbyadmin">Update</button>
    <button v-if="category.is_approved && role=='man' || role=='user' " @click="product_list">Products</button>
    </br></br></br>
    </div>`,
    
    

    
    props:["category"],
    data(){
    return{
        role:localStorage.getItem('role'),
        authToken:localStorage.getItem('auth-token'),
        categories: [], // Your categories data
      editingCategoryId: null,
    }
},
methods:{
    async approveCategory(){
        const res =await fetch(`/category/${this.category.id}/approve`,{
            headers:{
                'Authentication-Token':this.authToken,
            }
        })
        const data=await res.json()
        if(res.ok){
            alert(data.message)
            this.$router.go(0)//refresh the page
        }
    else{
        alert(data.message)
      }

    },
    async requestCategoryDeletion() {
        const res = await fetch(`/category/${this.category.id}/request_delete`, {

            headers: {
                'Authentication-Token': this.authToken,
            }
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            this.$router.go(0); // Refresh the page
        } else {
            alert(data.message);
        }
    },
    async deleteCategory() {
        const res = await fetch(`/category/${this.category.id}/delete`, {
            method: 'GET',
            headers: {
                'Authentication-Token': this.authToken,
            }
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            this.$router.go(0); // Refresh the page
        } else {
            alert(data.message);
        }
    },
    async requestEdit() {
        try {
            const res = await fetch(`/category/${this.category.id}/edit_request`, {
                method: 'PUT',  // Use the appropriate HTTP method (PUT, POST, etc.)
                headers: {
                    'Authentication-Token': this.authToken,
                }
            });
    
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                this.$router.go(0); // Refresh the page
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error, show appropriate message, or perform actions as needed
        }
    },
    async approveEdit() {
        const res = await fetch(`/category/${this.category.id}/approve_edit`, {
            method: 'PUT',
            headers: {
                'Authentication-Token': this.authToken,
            }
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            this.$router.go(0); // Refresh the page
        } else {
            alert(data.message);
        }
    },
    editPage() {
       this.$router.push(`/edit-category/${this.category.id}`)
      },
      editbyadmin() {
        this.$router.push(`/admin/edit-category/${this.category.id}`)
    },
    product_list(){
        this.$router.push(`/product-list/${this.category.id}`)
        // console.log(this.category.id);
    }

},

}