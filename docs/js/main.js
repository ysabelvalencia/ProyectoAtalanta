import { initSlider } from "./components/slider.js";
import { initHeaderMenu } from "./components/header.js";
import { initDiagnosticForm } from "./forms/diagnostic-form.js";
import { initScrollTop } from "./utils/scrollTop.js";
import { initPartnersCarousel } from "./components/partners-carousel.js";
import { initRegisterForm } from "./forms/register.js";
import { initUserWelcome } from "./utils/user.js";

document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  initHeaderMenu();
  initDiagnosticForm();
  initScrollTop();
  initPartnersCarousel();
  initRegisterForm();
  initUserWelcome();
});