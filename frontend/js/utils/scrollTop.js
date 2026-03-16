export function initScrollTop() {
  const scrollTopBtn = document.querySelector(".scroll-top");

  if (!scrollTopBtn) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });
  scrollTopBtn.addEventListener("click", (e) => {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
