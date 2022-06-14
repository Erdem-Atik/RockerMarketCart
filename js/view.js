'use strict';
// marker functions//
const products = document.querySelector(".products")
const cartSymbol = document.querySelector(".fa-shopping-cart")
const cartContainer = document.querySelector(".cartContainer")
const productContainer = document.querySelector(".productContainer")
const totalContainer = document.querySelector(".totalContainer")


<<<<<<< HEAD
import {quantityOfEachProduct,localDataReg,cartSum,cartCounter,cart,fetchData} from './app.js'
=======
import {quantityOfEachProduct,localDataReg,cartSum,cartCounter,cart} from './app.js'
>>>>>>> 1caf20dab804e2b048ffc006830421aa8cde4491

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

const displayTotal =function(arr){
    totalContainer.innerHTML="";
    const sum = cartSum(arr)
    const sumMark = `<div class="total">
                    <h5>ORDER SUMMARY</h5>
                    <h5>TOTAL:$${sum}</h5>
                    </div>`
    totalContainer.insertAdjacentHTML("beforeend", sumMark);
  }

  const displayCart = function(cartData){
    cartContainer.innerHTML="";
    const uniqCartData = cartData.filter((el, index, self) =>    //select only uniq elements in the array(cart-JSON data) in order to mark
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

  export {products,cartSymbol, displayProduct, displayTotal, displayCart}