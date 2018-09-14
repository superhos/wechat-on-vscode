class img {
    render(e){
        return `<span>${e.date} <font style="color:#c2c2c2">IMG</font> <img src="${e.content}" /></span></br>`;
    }
}

module.exports = img;