// user.js

export function initCheckAuth() {
  const token = localStorage.getItem("token");

  // si no hay token → fuera
  if (!token) {
    window.location.href = "/docs/pages/login.html";
  }
}

export function initLogout() {
  const btnLogout = document.getElementById("logoutBtn");
  if (!btnLogout) return;

  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token"); // borrar token
    window.location.href = "/docs/pages/login.html"; // redirigir
  });
}

// mostrar nombre del usuario
export function initUserWelcome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const h1 = document.getElementById("bienvenida");

  if (!user || !h1) return;

  h1.textContent = `Bienvenido ${user.nombre}`; 
}

export function initTicketModal() {
  const openBtn = document.querySelector(".btn-red");
  const modal = document.getElementById("modalTicket");
  const closeBtn = document.getElementById("closeModal");

  if (!openBtn || !modal || !closeBtn) return;

  // abrir modal
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // cerrar modal (X)
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // cerrar clicando fuera
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
}
