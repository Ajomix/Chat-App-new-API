// bigImg
// normalImg
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }
function hov(el){
    el.children[2].className = "layout__friendbox";
}
function unhov(el){
    el.children[2].className = "";    
}
function big(el){
    el.style.clipPath = 'ellipse(10% 33% at 0% 50%)';
};
function normal(el){
    el.removeAttribute("style");
};
function lighten(el){
    if(!el.className.includes('active')){
        el.style['background-color'] =' #414348';
        el.style['color'] = '#f1f2f3';
    }
};
function normalColor(el){
    if(!el.className.includes('active')){
        el.removeAttribute("style");
    }
};

(()=>{
let cur = 0 ;
const aTag = document.querySelectorAll('.friend__btn');
aTag.forEach((el, index)=>{
    el.addEventListener('click',()=>{
        for(let i = 0; i<=2; i++){
            if(aTag[i].className.includes('active')){
                cur = i;
            }
        };
        el.removeAttribute("style");
        aTag[cur].className = aTag[cur].className.replace(' active','');
        el.className = 'friend__btn active';
    });
})
})();
//chat bar 
(()=>{
    let cur = 0 ;
    const aTag = document.querySelectorAll('.chatbar__btn');
    aTag.forEach((el, index)=>{
        el.addEventListener('click',()=>{
            for(let i = 0; i<=4; i++){
                if(aTag[i].className.includes('active2')){
                    cur = i;
                }
            }
            el.removeAttribute("style");
            aTag[cur].className = aTag[cur].className.replace('active2','');
            el.className = 'active2';
        });
    });
})();
if(document.querySelector('.addfr__btn')){
    document.querySelector('.addfr__btn').addEventListener('click',async()=>{
        let id = prompt('Enter Id user you want','id');
        
        const response = await fetch('/user/add/'+id,{
            method:'POST'
        })
    
        location.reload();
        console.log(response)
    })
    
    
}

 


