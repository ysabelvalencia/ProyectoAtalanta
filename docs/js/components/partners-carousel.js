export function initPartnersCarousel() {

  const track = document.querySelector(".partners__track")
  const logos = document.querySelectorAll(".partners__logo")

  const nextBtn = document.querySelector(".next")
  const prevBtn = document.querySelector(".prev")

  if (!track || logos.length === 0) return

  let page = 0
  let interval

 
  function getVisible() {
    if (window.innerWidth >= 768) return 4
    return 1
  }

 
  function maxPage() {
    const visible = getVisible()
    return logos.length - visible
  }


  function update() {
    const logoWidth = logos[0].offsetWidth
    track.style.transform = `translateX(${-logoWidth * page}px)`
  }


  function goNext() {
    const max = maxPage()

    if (page >= max) {
      page = 0
    } else {
      page++
    }

    update()
  }


  function goPrev() {
    const max = maxPage()

    if (page <= 0) {
      page = max
    } else {
      page--
    }

    update()
  }


  function startAuto() {
    interval = setInterval(goNext, 3000)
  }


  function resetAuto() {
    clearInterval(interval)
    startAuto()
  }


  nextBtn?.addEventListener("click", () => {
    goNext()
    resetAuto()
  })

  prevBtn?.addEventListener("click", () => {
    goPrev()
    resetAuto()
  })

  window.addEventListener("resize", () => {
    page = 0
    update()
  })

  startAuto()
  update()
}