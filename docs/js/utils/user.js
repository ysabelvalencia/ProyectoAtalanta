export function initUserWelcome(){

    const titulo = document.getElementById("bienvenida");
    
    if(!titulo) return;
    
    const nombre = localStorage.getItem("nombreUsuario");
    
    if(nombre){
    
    titulo.textContent = "Bienvenido, " + nombre;
    
    }else{
    
    titulo.textContent = "Bienvenido";
    
    }
    
    }