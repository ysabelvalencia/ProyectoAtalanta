// user.js

export function initCheckAuth() {
  const token = localStorage.getItem("token");
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

// MOSTRAR EL NOMBRE DEL USUARIO
export function initUserWelcome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const h1 = document.getElementById("bienvenida");

  if (!user || !h1) return;

  h1.textContent = `Sesión de ${user.user_name}`;
}

//------------------------------------------------------------------------//
// VENTANA MODAL TICKET

export function initTicketModal() {
  console.log("INIT TICKET MODAL");

  const openBtn = document.getElementById("openModal");
  const modal = document.getElementById("modalTicket");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("ticketForm");
  const tbody = document.getElementById("ticketsBody");

  if (!openBtn || !modal || !closeBtn || !form || !tbody) return;

  const titleInput = form.querySelector("input");
  const descInput = form.querySelector("textarea");

  const token = localStorage.getItem("token");

  // ABRIR
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // CERRAR
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // CARGAR TICKETS DESDE EL BACKEND

  async function loadTickets() {
    try {
      const response = await fetch("http://localhost:4000/api/tickets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      if (!Array.isArray(data)) {
        console.error("ERROR: data no es array", data);
        return;
      }
      renderTickets(data);
    } catch (error) {
      console.error("Error cargando tickets:", error.message);
    }
  }
  loadTickets();

  // GUARDAR TICKETS

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!titleInput.value.trim() || !descInput.value.trim()) {
      alert("Los campos no pueden estar vacíos");
      return;
    }

    const newTicket = {
      title: titleInput.value,
      description: descInput.value,
    };

    try {
      // ENVIAR TICKETS AL BACKEND
      const response = await fetch("http://localhost:4000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTicket),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log("Ticket creado en BD:", data);

      loadTickets();

      form.reset();
      modal.classList.add("hidden");
    } catch (error) {
      console.error("Error:", error.message);
    }
  });

  // MOSTRAR HISTORIAL DE TICKETS

  function renderTickets(tickets) {
    tbody.innerHTML = "";

    tickets.forEach((ticket) => {
      const row = document.createElement("tr");

      const tdTitle = document.createElement("td");
      tdTitle.textContent = ticket.title;

      const tdStatus = document.createElement("td");
      tdStatus.textContent = ticket.status;

      const tdDate = document.createElement("td");
      tdDate.textContent = new Date(ticket.created_at).toLocaleDateString();

      const tdActions = document.createElement("td");

      const btnView = document.createElement("button");
      btnView.textContent = "Ver";

      btnView.addEventListener("click", () => {
        alert(ticket.description);
      });

      // BOTÓN ELIMINAR
      const btnDelete = document.createElement("button");
      btnDelete.textContent = "Eliminar";
      btnDelete.style.marginLeft = "10px";

      btnDelete.addEventListener("click", async () => {
        const confirmDelete = confirm(
          "¿Seguro que quieres eliminar este ticket?",
        );
        if (!confirmDelete) return;

        try {
          const response = await fetch(
            `http://localhost:4000/api/tickets/${ticket.id_ticket}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, 
              },
            },
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message);
          }

          console.log("Ticket eliminado");

          //RECARGAR LISTA DESDE BACKEND
          loadTickets();
        } catch (error) {
          console.error("Error eliminando:", error.message);
        }
      });

      //BOTONES
      tdActions.appendChild(btnView);
      tdActions.appendChild(btnDelete);

      //COLUMNAS, FILAS
      row.appendChild(tdTitle);
      row.appendChild(tdStatus);
      row.appendChild(tdDate);
      row.appendChild(tdActions);
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
        Authorization: `Bearer ${token}`,
      },
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
