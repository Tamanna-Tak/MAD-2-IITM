export default {
    template: `
    <div>
    <h2>User's Cart</h2>
    <table class=table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Product Name</th>
          <th>Unit</th>
          <th>Rate per Unit</th>
          <th>Cart Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cartItems" :key="index">
            <td>{{item.cart_id}}</td>
          <td>{{ item.product_name }}</td>
          <td>{{ item.product_unit }}</td>
          <td>{{ item.rate_per_unit }}</td>
          <td>{{ item.cart_quantity }}</td>
          <td><button @click="removeItem(item.cart_id)">Remove</button></td>
        </tr>
      </tbody>
    </table>
    <div v-if="cartItems.length === 0">
      <h3>No items in the cart.</h3>
    </div>
    <div>
        <br>
        <h5 style="color:green;text-align:center">Total Transaction Amount: {{ calculateTotalValue() }}</h5>
      </div>
  </div>
    `,
    data() {
      return {
        token: localStorage.getItem('auth-token'),
        cartItems: []
      };
    },
    created() {
      
      this.fetchUserCartItems();
    },
    methods: {
      async fetchUserCartItems() {
        try {
          const userId = localStorage.getItem("user_id");
          const response = await fetch(`api/cart/item/${userId}`, {
            headers: {
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          });
          if (response.ok) {
            const data = await response.json();
            this.cartItems = data;
            console.log(this.cartItems)
            
          } else {
            console.error("Failed to fetch user's cart items:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching user's cart items:", error);
        }
      },
      calculateTotalValue() {
        // Calculate total transaction value
        let totalValue = 0;
        for (const item of this.cartItems) {
          // Multiply rate_per_unit with cart_quantity for each item and add to the total
          totalValue += item.rate_per_unit * item.cart_quantity;
        }
        return totalValue;
      },
      async removeItem(index) {
        const item = this.cartItems[index];
        console.log(index)
  
        try {
          const response = await fetch(`api/cart/remove/${index}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
            },
          });
  
          if (response.ok) {
              alert("Removed from cart")
              this.$router.go(0); // Refresh the page

            // If the item was successfully removed from the cart,
            // update the cartItems array and trigger a new fetch of user's cart items.
            // this.cartItems.splice(index, 1);
            // this.fetchUserCartItems();
          } else {
            console.error('Failed to remove item:', response.statusText);
          }
        } catch (error) {
          console.error('Error removing item:', error);
        }
      },
    },
    
  };
  