// bigImg

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
// normalImg
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
function del(el){
   console.log(el)
};

document.querySelector('#avatar_changed').addEventListener('change',function(){
        var file = this.files;

        if(file[0].size < 1000000){
            var formData = new FormData();
            formData.append('avatar',file[0]);
            const options = {
                method:'POST',
                body:formData, 
            };
            return fetch('/user/avatar/me',options).then(()=>location.reload()).catch(e=>console.log(e));
        }
        
        return alert('Image need have size < 1mb , and accept Image')
        
})
 

document.querySelector('.edit_btn').addEventListener('click',()=>{
    // update_displayname.removeAttribute('readonly'); 
    document.querySelector('.profile_form').classList.toggle('profile_formActive') ;

    if(document.querySelector('.edit_btn').children[0].innerHTML.includes("Change")){
        document.querySelector('.edit_btn').children[0].innerHTML = "Back?";
        document.querySelector('.edit_btn').children[1].style['opacity'] = 0;
    }else{
        document.querySelector('.edit_btn').children[0].innerHTML = "Change";
        document.querySelector('.edit_btn').children[1].style['opacity'] = 1;
    }
    
})