export function initLoginForm() {
  const form = document.getElementById("loginForm");

  if (!form) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitButton = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // VALIDACIÓN FRONT
    if (!email || !password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email no válido");
      return;
    }

    try {
      // LOADING
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

      // TOKEN + USER
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "../pages/user.html";

    } catch (error) {
      console.error(error);
      alert(error.message || "Error conectando con el servidor");

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Iniciar sesión";
    }
  });
}