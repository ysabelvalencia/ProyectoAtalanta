import { initSlider } from "./slider.js";
import { initHeaderMenu } from "./header.js";
import { initDiagnosticForm } from "./diagnostic-form.js";
import { initScrollTop } from "./scrollTop.js";

document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  initHeaderMenu();
  initDiagnosticForm();
  initScrollTop();
});