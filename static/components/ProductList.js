export default {
    template: `
      <div class="p-5">
      <div v-if="products && products.length > 0">
      
      <h5>Products under this category:</h5>
      <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">ID</th>
      <th scope="col">Name</th>
      <th scope="col">Unit</th>
      <th scope="col">Rate/Unit</th>
      <th scope="col">Quantity</th>
    </tr>
  </thead>
  <tbody>
  
    <tr v-for="product in products" :key="product.id">
        <th scope="row">1</th>
        
        <td>{{ product.id }}</td>
        <td>{{ product.name }}</td>
        <td>{{ product.unit }}</td>
        <td>{{ product.rate_per_unit }}</td>
        <td>
                <span v-if="product.quantity > 0">{{ product.quantity }}</span>
                <span v-else>Out of Stock</span>
        </td>
        <td><button v-if="role=='man'" class="btn btn-danger" @click="deleteProduct(product.id)">Delete</button></td>
        <td><button v-if="role=='man'" class="btn btn-secondary" @click="updateProduct(product.id)">Update</button></td>
        <td><button class="btn btn-outline-primary gap-3" data-bs-toggle="modal" data-bs-target="#cartModal" v-if="role === 'user' && product.quantity > 0" @click="orderDetail(product.id)"> ADD to cart <i class="fa fa-cart-plus"></i> </button></td>
        
        </tr>
  </tbody>
</table>
        <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header" >
          
              <h1 class="modal-title fs-5" id="cartModalLabel">Details</h1>
            </div>
            <div >
            </br>
            <h6 class="p-1">PRODUCT NAME :  {{ selectedProduct ? selectedProduct.name : '' }}</h6>
            <h6 class="p-1">UNIT :  {{ selectedProduct ? selectedProduct.unit : '' }}</h6>
            <h6 class="p-1">RATE/UNIT :  {{ selectedProduct ? selectedProduct.rate_per_unit : '' }}</h6>
           
            </div>
            <div class="modal-body" >
            
                 
                  <div>
                  <label for="message-text" class="col-form-label">Enter Quantity</label>
                  <input class="form-control" id="quantity_selected"></input>
                </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" v-if="role === 'user'" @click="addToCart">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
        <h1>No products available under this category !!</h1>
    </div>
      </div>
    `,
    props: ["product"],
    data() {
      return {
        role: localStorage.getItem("role"),
        authToken: localStorage.getItem("auth-token"),
        user_id:localStorage.getItem("user_id"),
        selectedProduct:null,
        categoryId:null,
        productId:null,
        products: [] // Initialize products array to hold products related to the category
      };
    },
    async created() {
        
      await this.fetchProducts();
    },
    methods: {
      async fetchProducts() {
        try {
        const categoryId = this.$route.params.id;
        this.categoryId=categoryId
        // console.log(categoryId)
          const res = await fetch(`/category/${categoryId}/products`, {
            headers: {
              "Authentication-Token": this.authToken
            }
          });
          const data = await res.json();
          if (res.ok) {
            this.products = data.products; // Assuming the response contains a 'products' array
            
            
        } else {
            console.error("Failed to fetch products:", data.message);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },
      async deleteProduct(productId){
        const res = await fetch(`/product/${productId}/delete`, {
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
    updateProduct(productId) {
        this.$router.push(`/edit-product/${productId}`)
       },
       async orderDetail(productId) {
        this.productId = productId;
        console.log(this.categoryId);
        console.log(productId);
        try {
          const res = await fetch(`/api/product/${productId}`, {
            headers: {
              'Authentication-Token': this.authToken,
            },
          });
  
          if (res.ok) {
            const data = await res.json();
            this.selectedProduct = data; // Save the selected product details
            console.log(this.selectedProduct);
          } else {
            console.error('Failed to fetch product details');
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      },
      async addToCart(){
        const quantity = document.getElementById('quantity_selected').value
        const categoryId = this.$route.params.id;

        const res = await fetch('/api/cart/add', {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.authToken,
                      },
                      
                      body: JSON.stringify({
                                  user_id: this.user_id,
                                  category_id: categoryId,
                                  product_id: this.productId,
                                  quantity: parseInt(quantity), // Parse input value to an integer
                                }),
      });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            console.log('quantity in frontend 2:', quantity);
            this.$router.push('/')
          } else {
            alert('Failed to add items');
          }
    
    },
}
}