// assume this is the database
// a array of 250 transaction objects
function database(){
    this.logs=[];
    for(var i=0; i<250;i++){
            var d={};
            d.index=i;  // unique id of each transaction log. 
                        // Increments by 1 for each new transaction. 
                        // and independent for each user
            d.date= Date.UTC(2012,(i/30)%12,i%30);
            d.name= "Name "+i.toString();
            d.amount= i*2+1;
            this.logs.push(d);
    }
    this.getlogs=function(){
        return this.logs;
    };
}

module.exports = database;