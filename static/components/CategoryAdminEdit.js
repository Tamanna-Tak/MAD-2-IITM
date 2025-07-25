export default {
    template: `<div>
    <input type="text" placeholder="name" v-model="name"/>
    <input type="text" placeholder="description" v-model="description"/>
    <button @click="updateCategory">Update Category</button>
    </div>`,
    data() {
        return {
          name: '',
          description: '',
          token: localStorage.getItem('auth-token')
        };
      },
      methods: {
        async updateCategory() {
          const categoryId = this.$route.params.id; // Get category ID from route params
          const url = `/admin/category/${categoryId}/edit`;
    
          const res = await fetch(url, {
            method: 'PUT',
            headers: {
              'Authentication-Token': this.token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: this.name,
              description: this.description
            })
          });
    
          const data = await res.json();
          if (res.ok) {
            alert(data.message);
            
            this.$router.push('/')
          } else {
            alert('Failed to update category');
          }
        }
      }
}