class log {
    render(e){
        return `<span>${e.date}   <font color="green">LOG</font>   [${e.content}]</span></br>`;
    }
}

module.exports = log;