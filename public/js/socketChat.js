
const socket = io();

let idGeneral = window.location.href.split('/')[4] ;

socket.emit('id' , idGeneral )
 
socket.on('message',({name,message,timestamp,avatar})=>{

     
    const $messageTemplate = document.querySelector('#message-template').innerHTML;
    const namedisplay = Array.from(document.querySelectorAll('.name__user__boardchat'));

    if(namedisplay.length !== 0 ){
        if(namedisplay[namedisplay.length - 1].innerText.includes(name)){
            autoScroll();

            
            return document.querySelectorAll('.message-content')[namedisplay.length - 1].innerText += '\n' + message.toString();
            
        }
    }
    autoScroll();
    //moment(timestamp).format('lll')
    let html = $messageTemplate
                .replace('$name',name)
                .replace('$timestamp',moment(timestamp).format('lll'))  
                .replace('$avatar',avatar);
                 
    document.querySelector('.boardchat').insertAdjacentHTML('beforeend',html);
    return  document.querySelector('.message-content').innerText =   message ;
    
});

if(document.querySelector('#messenge-form')){
    document.querySelector('#messenge-form').addEventListener('submit',(e)=>{
        e.preventDefault();
        const input = document.querySelector('#message');
        const btn = document.querySelector('.btn__send');
        btn.setAttribute('disabled','disabled');


        socket.emit('message',{message:input.value,idGeneral},()=>{
            const json = {
                idGeneral,
                message:input.value,
                timestampe:new Date().getTime()
            }

            const option = {
                method:'POST',
                body:JSON.stringify(json),
                headers:{
                    'Content-Type': 'application/json' 
                }
            }

            fetch('/user/message',option).then(()=>console.log('save Success')).catch(e=>console.log(e))
            
            btn.removeAttribute('disabled');
            input.value = ""; 
            input.focus();
            
        });
    });
}



















//---------------------effect
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }
const autoScroll = ()=>{
    const messageBoard = document.querySelector('#message');
    messageBoard.scrollTop = messageBoard.offSetHeight;

}
autoScroll()
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
Array.from(document.querySelectorAll('.time__send')).forEach(val=>{
    val.innerHTML = moment(parseInt(val.innerHTML)).format('lll');
});   
})();


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

