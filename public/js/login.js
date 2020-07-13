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
    const password = document.querySelector('#password').value ;

    const json = {
        username, 
        password
    }
    const options = {
        method:'POST',
        body:JSON.stringify(json)
        , headers:{
            'Content-Type': 'application/json'
        }
    }

    const req = await fetch('user/login',options);
    if(!req){
        return console.log('Failed to Login');
    }
    return window.location.href = '/myfriend';
})