'use strict';
import {products,cartSymbol, displayProduct,displayTotal,displayCart} from './view.js'
export {quantityOfEachProduct,localDataReg,cartSum,cartCounter,cart}

//calculate each products in the cart quantity
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
 return localStorage.setItem('productData', JSON.stringify(arr));
}

const cartSum =function(arr){
  return arr.reduce((a,b)=>(a+b.fields.price),0)
}

function cartCounter(arr){
  const productNumb = arr.length
  cartSymbol.textContent = `${productNumb}`
}

let cart = [];

function init(pdata){
// check local storage in case the cart data in local storage
(localStorage.productData)?cart= cart.concat(JSON.parse(localStorage.productData)):cart = [] 
// marker function for all products from API
displayProduct(pdata)  // display the products
const productbtn= document.querySelectorAll("button")
//count the all products in the cart
cartCounter(cart)

productbtn.forEach(el=>{
  el.addEventListener('click', function(e){
  const chosenProductID =+e.target.parentElement.id;  
  pdata.items.forEach(el=>{                            
    if(+el.sys.id===chosenProductID){ 
      cart.push(el)
      cartCounter(cart)
      localDataReg(cart)
    }
  })
  quantityOfEachProduct(chosenProductID,cart)
  })
})
// calculate each product quantity

//showing cart
cartSymbol.addEventListener('click', function(e){
  products.innerHTML ="";
  cartCounter(cart)
  displayCart(cart);

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

}

// get data from local storage 
const fetchData =function() {
  fetch('../products.json')
    .then((data) => data.json())
    .then((response) =>{
      init(response)})
    .catch((err) => console.error(err.message));
}
fetchData()


