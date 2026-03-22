export function initTicketDetail() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const storedTicket = JSON.parse(localStorage.getItem("selectedTicket"));

  if (!token || !user || !storedTicket) return;

  const ticketId = storedTicket.id_ticket;

  const STAFF_ROLES = ["trabajador", "jefe", "admin"];
  const isStaff = STAFF_ROLES.includes(user.role);

  // ELEMENTOS
  const title = document.getElementById("ticketTitle");
  if (!title) return;

  const desc = document.getElementById("ticketDescription");
  const statusSelect = document.getElementById("statusSelect");
  const saveBtn = document.getElementById("saveStatusBtn");

  const createdBy = document.getElementById("createdBy");
  const createdAt = document.getElementById("createdAt");

  const commentsContainer = document.getElementById("commentsContainer");
  const commentInput = document.getElementById("commentInput");
  const sendBtn = document.getElementById("sendCommentBtn");

  let ticket = null;

  //--------------------------------------------------
  // CARGAR TICKET REAL DESDE BACKEND

  async function loadTicket() {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tickets/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      ticket = data;

      renderTicket();
    } catch (error) {
      console.error("Error cargando ticket:", error.message);
    }
  }

  //--------------------------------------------------
  // RENDER TICKET

  function renderTicket() {
    title.textContent = ticket.title;

    if (desc) {
      desc.textContent = ticket.description;
    }

    if (createdBy) {
      createdBy.textContent = ticket.user_name || "Desconocido";
    }

    if (createdAt) {
      createdAt.textContent = new Date(
        ticket.created_at
      ).toLocaleString();
    }

    // ESTADO
    const estados = ["abierto", "en_proceso", "cerrado"];

    statusSelect.innerHTML = "";

    estados.forEach((estado) => {
      const option = document.createElement("option");
      option.value = estado;
      option.textContent =
        estado === "en_proceso" ? "en proceso" : estado;

      if (estado === ticket.status) option.selected = true;

      statusSelect.appendChild(option);
    });

    if (!isStaff) {
      statusSelect.disabled = true;
      saveBtn.style.display = "none";
    }
  }

  //--------------------------------------------------
  // CAMBIAR ESTADO

  saveBtn?.addEventListener("click", async () => {
    const newStatus = statusSelect.value;

    if (!newStatus) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/tickets/${ticket.id_ticket}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      ticket.status = newStatus;

      alert("Estado actualizado correctamente");
    } catch (error) {
      console.error(error.message);
    }
  });

  //--------------------------------------------------
  // CARGAR COMENTARIOS

  async function loadComments() {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tickets/${ticketId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      renderComments(data.comments);
    } catch (error) {
      console.error(error.message);
    }
  }

  //--------------------------------------------------
  // RENDER COMMENTS

  function renderComments(comments) {
    commentsContainer.innerHTML = "";

    comments.forEach((c) => {
      const div = document.createElement("div");
      div.classList.add("comment");

      div.innerHTML = `
        <img src="https://icones.pro/wp-content/uploads/2022/07/icones-d-administration-rouge.png" alt="avatar">

        <div class="comment-content">

          <div class="comment-header">
            <strong>${c.user_name || "Usuario"}</strong> · 
            ${new Date(c.created_at).toLocaleString()}
          </div>

          <div class="comment-text">
            ${c.content}
          </div>

          ${
            isStaff
              ? `<span class="comment-delete" data-id="${c.id_comment}">
                  <i class="fa-solid fa-trash"></i>
                 </span>`
              : ""
          }

        </div>
      `;

      commentsContainer.appendChild(div);
    });

    //--------------------------------------------------
    // BORRAR COMENTARIO

    document.querySelectorAll(".comment-delete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.id;

        try {
          const res = await fetch(
            `http://localhost:4000/api/tickets/comments/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            const text = await res.text();
            console.error("Backend error:", text);
            throw new Error("Error eliminando comentario");
          }

          loadComments();
        } catch (error) {
          console.error(error.message);
        }
      });
    });
  }

  //--------------------------------------------------
  // CREAR COMENTARIO

  if (!isStaff) {
    sendBtn.style.display = "none";
    commentInput.style.display = "none";
  }

  sendBtn?.addEventListener("click", async () => {
    const content = commentInput.value.trim();

    if (!content) return alert("Comentario vacío");

    try {
      const response = await fetch(
        `http://localhost:4000/api/tickets/${ticketId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      commentInput.value = "";
      loadComments();
    } catch (error) {
      console.error(error.message);
    }
  });

  //--------------------------------------------------
  // INIT

  loadTicket();
  loadComments();
}