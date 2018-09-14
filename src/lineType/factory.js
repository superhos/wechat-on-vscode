class factory{
    static getType(type){
        const lineType = require(`./${type}`);
        if (lineType){
            return new lineType();
        }else{
            console.log(lineType);
        }
    }
}

module.exports = factory;