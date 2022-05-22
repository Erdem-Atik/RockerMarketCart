'use strict';
const products = document.querySelector(".products")
const cartSymbol = document.querySelector(".cart")
const modal = document.querySelector(".modal");
const cartContainer = document.querySelector(".cartContainer")
const productContainer = document.querySelector(".productContainer")
const brand = document.querySelector(".brand")
const main =document.querySelector("main");
const totalContainer = document.querySelector(".totalContainer")

function init(pdata){
  let cart = []
  let productsInCart

  // if(JSON.parse(localStorage.productData))  {
  //   cart = JSON.parse(localStorage.productData)
  //   // console.log(cart);
  // }else{
  //   cart = []
  // }

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

displayProduct(pdata)  // display the products

const productbtn= document.querySelectorAll("button")

function cartCounter (arr){
  const productNumb = arr.length
  cartSymbol.textContent = `cart added: ${productNumb}`
}
cartCounter(cart)
productbtn.forEach(el=>{                        
  el.addEventListener('click', function(e){
  const chosenProductID = e.target.parentElement.id;  // find which product is selected
 pdata.items.forEach(el=>{                            // add some properties the selected products(quantity, )
    if(+el.sys.id===+chosenProductID){ // think again!
      cart.push(el)
       const counts = {};
       cart.forEach((el)=>{
       counts[el.sys.id] = counts[el.sys.id] ? counts[el.sys.id] + 1 : 1;
       el.fields.price = +el.fields.price 
       el.numb=counts[el.sys.id]
      el._total = function(){ return this.fields.price*this.numb}
      el.total= el._total()          
      })
      productsInCart=[...new Set(cart)] // same products are collected in one object
      // localStorage.setItem('productData',  JSON.stringify(cart));
      // const getlocal= localStorage.getItem('productData')
      cartCounter(cart)
      setTimeout(()=> modal.classList.remove("hidden"), 200)
    }
  })
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

const cartSum =function(arr){
  return arr.reduce((a,b)=>(a+b.fields.price),0)
}

const displayTotal =function(arr){
  totalContainer.innerHTML="";
  const sum = cartSum(arr)
  console.log(sum);

  const sumMark = `<div class="total">
                  <h5>ORDER SUMMARY</h5>
                  <h5>TOTAL:${sum}</h5>
                  </div>`           
  totalContainer.insertAdjacentHTML("beforeend", sumMark);
}
const showCart = function(arr){
  cartContainer.innerHTML="";
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
             <h5 class="productPrice">${el.total}</h5> 
             </div>
        </div>
       </li>     
  `
    cartContainer.insertAdjacentHTML("beforeend", markup);
  
  })
  displayTotal(cart)
}
//showing cart 
cartSymbol.addEventListener('click', function(e){
  products.innerHTML ="";
  cartCounter(productsInCart);
  showCart(productsInCart);
  const input = document.querySelectorAll("input")
  const delBtn = document.querySelectorAll(".delete-btn")
  const price = document.querySelector(".price")
  input.forEach(el=>el.addEventListener('click', function(e)
  {
    const choose = e.target.parentElement.nextSibling.nextElementSibling.id
    pdata.items.forEach(it=>{ 
      // add some properties the selected products(quantity, )
      if(+it.sys.id===+choose){ 
        console.log('test');
        cart.push(it)
        const count = {}
        cart.forEach(el=>{
         count[el.sys.id] = count[el.sys.id] ? count[el.sys.id] + 1 : 1;
         el.fields.price = +el.fields.price 
         el.numb=count[el.sys.id]
         el._total = function(){ return this.fields.price*this.numb}
         el.total= el._total()          

        })

      }
    });
    [...new Set(cart)].forEach(el =>{
     if(el.sys.id===choose){
      el._total = function(){
        return this.fields.price*this.numb
      }
      el.total= el._total()  
      e.target.parentElement.parentElement.childNodes[9].innerText= el.total
      console.log(cartSum(cart));
     }
    })
// //update all products total price UI
    console.log(cart);
    cartCounter(productsInCart);
    displayTotal(productsInCart)
   })) 
  delBtn.forEach(el=>el.addEventListener('click', function(e){
    const chosenProductID = e.target.parentElement;
    cart=cart.filter(it=>{
      return +it.sys.id !== +chosenProductID.id
    })
    console.log(cart);
    chosenProductID.parentElement.remove()
    displayTotal(cart)
   cartCounter(productsInCart);
  }))
})

}   
const fetchData =function() {
  fetch('../products.json')
    .then((data) => data.json())
    .then((response) =>{
      init(response)})
    .catch((err) => console.error(err.message));
}

fetchData()

// brand.addEventListener('click',function(e){
//  })
// localstorage.productsInCart = JSON.stringify(productsInCart);
// var storedProduct = JSON.parse(localStorage.productsInCart);
// localStorage.setItem = JSON.stringify('cartdata', productsInCart)
// // console.log(storedProduct);
// console.log(localStorage);