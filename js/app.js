'use strict';
const products = document.querySelector(".products")
const cartSymbol = document.querySelector(".fa-shopping-cart")
const modal = document.querySelector(".modal");
const cartContainer = document.querySelector(".cartContainer")
const productContainer = document.querySelector(".productContainer")
const totalContainer = document.querySelector(".totalContainer")

function init(pdata){
let cart = [];
// check local storage in case the cart data in local storage
(localStorage.productData)?cart= cart.concat(JSON.parse(localStorage.productData)):cart = [] 
// marker function for all products from API
const displayProduct= function(pdata){
    products.innerHTML="";
    totalContainer.innerHTML="";
    cartContainer.innerHTML="";

    pdata.items.forEach((el,index) => {
        const mark = `
      <li>
      <div class="product" id="${el.sys.id}" >      
        <img class="product-image" src="./images/product-${index+1}.JPG" alt="product ${index+1}" />
        <div class="product-name">
       <h5>${el.fields.title}</h5>
        </div>
        <div class="product-brand">
        </div>
        <div class="product-price">
          $${el.fields.price}
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
//count the all products in the cart
function cartCounter(arr){
  const productNumb = arr.length
  cartSymbol.textContent = `${productNumb}`
}
cartCounter(cart)

productbtn.forEach(el=>{
  el.addEventListener('click', function(e){
  const chosenProductID =+e.target.parentElement.id;  
  pdata.items.forEach(el=>{                            
    if(+el.sys.id===chosenProductID){ 
      cart.push(el)
      cartCounter(cart)
      setTimeout(()=> modal.classList.remove("hidden"), 200)
      localDataReg(cart)
    }
  })
  quantityOfEachProduct(chosenProductID,cart)
  })
})
// calculate each product quantity
function quantityOfEachProduct(productsID,arr){
  let quantityOfPro;
  const counts = {}
  arr.forEach((el)=>{
    if(productsID===+el.sys.id) {
      counts[el] = counts[el] ? counts[el] + 1 : 1;
      quantityOfPro =(counts[el])
    }
  })
  return quantityOfPro
}
// save cart data in Local Storage
function localDataReg(arr){
 return localStorage.setItem('productData',  JSON.stringify(arr));
}

// modal.addEventListener("click", function (e) {
//   // add click and escape feature!
//   const modalClose = e.target;
//   if (modalClose.classList.contains("close-modal")) {
//     const modalPopUp = modalClose.parentElement;
//     modalPopUp.classList.add("hidden");
//   }
// });
// //modal closer
//  document.querySelectorAll('*').forEach(element => element.addEventListener('click', e => {
//    if(e.target.className===`btn-add-cart`&& !Array.from(modal.classList).includes('hidden')){
//      modal.classList.add('hidden')
//    }
//    if(e.target.className!==`btn-add-cart`) {
//     modal.classList.add('hidden')
//    }
// }))

const cartSum =function(arr){
  return arr.reduce((a,b)=>(a+b.fields.price),0)
}
// display all total price of products
const displayTotal =function(arr){
  totalContainer.innerHTML="";
  const sum = cartSum(arr)
  const sumMark = `<div class="total">
                  <h5>ORDER SUMMARY</h5>
                  <h5>TOTAL:$${sum}</h5>
                  </div>`
  totalContainer.insertAdjacentHTML("beforeend", sumMark);
}

const showCart = function(cartData){
  cartContainer.innerHTML="";
  const uniqCartData = cartData.filter((el, index, self) =>    //select only uniq elements in the array(cart) in order to mark
  index === self.findIndex((it) => (it.sys.id === el.sys.id)))
  if(uniqCartData){
    uniqCartData.forEach(el=> {
      const markup =
      `<li class="cartItems">
            <div class="item">
                <div class="cart">
                     <img  class="item-picture" src="${el.fields.image}" alt="">
                 </div>
                 <div class="title">
                 <h5 class="productTitle">${el.fields.title}</h5>
                 </div>
                 <form>
                  <div class="decrease value-button" id="${el.sys.id}" value="Decrease Value">-</div>
                      <input type="number" id="number" value="${quantityOfEachProduct(+el.sys.id, cart)}"/>
                  <div class="increase value-button" id="${el.sys.id}" value="Increase Value">+</div>
                </form>
                <div class="delete-btn" id="${el.sys.id}">
                <button>Delete</button>
                </div>
                <div class="price">
                 <h5 class="productPrice">$${quantityOfEachProduct(+el.sys.id, cart)*(+el.fields.price)}</h5>
                 </div>
            </div>
           </li>
      `
        cartContainer.insertAdjacentHTML("beforeend", markup);   
      })
  }
  displayTotal(cart)
}
//showing cart
cartSymbol.addEventListener('click', function(e){
  products.innerHTML ="";
  cartCounter(cart)
  showCart(cart);

  const delBtn = document.querySelectorAll(".delete-btn")
  const form = document.querySelectorAll("form")

  form.forEach(el=>{
    el.addEventListener('click', function(e){
      const selectedID =+e.target.id;
      const selectedItem = e.target.parentElement.parentElement;
      const selectedClass = e.target.classList[0]
      pdata.items.forEach(it=>{

        if((selectedClass==='increase')&&(+it.sys.id===selectedID)){
          cart.push(it)
          cartCounter(cart)
          selectedItem.childNodes[5].childNodes[3].value=quantityOfEachProduct(selectedID,cart)
          selectedItem.childNodes[9].textContent= `$${(quantityOfEachProduct(selectedID,cart))*(+it.fields.price)}`
          displayTotal(cart)
          localDataReg(cart)
        }
        if((selectedClass==='decrease')&&(+it.sys.id===selectedID)){
          const index = cart.findIndex(el=> +el.sys.id===selectedID)
          if(index>=0)  {
            cart.splice(index,1)
            selectedItem.childNodes[5].childNodes[3].value=quantityOfEachProduct(selectedID,cart)
            selectedItem.childNodes[9].textContent= `$${(quantityOfEachProduct(selectedID,cart))*(+it.fields.price)}`
            if(!(quantityOfEachProduct(selectedID,cart))) {
              selectedItem.remove()
            }
          }
          cartCounter(cart)
          displayTotal(cart)
          localDataReg(cart)
         }
      })
    })
  })
// delete the product in the cart
  delBtn.forEach(el=>el.addEventListener('click', function(e){
    const chosenProductID = e.target.parentElement;
    cart=cart.filter(it=>{
      return +it.sys.id !== +chosenProductID.id
    })
    chosenProductID.parentElement.remove()
    displayTotal(cart)
    cartCounter(cart);
    localDataReg(cart)
  }))
})
// get data from local storage
}
const fetchData =function() {
  fetch('../products.json')
    .then((data) => data.json())
    .then((response) =>{
      init(response)})
    .catch((err) => console.error(err.message));
}
fetchData()



