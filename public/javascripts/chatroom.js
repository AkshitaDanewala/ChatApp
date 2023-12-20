
var userName = document.querySelector(".userName")
var userboxname = document.querySelector(".userboxname")
var usersbox =  document.querySelector(".usersbox")

userboxname.addEventListener("click", async function(name){
    userName.innerHTML = name.target.innerHTML
})