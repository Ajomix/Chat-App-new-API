const generateMessage = (message,name = 'BOT',avatar) =>{
    return {
        name, 
        message, 
        avatar,
        timestamp: new Date().getTime()
    }
}
const generateImage = (binary) =>{
    return {
        data:binary, 
        createAt:new Date().getTime()
    }   
}

module.exports = {
    generateMessage
}