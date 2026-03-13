export function initPartnersCarousel(){

  const track = document.querySelector(".partners__track")
  const logos = document.querySelectorAll(".partners__logo")

  const nextBtn = document.querySelector(".next")
  const prevBtn = document.querySelector(".prev")

  if(!track || logos.length === 0) return

  let page = 0

  function getVisible(){
    if(window.innerWidth >= 768) return 4
    return 1
  }

  function update(){

    const container = document.querySelector(".partners__carousel")
    const containerWidth = container.offsetWidth

    track.style.transform = `translateX(${-containerWidth * page}px)`
  }

  function maxPage(){
    const visible = getVisible()
    return Math.ceil(logos.length / visible) - 1
  }

  function goNext(){

    const max = maxPage()

    page++

    if(page > max){
      page = 0
    }

    update()
  }

  function goPrev(){

    const max = maxPage()

    page--

    if(page < 0){
      page = max
    }

    update()
  }

  nextBtn?.addEventListener("click", goNext)
  prevBtn?.addEventListener("click", goPrev)

  window.addEventListener("resize",()=>{
    page = 0
    update()
  })

  update()
}