export function initRegisterForm() {

    const form = document.getElementById("registerForm");
    
    if(!form) return;
    
    form.addEventListener("submit", function(e){
    
    e.preventDefault();
    
    const nombre = document.getElementById("user").value;
    
    // guardar nombre
    localStorage.setItem("nombreUsuario", nombre);
    
    // ir al panel usuario
    window.location.href = "user.html";
    
    });
    
    }