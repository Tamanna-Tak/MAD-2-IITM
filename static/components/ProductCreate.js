

export default {
  template: `
  <div class='d-flex justify-content-center' style="margin-top:25vh">
    <div class="mb-3 p-5 bg-light">
      <label>Product Name:</label>
      <input type="text" placeholder="name" v-model="resource.name"/>
      <br><br>
      <label>Unit:</label>
      <input type="text" placeholder="unit" v-model="resource.unit"/>
      <br><br>
      <label>Rate/Unit:</label>
      <input type="number" placeholder="rate per unit" v-model="resource.rate_per_unit"/>
      <br><br>
      <label>Quantity</label>
      <input type="number" placeholder="quantity" v-model="resource.quantity"/>
      <br><br>
     <label>Category_Name</label>
      <select v-model="resource.category_id">
      {{resource.category_id}}
        <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
        </option>
      </select>
      <br><br>
      <button @click="createProduct">Create Product</button>
    </div>
  </div>
  `,
  data() {
    return {
      resource: {
        name: null,
        unit: null,
        rate_per_unit: null,
        quantity: null,
        category_id: null // New property to store selected category ID
      },
      token: localStorage.getItem('auth-token'),
      categories: [] // Array to store categories fetched from API
    };
  },
  async created() {
    await this.fetchCategories(); // Fetch categories when the component is created
  },
  methods: {
    async fetchCategories() {
      
        const res = await fetch('/api/section', {
          headers: {
            'Authentication-Token': this.token,
            "Content-Type":"application/json",
          },
        });
        const data = await res.json();
        console.log('API Response:', data); // Check response data in console
        if (res.ok) {

             this.categories = data.filter(category => category.is_approved); // Assuming data is an array of categories
            
        } else {
          console.error('Request failed with status:', res.status);
        }
      
    },
    async createProduct() {
      try {
        this.resource.category_id = parseInt(this.resource.category_id); 
        console.log(this.resource.category_id)
        const res = await fetch('/api/product', {
          method: 'POST',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.resource)
        });
        const data = await res.json();
        console.log("data",data)
        console.log("this.resource",this.resource)
        if (res.ok) {
          alert(data.message);
          this.$router.push('/')

        }
      } catch (error) {
        console.error('Error creating product:', error);
      }
    }
  }
};
