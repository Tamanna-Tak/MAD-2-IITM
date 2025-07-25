export default{
template:`<div>
<div>
<h3 style="color:DarkBlue"><u>Search Products by Category</u></h3>
<label >Category_Name</label>
<select v-model="category_id">
  {{ category_id }}
  <option v-for="category in categories" :key="category.id" :value="category.id">
    {{ category.name }}
  </option>
</select>
<button class="btn btn-primary" @click="searchByCategory">Search</button>

<div class="p-5">
     
    <h5>Search Results</h5>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Unit</th>
          <th scope="col">Rate/Unit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in categorySearchResults" :key="product.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ product.name }}</td>
          <td>{{ product.unit }}</td>
          <td>{{ product.rate_per_unit }}</td>
        </tr>
      </tbody>
    </table>
</div>
</div>
<hr style="border-top: 5px dotted red">
<div>
  <h3 style="color:DarkBlue"><u>Search Products by Price</u></h3>
  <label for="minPrice">Minimum Price:</label>
  <input type="number" id="minPrice" v-model="minPrice">

  <label for="maxPrice">Maximum Price:</label>
  <input type="number" id="maxPrice" v-model="maxPrice">

  <button class="btn btn-primary" @click="searchByPriceRange">Search</button>

  <div class="p-5">
    <h5>Search Results</h5>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Unit</th>
          <th scope="col">Rate/Unit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in priceSearchResults" :key="product.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ product.name }}</td>
          <td>{{ product.unit }}</td>
          <td>{{ product.rate_per_unit }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</div>`,
  data() {
    return {
      minPrice:null,
      maxPrice:null,
      category_id: null, // New property to store selected category ID
      token: localStorage.getItem('auth-token'),
      categories :[],
      categorySearchResults: [], // Holds the search results by category
    priceSearchResults: [],
      searchResults: [], // Holds the search results
      hasSearched: false, // Flag to track if a search has been performed
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
       
          this.categories = data; // Assuming data is an array of categories
          
      } else {
        console.error('Request failed with status:', res.status);
      }
    
  },
    async searchByCategory() {
      try {
        // this.selectedCategory=this.resource.category_id
        console.log(this.category_id)
        const res = await fetch(`/category/${this.category_id}/products`,{
          headers: {
            'Authentication-Token': this.token,
          }
        });
        const data = await res.json();
        if (res.ok) {
          console.log(data)
          this.categorySearchResults = data.products;
          this.hasSearched = true;
        } else {
          console.error('Failed to fetch products by category:', response.statusText);
          
        }
      } catch (error) {
        console.error('Error fetching products by category:', error);
      }
    },

//     async searchByCategory() {
//   try {
//     const res = await fetch(`/category/${this.category_id}/products`, {
//       headers: {
//         'Authentication-Token': this.token,
//       },
//     });
//     const data = await res.json();
//     if (res.ok) {
//       this.searchResults = data.products;
//       this.hasSearched = true;
//     } else {
//       if (data && data.message) {
//         // Display an alert with the error message
//         alert(data.message);
//       } else {
//         // Display a generic error message
//         alert('Failed to fetch products by category');
//       }
//       console.error('Failed to fetch products by category:', res.statusText);
//     }
//   } catch (error) {
//     console.error('Error fetching products by category:', error);
//   }
// },
    async searchByPriceRange(minPrice, maxPrice) {
      try {
        console.log(this.minPrice)
        console.log(this.maxPrice)
        const response = await fetch(`/product/search/${this.minPrice}/${this.maxPrice}`, {
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
        });
        const data = await response.json();
        
        if (response.ok) {
          // Update searchResults with the filtered products
          this.priceSearchResults = data.products;
          this.hasSearched = true;
        } else {
          // Handle error, display message, or log to console
          console.error('Failed to fetch products by price range:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products by price range:', error);
      }
    },

  },
  
}