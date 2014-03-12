window.currencyOptions = {USD: '$', PKR: 'Rs', PND:'#'};// key value pair. key=name, value=symbol;
                                                        // changes here will be reflected on the html output


window.onload=function(){
    
    //Generate Currency Dropdown Options
    var currencyField = document.sendMoneyForm.currencyField;    
    for (var k in window.currencyOptions) {
        if (window.currencyOptions.hasOwnProperty(k)) {
            var option = document.createElement("option");
            option.text = k;
            option.value = k;
            currencyField.add(option);
        }
    }
    currencyField.onchange=function(){
        document.sendMoneyForm.amountField.onblur();
    }
    
    //clear button
    document.getElementById("clearBtn").onclick=function(){
        document.sendMoneyForm.reset(); 
        
        //call onchange function of all input fields what have it
        var inputtags = document.getElementsByTagName("input");        
        for (var i =0; i<inputtags.length; i++){
            if(typeof inputtags[i].onchange === 'function')
                inputtags[i].onchange({target: inputtags[i]});
        }
    };
    
    //home button
    document.getElementById("homeBtn").onclick=function(){
        window.location = '/';
    };
    
    //next button (aka submit button)
    document.getElementById("nextBtn").onclick=function(){
        
        // if form valid for submission
        if (parseFloat(amountField.value.toValidNumber())>0 &&
            validateEmail(toField.value)){
                    
                var url = document.getElementById("sendMoneyForm").action;
                var params = AJAXPostParams("sendMoneyForm");
                console.log(params)
                
                var loaderObj = document.getElementById("loading");
                
                xmlhttp=new XMLHttpRequest();
                xmlhttp.onreadystatechange=function(){
                    if (xmlhttp.readyState==0){
                        loaderObj.style.display = 'block';
                    }
                    if (xmlhttp.readyState==4 && xmlhttp.status==200){
                        //success
                        ans = xmlhttp.responseText;
                        
                        ans = JSON.parse(ans);
                        
                        document.getElementById("success_amount").innerHTML = ans.amount;
                        document.getElementById("success_name").innerHTML = ans.name;
                        
                        document.getElementById("successPage").style.display = 'block';
                        document.getElementById("sendMoneyPage").style.display = 'none';
                        
                        loaderObj.style.display = 'none';
                        console.log('pass', ans);
                    }
                    else if (xmlhttp.readyState==4){
                        //fail
                        alert('Ops!! Problem contacting the server. Try again maybe?')
                        console.log('error 001x');
                        loaderObj.style.display = 'none';
                    }
                }    
                xmlhttp.open("POST",url,true);
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.send(params);
                    
        }
        // else alert user
        else{
            console.log(parseFloat(amountField.value.toValidNumber()), validateEmail(toField.value));
            alert('Incomplete Form')
        }
        
    };
    
    //toField input validation
    var toField = document.sendMoneyForm.toField;
    toField.onchange=function(){
        var email = toField.value;
        
        if(email.length===0){
            toField.className = "";
        }
        else if (!validateEmail(email)){
            toField.className = "addcross" 
        }else{
            toField.className = "addtick"
        }
        
    };
    
    //amountField input validation
    var amountField = document.sendMoneyForm.amountField;
    amountField.onkeyup=function(){
        amountField.value=amountField.value.toValidNumber();
    };
    amountField.onblur=function(){
        var currencySign = window.currencyOptions[document.sendMoneyForm.currencyField.value];
        amountField.value=parseFloat(amountField.value.toValidNumber()||0).toMoney(currencySign);
    };
    amountField.onfocus=function(){
        amountField.value=(amountField.value.toValidNumber());
    };
    
    
};




