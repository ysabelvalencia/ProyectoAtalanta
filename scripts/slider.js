export function initSlider() {

    const slides = document.querySelectorAll(".hero-slider__slide");
    const dots = document.querySelectorAll(".hero-slider__dot");
  
    const prev = document.querySelector(".hero-slider__control--prev");
    const next = document.querySelector(".hero-slider__control--next");
  
    if (!slides.length) return;
  
    let index = 0;
    let autoplayInterval;
  
    function showSlide(i) {
  
      slides.forEach(slide =>
        slide.classList.remove("hero-slider__slide--active")
      );
  
      dots.forEach(dot =>
        dot.classList.remove("hero-slider__dot--active")
      );
  
      slides[i].classList.add("hero-slider__slide--active");
      dots[i].classList.add("hero-slider__dot--active");
  
      index = i;
    }
  
    function nextSlide() {
      let newIndex = index + 1;
  
      if (newIndex >= slides.length) {
        newIndex = 0;
      }
  
      showSlide(newIndex);
    }
  
    function prevSlide() {
      let newIndex = index - 1;
  
      if (newIndex < 0) {
        newIndex = slides.length - 1;
      }
  
      showSlide(newIndex);
    }
  
    /* CONTROLS */
  
    next.addEventListener("click", () => {
      nextSlide();
      restartAutoplay();
    });
  
    prev.addEventListener("click", () => {
      prevSlide();
      restartAutoplay();
    });
  
    /* DOTS */
  
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        showSlide(i);
        restartAutoplay();
      });
    });
  
    /* AUTOPLAY */
  
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        nextSlide();
      }, 6000);
    }
  
    function restartAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }
  
    startAutoplay();
  }