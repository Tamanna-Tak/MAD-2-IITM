import UserHome from "./UserHome.js"
import ManagerHome from "./ManagerHome.js"
import AdminHome from "./AdminHome.js"
import Category from "./Category.js"




export default {
    template: `<div> 
    <UserHome v-if="userRole=='user' "/> 
    <AdminHome v-if="userRole=='admin'"/> 
    <ManagerHome v-if="userRole=='man'"/> 
    <Category v-for="(category, index) in categories" :key='index' :category = "category" />
    <div v-if="userRole !== 'user' && userRole !== 'admin' && userRole !== 'man'">
    <p style=" text-align: center;font-size: 24px; font-weight: bold;color:blue;margin-top: 20px;">Home Page</p>
    <img src="static/Pictures/1.JPG" alt="Example Image"  style="width: 1180px; height: auto;"/>
    </br></br>
    <h3><u>Top Picks Of Groceries</u></h3>
    <div style="display: flex;">
    <img src="static/Pictures/2.JPG" alt="Example Image"/>
    <img src="static/Pictures/3.JPG" alt="Example Image"/>
    <img src="static/Pictures/4.JPG" alt="Example Image"/>
    <img src="static/Pictures/5.JPG" alt="Example Image"/>
    </div>
    </br></br><hr>
    <h3><u>Shop From Top Categories</u></h3>
    <div style="display: flex; gap: 10px;">
    <img src="static/Pictures/6.JPG" alt="Example Image" style=" width: 230px;height: auto;"/>
    <img src="static/Pictures/7.JPG" alt="Example Image" style=" width: 230px;height: auto;"/>
    <img src="static/Pictures/8.JPG" alt="Example Image" style=" width: 230px;height: auto;"/>
    <img src="static/Pictures/9.JPG" alt="Example Image" style=" width: 230px;height: auto;"/>
    <img src="static/Pictures/10.JPG" alt="Example Image" style=" width: 230px;height: auto;"/>
    </div>
    </br></br>
    <footer style="background-color: bisque; text-align: center;">
    <hr>
    <h3 style="padding-top: 10px;">Follow us</h3>
    <div style="padding-top: 10px;">
        <button style="background-color: red; font-weight: bold; color: whitesmoke; margin-right: 5px;">Youtube</button>
        <button style="background-color: rgb(20, 40, 168); font-weight: bold; color: whitesmoke; margin-right: 5px;">Facebook</button>
        <button style="background-color: green; font-weight: bold; color: whitesmoke;">Whatsapp</button>
    </div>
    <hr>
</footer>
    </div>
    </div>`,
 
    data(){
        return{
            userRole: localStorage.getItem('role'),
            authToken:localStorage.getItem('auth-token'),
            categories: [],
            
        }
    },
    components:{
        UserHome,
        ManagerHome,
        AdminHome,
        Category
    
    },
    async mounted(){
        const res=await fetch('/api/section',{
            headers:{
                "Authentication-Token":this.authToken
            },
        })
       
        const data=await res.json()

        if(res.ok){
            this.categories=data
        }
        else{
            alert(data.message)
        }
    }
}