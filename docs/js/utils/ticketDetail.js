export function initTicketDetail() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const ticket = JSON.parse(localStorage.getItem("selectedTicket"));

  if (!token || !user || !ticket) return;

  const STAFF_ROLES = ["trabajador", "jefe", "admin"];
  const isStaff = STAFF_ROLES.includes(user.role);

  // ELEMENTOS
  const title = document.getElementById("ticketTitle");
  if (!title) return;
  const desc = document.getElementById("ticketDescription");
  const statusSelect = document.getElementById("statusSelect");
  const saveBtn = document.getElementById("saveStatusBtn");
  const commentsContainer = document.getElementById("commentsContainer");
  const commentInput = document.getElementById("commentInput");
  const sendBtn = document.getElementById("sendCommentBtn");

  // RENDER INFO
  title.textContent = ticket.title;
  desc.textContent = ticket.description;

  //--------------------------------------------------
  // ESTADO

  const estados = ["abierto", "en_proceso", "cerrado"];

  estados.forEach((estado) => {
    const option = document.createElement("option");
    option.value = estado;
    option.textContent = estado;

    if (estado === ticket.status) option.selected = true;

    statusSelect.appendChild(option);
  });

  // 🔥 SOLO STAFF PUEDE CAMBIAR
  if (!isStaff) {
    statusSelect.disabled = true;
    saveBtn.style.display = "none";
  }

  saveBtn?.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tickets/${ticket.id_ticket}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: statusSelect.value }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      alert("Estado actualizado");

    } catch (error) {
      console.error(error.message);
    }
  });

  //--------------------------------------------------
  // CARGAR COMENTARIOS

  async function loadComments() {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tickets/${ticket.id_ticket}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      renderComments(data);

    } catch (error) {
      console.error(error.message);
    }
  }

  loadComments();

  //--------------------------------------------------
  // RENDER COMMENTS

  function renderComments(comments) {
    commentsContainer.innerHTML = "";

    comments.forEach((c) => {
      const div = document.createElement("div");

      div.innerHTML = `
        <p>${c.content}</p>
        <small>${new Date(c.created_at).toLocaleString()}</small>
      `;

      // 🔥 SOLO STAFF PUEDE BORRAR
      if (isStaff) {
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Eliminar";

        btnDelete.addEventListener("click", async () => {
          try {
            const res = await fetch(
              `http://localhost:4000/api/comments/${c.id_comment}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            loadComments();

          } catch (error) {
            console.error(error.message);
          }
        });

        div.appendChild(btnDelete);
      }

      commentsContainer.appendChild(div);
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
        `http://localhost:4000/api/tickets/${ticket.id_ticket}/comments`,
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
}