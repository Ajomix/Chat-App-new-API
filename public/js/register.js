function bigger(el){
    // el.parentElement.lastElementChild.style['height'] = '40px';
    el.parentElement.lastElementChild.className = 'inp hovers';
};
function normal(el){
    if(el.parentElement.lastElementChild.value === ''){
        el.parentElement.lastElementChild.className = 'inp';
    }
};
function doing(el){
    if(el.value !== ''){
        el.parentElement.lastElementChild.className = 'inp hovers';
    }
}

document.querySelector('form').addEventListener('submit',async(e)=>{
    e.preventDefault(); 
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value; 
    const email = document.querySelector('#email').value; 
    const displayname = document.querySelector('#displayname').value;

    const json = {
        username, 
        password, 
        email, 
        displayname
    };
    const options = {
        method:'POST',
        body:JSON.stringify(json)
        , headers:{
            'Content-Type': 'application/json' 
        }
    };
    const req = await fetch('user/register',options)
    if(!req || req.status === 400 ) {
       return console.log('cant register'+ req)
    }
    return window.location.href = '/login'
    
    
})