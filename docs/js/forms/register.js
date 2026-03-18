export function initRegisterForm() {
  const form = document.getElementById("registerForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Usuario creado correctamente");

      window.location.href = "/docs/pages/login.html";

    } catch (error) {
      console.error(error);
    }
  });
}




// export function initRegisterForm() {

//     const form = document.getElementById("registerForm");
    
//     if(!form) return;
    
//     form.addEventListener("submit", function(e){
    
//     e.preventDefault();
    
//     const nombre = document.getElementById("user").value;
    
//     // guardar nombre
//     localStorage.setItem("nombreUsuario", nombre);
    
//     // ir al panel usuario
//     window.location.href = "user.html";
    
//     });
    
//     }