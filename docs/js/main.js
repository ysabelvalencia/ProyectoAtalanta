import { initSlider } from "./components/slider.js";
import { initHeaderMenu } from "./components/header.js";
import { initDiagnosticForm } from "./forms/diagnostic-form.js";
import { initScrollTop } from "./utils/scrollTop.js";
import { initPartnersCarousel } from "./components/partners-carousel.js";
import { initRegisterForm } from "./forms/register.js";
import { initCheckAuth, initLogout, initUserWelcome } from "./utils/user.js";
import { initLoginForm } from "./forms/login.js";

document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  initHeaderMenu();
  initDiagnosticForm();
  initScrollTop();
  initPartnersCarousel();
  initRegisterForm();
  initLoginForm();

  const path = window.location.pathname;
  if (path.includes("user.html")) {
    initCheckAuth();
    initLogout();
    initUserWelcome();
  }
});