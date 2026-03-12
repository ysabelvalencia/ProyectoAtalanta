export function initPartnersCarousel(){

    const track = document.querySelector(".partners__track")
    const logos = document.querySelectorAll(".partners__logo")
    
    const nextBtn = document.querySelector(".next")
    const prevBtn = document.querySelector(".prev")
    
    if(!track || logos.length === 0) return
    
    let page = 0
    
    function getVisible(){
    
      if(window.innerWidth >= 1200) return 4
      if(window.innerWidth >= 768) return 3
      return 2
    
    }
    
    function update(){
    
      const visible = getVisible()
      const logoWidth = logos[0].getBoundingClientRect().width
      const gap = window.innerWidth < 768 ? 30 : 60
    
      const move = (logoWidth + gap) * visible * page
    
      track.style.transform = `translateX(${-move}px)`
    
    }
    
    function maxPage(){
    
      const visible = getVisible()
      return Math.ceil(logos.length / visible) - 1
    
    }
    
    nextBtn?.addEventListener("click",()=>{
    
      if(page < maxPage()){
        page++
      }else{
        page = 0
      }
    
      update()
    
    })
    
    prevBtn?.addEventListener("click",()=>{
    
      if(page > 0){
        page--
      }else{
        page = maxPage()
      }
    
      update()
    
    })
    
    window.addEventListener("resize",()=>{
    
      page = 0
      update()
    
    })
    
    }