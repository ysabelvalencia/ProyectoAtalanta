const button__menu = document.getElementById("button__menu");
const sidebar = document.getElementsByClassName("sidebar");

button__menu.addEventListener("click",()=>{

    for(let i = 0; i < sidebar.length; i++) {
        if (sidebar[i].style.visibility === "visible"){
            sidebar[i].style.visibility = "hidden";
        } else {
            sidebar[i].style.visibility = "visible";
        }
    }
})