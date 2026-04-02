export function initRegisterForm() {
  const form = document.getElementById("registerForm");

  if (!form) return;

  const nombreInput = document.getElementById("nombre");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitButton = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    //  Validación
    if (!nombre || !email || !password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email no válido");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Registrando...";

      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_name: nombre, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en registro");
      }

      //AUTOLOGIN 
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Usuario registrado correctamente");

      //REDIRECCIÓN DIRECTA
      window.location.href = "../pages/user.html"

    } catch (error) {
      console.error(error);
      alert(error.message || "Error de conexión");

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Crear cuenta";
    }
  });
}



