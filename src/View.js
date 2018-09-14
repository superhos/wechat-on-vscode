const fs = require('fs');
const _ = require('lodash');

class View {

    constructor(){
        this.original = fs.readFileSync(`${__dirname}/template/main.html`).toString();
        this.styleSheet = fs.readFileSync(`${__dirname}/template/main.css`).toString();
    }

    render(data){
        let template = _.cloneDeep(this.original);
        for (const key in data){
            template = template.replace('\$\{'+key+'\}',data[key]);
        }

        template = template.replace('\$\{styles\}',this.styleSheet);
        // console.log(template);
        return template;
    }

}

module.exports = View;