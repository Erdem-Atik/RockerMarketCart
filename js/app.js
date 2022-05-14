const products = document.querySelector(".products")
const cartSymbol = document.querySelector(".cart")
const modal = document.querySelector(".modal");
const cartContainer = document.querySelector(".cartContainer")
const productContainer = document.querySelector(".productContainer")
const brand = document.querySelector(".brand")
const main =document.querySelector("main");
const totalContainer = document.querySelector(".totalContainer")

// products data
const allProducts= 
{
  "items": [
    {
      "sys": { "id": "1" },
      "fields": {
        "title": "Fender Black Accoustic",
        "price": 10,
        "image": "./images/product-1.JPG" ,
        "brand": "Fender"
      }
    },
    {
      "sys": { "id": "2" },
      "fields": {
        "title": "Ibanez Electro Guitar",
        "price": 20,
        "image":  "./images/product-2.JPG",
        "brand": "Great Comfort"

      }}
    ,
    {
      "sys": { "id": "3" },
      "fields": {
        "title": "Ibanez Washed Denim",
        "price": 30,
        "image":  "./images/product-3.JPG",
        "brand": "Bed Bright" 
      }
    } 
  ]
}

const cart = []
//product marker

init();

function init(){

const displayProduct= function(pdata){
    products.innerHTML="";
    totalContainer.innerHTML="";
    cartContainer.innerHTML=""; 

    pdata.items.forEach((el,index) => {
        const mark = `
      <li>
      <div class="product" id="${el.sys.id}" >
        <a href="/#/product/1">
          <img src="./images/product-${index+1}.JPG" alt="product ${index+1}" />
        </a>
        <div class="product-name">
          <a href="/#/product/1">
         ${el.fields.title}
          </a>
        </div>
        <div class="product-brand">
        </div>
        <div class="product-price">
          ${el.fields.price}
        </div>
        <button class="btn-add-cart">Add Product</button>
      </div>  
    </li>
          `
      products.insertAdjacentHTML("beforeend", mark);
    })
}

displayProduct(allProducts)  // display the products

const productbtn= document.querySelectorAll("button")


const productCounter = function(arr){
  cartSymbol.textContent = `CART Added: ${arr.length}`
}

productbtn.forEach(el=>{
  el.addEventListener('click', function(e){
  const chosenProductID = e.target.parentElement.id;
  allProducts.items.forEach(el=>{
    if(+el.sys.id===+chosenProductID){ // think again!

      cart.push(el)
      setTimeout(()=> modal.classList.remove("hidden"), 200)
    }
  })
 // console.log(cart);
  
productCounter(cart)
  })
})

modal.addEventListener("click", function (e) {
  // add click and escape feature!
  const modalClose = e.target;
  if (modalClose.classList.contains("close-modal")) {
    const modalPopUp = modalClose.parentElement;
    modalPopUp.classList.add("hidden");  
     
  }
});

//modal closer 
 document.querySelectorAll('*').forEach(element => element.addEventListener('click', e => {
   if(e.target.className===`btn-add-cart`&& !Array.from(modal.classList).includes('hidden')){
     modal.classList.add('hidden')
   }
   if(e.target.className!==`btn-add-cart`) {
    modal.classList.add('hidden')
   }
}))

const showCart = function(arr){
  cartContainer.innerHTML="";
  totalContainer.innerHTML="";
  arr.forEach(el=> {
  const markup = 
  `<li class="cartItems">
        <div class="item">
            <div class="cart">
                 <img  class="item-picture" src="${el.fields.image}" alt="">
             </div>
             <div class="title">
             <h5 class="productTitle">${el.fields.title}</h5>
             </div>
            <form  action="form">
                <input class="input" type="number" name="quantity" class="quantity" min="1" max="50" value="${el.numb}" autofocus="">          
            </form>     
            <div class="delete-btn" id="${el.sys.id}">
            <button>Delete</button>
            </div>
            <div class="price">
             <h5 class="productPrice">${el.total()}</h5>
             </div>
        </div>
       </li>

  `
 
    cartContainer.insertAdjacentHTML("beforeend", markup);
   
  })


  const sum2 = arr.reduce((a,b)=>(a+b.total()),0)
  console.log( totalContainer);
  console.log(sum2);
  const sumMark = `<div class="total">
                  <h5>ORDER SUMMARY</h5>
                  <h5>TOTAL:${sum2}</h5>
                  </div>`           
  totalContainer.insertAdjacentHTML("beforeend", sumMark );

}

//showing cart 

cartSymbol.addEventListener('click', function(e){
  products.innerHTML ="";
  
  const counts = {};
  cart.forEach((el)=>{
   counts[el.sys.id] = counts[el.sys.id] ? counts[el.sys.id] + 1 : 1;
  })
//adding quantity to product's object
  cart.forEach(el=>{
    el.numb=counts[el.sys.id]
  })

  cart.forEach(el=>{
    el.total = function(){
      return this.fields.price*this.numb
    }

  })


    console.log(cart);

  let arr2 = [...new Set(cart)]

  showCart(arr2);

  const input = document.querySelectorAll(".input")
  const delBtn = document.querySelectorAll(".delete-btn")
  const price = document.querySelector(".price")

  input.forEach(el=>el.addEventListener('click', function(e)
  {
    const choose = e.target.parentElement.nextSibling.nextElementSibling.id
    
    arr2.forEach(el=>{
      if(+el.sys.id===+choose){
        el.numb>1?el.numb=el.numb-1:el.numb=el.numb
            console.log(el.numb);


//update all products total price UI
        const sum2 = arr2.reduce((a,b)=>(a+b.total()),0)
        const sumMark = `<div class="total">
                      <h5>ORDER SUMMARY</h5>
                      <h5>TOTAL:${sum2}</h5>
                      </div>`     
      totalContainer.innerHTML=""
      totalContainer.insertAdjacentHTML("beforeend", sumMark );
// //update single product total price UI
//         price.innerHTML="";
//         arr2.forEach(el=>{
//             price.innerHTML= el.total()
//         })
      }
    })
   
   })) 
  
  delBtn.forEach(el=>el.addEventListener('click', function(e){
    console.log('delete');
    const chosenProductID = e.target.parentElement;
    console.log(chosenProductID);
    arr2=arr2.filter(it=>{
      return +it.sys.id !== +chosenProductID.id
    })
    chosenProductID.parentElement.remove()
    const sum2 = arr2.reduce((a,b)=>(a+b.total()),0)
    console.log(sum2);
    const sumMark = `<div class="total">
                  <h5>ORDER SUMMARY</h5>
                  <h5>TOTAL:${sum2}</h5>
                  </div>`
  totalContainer.innerHTML=""
  totalContainer.insertAdjacentHTML("beforeend", sumMark );

  }))

})

}

brand.addEventListener('click',function(e){
 init();
})





//  const fetchData =function() {
//     fetch('../products.json')
//       .then((data) => data.json())
//       .then((response) => displayProduct(response))
//       .catch((err) => console.error(err.message));
//   }


//   fetchData();





   

