document.querySelector(".buyBtn").addEventListener("click", function(){
alert("Redirecting to order section");
window.location.href="#order";
});


const searchInput = document.querySelector(".searchBox input");

searchInput.addEventListener("keyup", function(){

let value = searchInput.value.toLowerCase();

let products = document.querySelectorAll(".card");

products.forEach(function(card){

let text = card.innerText.toLowerCase();

if(text.includes(value))
{
card.style.display="block";
}
else
{
card.style.display="none";
}

});

});


document.querySelectorAll("form").forEach(function(form){

form.addEventListener("submit", function(e){

e.preventDefault();

alert("Thank you! Your request has been received.");

});

});