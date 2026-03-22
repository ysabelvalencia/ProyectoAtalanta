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
  if (desc) {
    desc.textContent = ticket.description;
  }

  //--------------------------------------------------
  // ESTADO

  const estados = ["abierto", "en proceso", "cerrado"];

  statusSelect.innerHTML = "";

  estados.forEach((estado) => {
    const option = document.createElement("option");
    option.value = estado;
    option.textContent = estado;

    if (estado === ticket.status) option.selected = true;

    statusSelect.appendChild(option);
  });

  // SOLO STAFF PUEDE CAMBIAR
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
        },
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
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      renderComments(data.comments);
    } catch (error) {
      console.error(error.message);
    }
  }

  loadComments();

  //--------------------------------------------------
  // RENDER COMMENTS

  function renderComments(comments) {
    comments.forEach((c) => {
      const div = document.createElement("div");
      div.classList.add("comment");

      div.innerHTML = `
      <img src="https://i.pravatar.cc/40?u=${c.id_user}" alt="avatar">

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
    // EVENTOS DELETE (después de renderizar)

    document.querySelectorAll(".comment-delete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.id;

        try {
          const res = await fetch(`http://localhost:4000/api/comments/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message);

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
        `http://localhost:4000/api/tickets/${ticket.id_ticket}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        },
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
