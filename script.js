const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

let shirtInfo

bar.addEventListener('click', ()=>{
  nav.classList.toggle('active')
});
close.addEventListener('click', ()=>{
  nav.classList.remove('active')
})

//prodSess.append(items());
//fetch funtion
const prodSess = document.getElementById('flex')
  fetch("prod.json")
  .then(res => res.json())
  .then(json => {
    [json].map(data => {
        shirtInfo = data.items;

      data.items.map(shirts =>{

        prodSess.append(items(shirts));

      });
    });
  });

  function items({name,make,price,img, id}){
    let product = document.createElement('div');
    prodSess.innerHTML += `
      <div id="product1" class="pro">
        <img src="${img.url}" alt="">
        <div class="des">
          <span>${make}</span>
          <h5>${name}</h5>
          <div class="star">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <h4>
            ${price}
          </h4>
        </div>
        <a
        ><i class="fa-solid fa-cart-arrow-down cart" onclick="addToCart(${id})" ></i></a>
      </div>
      `;
      return product;
    }


    const prodSess2 = document.getElementById('flex2')
  fetch("prod.json")
  .then(response => response.json())
  .then (json =>{
    [json].map(data2 =>{

      shirtInfo =  shirtInfo.concat(data2.items2) ;
      console.log(shirtInfo);


      data2.items2.map(shirts2 =>{
        prodSess2.append(items2(shirts2))
        console.log(shirts2)
      });
    });
  });
  function items2({name,make,price,img,id}){
    let product2 = document.createElement('div');
    prodSess2.innerHTML += `
    <div class="pro" >
        <img src="${img.url}" alt="">
        <div class="des">
          <span>${make}</span>
          <h5>${name}</h5>
          <div class="star">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <h4>
            ${price}
          </h4>
        </div>
        <a><i onclick="addToCart(${id})" class="fa-solid fa-cart-arrow-down cart" ></i></a>
      </div>
    `;
    return product2;
  }





//ADD TO CART
function addToCart(id){
  console.log(id);
  console.log(shirtInfo);
 const stuff =  shirtInfo.filter((shirts) => shirts.id == id)
 console.log(stuff);
 const newStuff = {
        "id": stuff[0].id,
        "name": stuff[0].name,
        "make": stuff[0].make,
        "price": stuff[0].price,
        "img": stuff[0].img.url,
        "quantity": 1
      }
const OldCart = JSON.parse(window.localStorage.getItem("cartItem")) ? JSON.parse(window.localStorage.getItem("cartItem")) : [];
const NewCart = OldCart.concat(newStuff)
window.localStorage.setItem("cartItem", JSON.stringify(NewCart) )
}

var data = JSON.parse(window.localStorage.getItem('cartItem'))

function remove(id2){
  const newData = data.filter(function(item, id){
   return (id !==id2);
  })
  window.localStorage.setItem("cartItem", JSON.stringify(newData))
   data = JSON.parse(window.localStorage.getItem('cartItem'))
     cart();

// console.log(data);

}
function updateQuantity(value, id) {
  let datas = JSON.parse(window.localStorage.getItem("cartItem"))
  console.log(datas)
  let itemUp = datas.findIndex(itemss => itemss.id == id)
  console.log(itemUp)
  datas[itemUp].quantity = value
  console.log(datas);
   window.localStorage.setItem("cartItem", JSON.stringify(datas))
    data = JSON.parse(window.localStorage.getItem('cartItem'))
    cart()




}

let total;
function cart(){
  cartTotal()
  console.log(data);
  let cartTable = document.getElementById('tablee');
let cartTab = "";
  data.map((carts, id) =>{
    cartTab +=`
    <tr>
          <td><a onclick="remove(${id})" href="#"><i class="fa-solid fa-circle-xmark Remove"></i></a></td>
          <td><img src="${carts.img}" alt=""></td>
          <td>${carts.name}</td>
          <td>#${carts.price}</td>
          <td><input type="number" value="${carts.quantity}" onchange="updateQuantity(this.value, ${carts.id})"></td>
          <td>#${carts.price * carts.quantity}</td>
        </tr>
    `;
    cartTable.innerHTML = cartTab;

  })
}

function cartTotal() {
  let totatDom =document.getElementById("total");
  let subTotalDom = document.getElementById("subTotal")

  total = parseInt(data.reduce((acc , current) => acc + (current.price * current.quantity), 0))
  console.log(total);
  totatDom.innerHTML = "#"+total
  subTotalDom.innerHTML = "#"+total
}

function payWithPaystack() {

    const handler = PaystackPop.setup({
        key: 'pk_test_c962b44121cfb161a74ba8b67294cc83734e4768', //put your public key here
        email: 'ayomidetimothy28@gmail.com', //put your customer's email here
        amount: total * 100, //amount the customer is supposed to pay
        metadata: {
            custom_fields: [
                {
                    display_name: "308670846",
                    variable_name: "mobile_number",
                    value: "+2348012345678" //customer's mobile number
                }
            ]
        },
        callback: function (response) {
            //after the transaction have been completed
            //make post call  to the server with to verify payment
            //using transaction reference as post data
            $.post("verify.php", {reference:response.reference}, function(status){
                if(status == "success")
                    //successful transaction
                    alert('Transaction was successful');
                else
                    //transaction failed
                    alert(response);
            });
        },
        onClose: function () {
            //when the user close the payment modal
            alert('Transaction cancelled');
        }
    });
    return handler.openIframe(); //open the paystack's payment modal
}
