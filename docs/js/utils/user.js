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
//------------------------------------------------------------//
// MOSTRAR NOMBRE USUARIO
export function initUserWelcome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const h1 = document.getElementById("bienvenida");

  if (!user || !h1) return;

  h1.textContent = `Sesión de ${user.user_name}`;
}

//------------------------------------------------------------//
//CREAR TICKETS

export function initTicketModal() {
  console.log("INIT TICKET MODAL");

  const openBtn = document.getElementById("openModal");
  const modal = document.getElementById("modalTicket");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("ticketForm");
  const tbody = document.getElementById("ticketsBody");
  const cardCreate = document.getElementById("cardCreateTicket");

  if (!tbody) return;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) return;

  //------------------------------------------------------------//
  //CONTROL UI POR ROL
  const STAFF_ROLES = ["trabajador", "jefe", "admin"];
  const isStaff =
    user.role === "trabajador" || user.role === "jefe" || user.role === "admin";

  console.log("ROLE:", user.role);
  console.log("IS STAFF:", isStaff);

  if (isStaff) {
    cardCreate?.classList.add("hidden");
  }

  //------------------------------------------------------------//
  // MODAL (SOLO CLIENTE)

  if (!isStaff && openBtn && modal && closeBtn && form) {
    const titleInput = form.querySelector("input");
    const descInput = form.querySelector("textarea");

    openBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });

    // CREAR TICKET
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
  }

  //------------------------------------------------------------//
  // CARGAR TICKETS SEGÚN ROL

  async function loadTickets() {
    try {
      const url = isStaff
        ? "http://localhost:4000/api/tickets/assigned"
        : "http://localhost:4000/api/tickets";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("TICKETS BACK:", data);

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
  // RENDER TICKETS

  function renderTickets(tickets) {
    tbody.innerHTML = "";

    tickets.forEach((ticket) => {
      const row = document.createElement("tr");

      // TÍTULO
      const tdTitle = document.createElement("td");
      tdTitle.textContent = ticket.title;

      // ESTADO (SIEMPRE TEXTO)
      const tdStatus = document.createElement("td");
      tdStatus.textContent = ticket.status;

      // FECHA
      const tdDate = document.createElement("td");
      tdDate.textContent = new Date(ticket.created_at).toLocaleDateString();

      // ACCIONES
      const tdActions = document.createElement("td");

      // VER
      const btnView = document.createElement("button");
      btnView.innerHTML = `<i class="fa-solid fa-eye"></i>`;
      btnView.classList.add("btnUser", "btn-view");

      btnView.addEventListener("click", () => {
        localStorage.setItem("selectedTicket", JSON.stringify(ticket));
        window.location.href = "/docs/pages/ticket-detail.html";
      });

      tdActions.appendChild(btnView);

      //------------------------------------------------------------//
      // SOLO CLIENTE PUEDE ELIMINAR

      if (!isStaff) {
        const btnDelete = document.createElement("button");
        btnDelete.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        btnDelete.classList.add("btnUser", "btn-delete");

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
              },
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

      //------------------------------------------------------------//

      row.appendChild(tdTitle);
      row.appendChild(tdStatus);
      row.appendChild(tdDate);
      row.appendChild(tdActions);

      tbody.appendChild(row);
    });
  }
}

//------------------------------------------------------------//
// PERFIL

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
