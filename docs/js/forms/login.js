export const initLoginForm = () => {
    const form = document.getElementById("loginForm");
  
    if (!form) return;
  
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitButton = form.querySelector("button[type='submit']");
  
    // Contenedor de mensajes
    let messageBox = document.getElementById("loginMessage");
  
    if (!messageBox) {
      messageBox = document.createElement("p");
      messageBox.id = "loginMessage";
      messageBox.style.marginTop = "10px";
      form.appendChild(messageBox);
    }
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      // Reset mensaje
      messageBox.textContent = "";
      messageBox.style.color = "red";
  
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
  
      // 🔹 Validaciones básicas
      if (!email || !password) {
        messageBox.textContent = "Todos los campos son obligatorios";
        return;
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        messageBox.textContent = "Email no válido";
        return;
      }
  
      try {
        // Estado loading
        submitButton.disabled = true;
        submitButton.textContent = "Cargando...";
  
        const response = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || "Error en login");
        }
  
        // Guardar token
        localStorage.setItem("token", data.token);
  
        // Redirección ÚNICA
        window.location.href = "dashboard.html";
  
      } catch (error) {
        console.error(error);
        messageBox.textContent =
          error.message || "Error de conexión con el servidor";
  
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Iniciar sesión";
      }
    });
  };