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

  h1.textContent = `Bienvenido ${user.user_name}`; 
}

//------------------------------------------------------------------------//

export function initTicketModal() {
  const openBtn = document.getElementById("openModal");
  const modal = document.getElementById("modalTicket");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("ticketForm");
  const tbody = document.getElementById("ticketsBody");

  if (!openBtn || !modal || !closeBtn || !form || !tbody) return;

  const titleInput = form.querySelector("input");
  const descInput = form.querySelector("textarea");

  // abrir modal
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // cerrar modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  renderTickets();

  // guardar ticket
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTicket = {
      title: titleInput.value,
      description: descInput.value,
      status: "Abierto",
      date: new Date().toLocaleDateString()
    };

    tickets.push(newTicket);
    localStorage.setItem("tickets", JSON.stringify(tickets));

    renderTickets();

    form.reset();
    modal.classList.add("hidden");
  });

  function renderTickets() {
    tbody.innerHTML = "";

    tickets.forEach((ticket, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${ticket.title}</td>
        <td>${ticket.status}</td>
        <td>${ticket.date}</td>
        <td>
          <button class="view-btn" data-index="${index}">Ver</button>
          <button class="delete-btn" data-index="${index}">Eliminar</button>
        </td>
      `;

      // VER DESCRIPCIÓN
      row.querySelector(".view-btn").addEventListener("click", () => {
        alert(ticket.description);
      });

      // ELIMINAR
      row.querySelector(".delete-btn").addEventListener("click", () => {
        tickets.splice(index, 1);
        localStorage.setItem("tickets", JSON.stringify(tickets));
        renderTickets();
      });

      tbody.appendChild(row);
    });
  }
}

//-----------------------------------------------------------------------//
export async function initGetProfile() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:4000/api/auth/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    console.log("Perfil:", data);

  } catch (error) {
    console.error("Error:", error.message);
  }
}