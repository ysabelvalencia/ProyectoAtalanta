export function initDiagnosticForm() {
  const form = document.querySelector("#diagnosticForm");

  if (!form) return;

  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const companyInput = document.querySelector("#company");
  const privacyCheckbox = document.querySelector("#privacy");

  form.addEventListener("submit", function (e) {
    clearErrors();

    let valid = true;

    if (nameInput.value.trim() === "") {
      showError(nameInput, "Introduce tu nombre");
      valid = false;
    }

    if (!validateEmail(emailInput.value)) {
      showError(emailInput, "Introduce un email válido");
      valid = false;
    }

    if (companyInput.value.trim() === "") {
      showError(companyInput, "Introduce tu empresa");
      valid = false;
    }

    if (!privacyCheckbox.checked) {
      alert("Debes aceptar la política de privacidad");
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
    }
  });

  function showError(input, message) {
    const error = input.parentElement.querySelector(".diagnostic__error");

    input.classList.add("diagnostic__input--error");

    if (error) {
      error.textContent = message;
    }
  }

  function clearErrors() {
    document.querySelectorAll(".diagnostic__error").forEach((e) => {
      e.textContent = "";
    });

    document.querySelectorAll(".diagnostic__input").forEach((input) => {
      input.classList.remove("diagnostic__input--error");
    });
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
