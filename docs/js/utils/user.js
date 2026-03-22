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
    localStorage.removeItem("token");
    window.location.href = "/docs/pages/login.html";
  });
}

// MOSTRAR NOMBRE USUARIO
export function initUserWelcome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const h1 = document.getElementById("bienvenida");

  if (!user || !h1) return;

  h1.textContent = `Sesión de ${user.user_name}`;
}

//------------------------------------------------------------//

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

  // 🔥 FIX IMPORTANTE: obtener usuario correctamente
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("USER:", user);

  // 🔥 FIX IMPORTANTE: usar "role" (no "rol")
  const isWorker = user?.role === "trabajador";

  // ABRIR MODAL
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // CERRAR MODAL
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  //------------------------------------------------------------//
  // 🔥 CARGAR TICKETS SEGÚN ROL

  async function loadTickets() {
    try {
      const url = isWorker
        ? "http://localhost:4000/api/tickets/assigned"
        : "http://localhost:4000/api/tickets";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("DATA:", data);

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

  //------------------------------------------------------------//
  // CREAR TICKET (solo cliente)

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

      console.log("Ticket creado:", data);

      loadTickets();

      form.reset();
      modal.classList.add("hidden");

    } catch (error) {
      console.error("Error:", error.message);
    }
  });

  //------------------------------------------------------------//
  // RENDER TICKETS

  function renderTickets(tickets) {
    tbody.innerHTML = "";

    tickets.forEach((ticket) => {
      const row = document.createElement("tr");

      // TÍTULO
      const tdTitle = document.createElement("td");
      tdTitle.textContent = ticket.title;

      // ESTADO
      const tdStatus = document.createElement("td");

      if (isWorker) {
        // 🔥 TRABAJADOR → SELECT
        const select = document.createElement("select");

        ["abierto", "en_proceso", "cerrado"].forEach((estado) => {
          const option = document.createElement("option");
          option.value = estado;
          option.textContent = estado;

          if (estado === ticket.status) {
            option.selected = true;
          }

          select.appendChild(option);
        });

        // CAMBIAR ESTADO
        select.addEventListener("change", async () => {
          try {
            const response = await fetch(
              `http://localhost:4000/api/tickets/${ticket.id_ticket}/status`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  status: select.value,
                }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message);
            }

            console.log("Estado actualizado:", data);

          } catch (error) {
            console.error("Error:", error.message);
          }
        });

        tdStatus.appendChild(select);

      } else {
        // 🔥 CLIENTE → TEXTO
        tdStatus.textContent = ticket.status;
      }

      // FECHA
      const tdDate = document.createElement("td");
      tdDate.textContent = new Date(ticket.created_at).toLocaleDateString();

      // ACCIONES
      const tdActions = document.createElement("td");

      const btnView = document.createElement("button");
      btnView.textContent = "Ver";

      btnView.addEventListener("click", () => {
        alert(ticket.description);
      });

      tdActions.appendChild(btnView);

      // 🔥 SOLO CLIENTE PUEDE ELIMINAR
      if (!isWorker) {
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Eliminar";
        btnDelete.style.marginLeft = "10px";

        btnDelete.addEventListener("click", async () => {
          const confirmDelete = confirm("¿Seguro que quieres eliminar?");
          if (!confirmDelete) return;

          try {
            const response = await fetch(
              `http://localhost:4000/api/tickets/${ticket.id_ticket}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message);
            }

            console.log("Ticket eliminado");

            loadTickets();

          } catch (error) {
            console.error("Error eliminando:", error.message);
          }
        });

        tdActions.appendChild(btnDelete);
      }

      // MONTAR FILA
      row.appendChild(tdTitle);
      row.appendChild(tdStatus);
      row.appendChild(tdDate);
      row.appendChild(tdActions);

      tbody.appendChild(row);
    });
  }
}

//------------------------------------------------------------//

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