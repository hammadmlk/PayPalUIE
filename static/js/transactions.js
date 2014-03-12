
window.PrevRowNumOnTop=0;
window.latest_trans_ID
maxRows = 0;
var loaderObj;
var transactionArray=[];

  
window.onload=function(){
    
    //these functions all make use of DOM elements, keep them inside onload so they dont run before DOM is loaded
    loaderObj = document.getElementById("loading");
    get_latest_transactions();  
    window.onscroll = scroll;   

    //back button
    document.getElementById("backBtn").onclick=function(){
        window.location = '/';
    };
    
};

//scroll function
// loads new data when only 10 rows remain below the top row on screen
// fetches the latest data when user scroll up to top
function scroll () {
     
    //Table's row number currently seen on top 
    var heightofRow = 45; //pixels
    var RowNumOnTop = Math.floor(window.pageYOffset/heightofRow);

    //NumOfRows on Page
    var RowsOnPage = Math.floor(window.innerHeight/heightofRow);
    
    //scroll up or down 
    var scrollUp, scrollDown;
    if (window.PrevRowNumOnTop>RowNumOnTop){
        scrollUp = true;
        scrollDown = false;
        window.PrevRowNumOnTop = RowNumOnTop;
    }else if(window.PrevRowNumOnTop<RowNumOnTop){
        scrollUp = false;
        scrollDown = true;
        window.PrevRowNumOnTop = RowNumOnTop;
    }else{
        scrollUp = false;
        scrollDown = false;
    }
      
    //console.log('row num on top',RowNumOnTop, 'rows on page: ', RowsOnPage);
    
    //need to get more data
    if(scrollDown && RowNumOnTop+RowsOnPage+10>maxRows){
        getNextOlder20Transactions(window.latest_trans_ID - maxRows+1)
    }
    //refresh/load latest data
    if(scrollUp && RowNumOnTop===0 && window.pageYOffset){
        get_latest_transactions()
    }
    //all set for caching
}


//getNextOlder20Transactions
// gets the next 20 transactions starting from prevLastId
// sends data by GET. See NodeJs get_transactions for details on protocol 
function getNextOlder20Transactions(prevLastId){  
    var logLength=20;
    
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==0){
            loaderObj.style.display = 'block';
        }
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            //success
            
            ans = xmlhttp.responseText;
            ans = JSON.parse(ans);
            
            maxRows += ans.length; 
            
            transactionArray = ans.concat(transactionArray);
            
            loaderObj.style.display = 'none';
            //console.log('transactions: ', ans);
            dispTrans();
        }
        else if (xmlhttp.readyState==4){
            //fail
            alert('Ops!! Problem contacting the server. Try again maybe?')
            console.log('error 004x');
            loaderObj.style.display = 'none';
        }
    }    
    xmlhttp.open("GET",'/get_transactions?logStartIndex='+prevLastId+'&logLength='+(logLength).toString(),true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
};


//get_latest_transactions and set window.latest_trans_ID 
function get_latest_transactions(){
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==0){
            loaderObj.style.display = 'block';
        }
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            //success
            ans = xmlhttp.responseText;
            ans = JSON.parse(ans);
            
            maxRows = ans.length; 
            
            transactionArray = ans;
            window.latest_trans_ID = ans[ans.length-1].index;
            loaderObj.style.display = 'none';
            console.log('latestID: ', window.latest_trans_ID);
            dispTrans();
        }
        else if (xmlhttp.readyState==4){
            //fail
            alert('Ops!! Problem contacting the server. Refresh page.')
            console.log('error 003x');
            loaderObj.style.display = 'none';
        }
    }    
    xmlhttp.open("GET",'/get_transactions?latestId=1',true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}


//disp transactionArray in DOM
function dispTrans(){
    var table = document.getElementById("transTab");
    
    table.innerHTML = ""; // crude way??
    
    for (var i=0; i<transactionArray.length; i++){
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var xdate = new Date( parseInt(transactionArray[i].date));
        //console.log(xdate);
        cell1.innerHTML = xdate.toLocaleDateString();
        cell2.innerHTML = transactionArray[i].name;        
        cell3.innerHTML = transactionArray[i].amount.toMoney('$');        
    }
}


