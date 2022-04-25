const products = document.querySelector(".products")
const cartSymbol = document.querySelector(".cart")
const modal = document.querySelector(".modal");

const allProducts= 
{
  "items": [
    {
      "sys": { "id": "1" },
      "fields": {
        "title": "queen panel bed",
        "price": 10.99,
        "image": "./images/product-1.jpeg" ,
        "brand": "Grand Bed"
      }
    },
    {
      "sys": { "id": "2" },
      "fields": {
        "title": "king panel bed",
        "price": 12.99,
        "image":  "./images/product-2.jpeg",
        "brand": "Great Comfort"

      }}
    ,
    {
      "sys": { "id": "3" },
      "fields": {
        "title": "single panel bed",
        "price": 12.99,
        "image":  "./images/product-3.jpeg",
        "brand": "Bed Bright" 
      }
    }
   
  ]
}
const displayProduct= function(pdata){
    pdata.items.forEach((el,index) => {
        const mark = `
        <li>
        <div class="product" id="${el.sys.id}" >
          <a href="/#/product/1">
            <img src="./images/product-${index+1}.jpeg" alt="product ${index+1}" />
          </a>
          <div class="product-name-${index+1}">
            <a href="/#/product/1">
             ${el.fields.title} 
            </a>
          </div>
          <div class="product-brand">
          </div>
          <div class="product-price">
          ${el.fields.price}$
          </div>
          <button class="btn-add-cart">Add product</button>
          <div class="account">500</div>  
        </div>  
      </li>
          `
      products.insertAdjacentHTML("beforeend", mark);
    })
}

displayProduct(allProducts)

const productbtn= document.querySelectorAll("button")

const cart = []

const productCounter = function(arr){
  cartSymbol.textContent = `CART Added: ${arr.length}`
}

const showCart = function(arr){
  const counts = {};
  const markup = `
  <li>
        <div class="addProduct" id="${el.sys.id}" >
          <a href="/#/product/1">
            <img src="./images/product-${index+1}.jpeg" alt="product ${index+1}" />
          </a>
          <div class="product-name-${index+1}">
            <a href="/#/product/1">
             ${el.fields.title} 
            </a>
          </div>
          <div class="product-brand">
          </div>
          <div class="product-price">
          ${el.fields.price}$
          </div>
          <button class="btn-add-cart">Add product</button>
          </div>
          <div class="account">500
          </div>
        </div>  
      </li>`



arr.forEach(el=> { counts[el.fields.title] = (counts[el.fields.title] || 0) + 1; });
console.log(counts)

}

productbtn.forEach(el=>{
  el.addEventListener('click', function(e){
  const chosenProductID = e.target.parentElement.id;
  allProducts.items.forEach(el=>{
    if(+el.sys.id===+chosenProductID){ // think again!
      cart.push(el)
      modal.classList.remove("hidden");
    }
  })
  console.log(cart);
  
productCounter(cart)
showCart(cart);

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








//  const fetchData =function() {
//     fetch('../products.json')
//       .then((data) => data.json())
//       .then((response) => displayProduct(response))
//       .catch((err) => console.error(err.message));
//   }


//   fetchData();

