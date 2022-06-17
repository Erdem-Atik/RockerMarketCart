'use strict';
import {products,cartSymbol, displayProduct,displayTotal,displayCart} from './cartView.js'
import { getData } from './model.js';
export {quantityOfEachProduct,localDataReg,cartSum,cartCounter,cart}

//calculate quantity of each product in the cart 
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
// save the cart data in Local Storage
function localDataReg(arr){
 return localStorage.setItem('productData', JSON.stringify(arr));
}
// summary of price of products in the cart
const cartSum =function(arr){
  return arr.reduce((a,b)=>(a+b.fields.price),0)
}
// count of the products in the cart
function cartCounter(arr){
  const productNumb = arr.length
  cartSymbol.textContent = `${productNumb}`
}
// indicate each product's quantity and summary information
function productProperty(selectedEl, selId, el){
    selectedEl.childNodes[5].childNodes[3].value=quantityOfEachProduct(selId,cart)
    selectedEl.childNodes[9].textContent= `$${(quantityOfEachProduct(selId,cart))*(+el.fields.price)}`
}
//add the selected product to the cart
function addProduct(dom,data){
    dom.forEach(el=>{
        el.addEventListener('click', function(e){
        const chosenProductID =+e.target.parentElement.id;  
        data.items.forEach(el=>{                            
          if(+el.sys.id===chosenProductID){ 
            cart.push(el)
            cartCounter(cart)
            localDataReg(cart)
          }
        })
        quantityOfEachProduct(chosenProductID,cart)
        })
      })
 }
// delete selected product in the cart
function deleteProduct(dom,arr){
    dom.forEach(el=>el.addEventListener('click', function(e){
        const chosenProductID = e.target.parentElement;
        arr=arr.filter(it=>{
          return +it.sys.id !== +chosenProductID.id
        })
        chosenProductID.parentElement.remove()
        displayTotal(arr)
        cartCounter(arr);
        console.log(arr);
        localDataReg(arr)
        console.log(arr);

      }))
}

const  manageCart =function(proData,arr,cl,item,id) {
    proData.items.forEach(it=>{

        if((cl==='increase')&&(+it.sys.id===id)){
          arr.push(it)
          cartCounter(arr)
          productProperty(item,id,it)
          displayTotal(arr)
          localDataReg(arr)
        }
        if((cl==='decrease')&&(+it.sys.id===id)){
          const index = arr.findIndex(el=> +el.sys.id===id)
          if(index>=0)  {
            arr.splice(index,1)
            productProperty(item,id,it)
            if(!(quantityOfEachProduct(id,arr))) {
             item.remove()
            }
        }
          cartCounter(arr)
          displayTotal(arr)
          localDataReg(arr)
         }
      })
}

let cart = [];
// controller function
function init(pdata){
// check local storage in case the cart data in local storage
(localStorage.productData)?cart= cart.concat(JSON.parse(localStorage.productData)):cart = [] 
// marker function for all products from API
displayProduct(pdata)  // display the products
const productbtn= document.querySelectorAll("button")
//count the all products in the cart
cartCounter(cart)

addProduct(productbtn,pdata)
//showing cart
cartSymbol.addEventListener('click', function(e){
  cart = [];
  cart= cart.concat(JSON.parse(localStorage.productData))
  console.log(cart);
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
    manageCart(pdata,cart, selectedClass,selectedItem,selectedID)
    })
  })
 
deleteProduct(delBtn,cart)
})
}
// launch cart app
getData().then(res=>init(res))