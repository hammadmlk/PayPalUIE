Number.prototype.toMoney = function(currencySign)
{   
   var currencySign = currencySign || '';
    
   var n = this;
   var c = 2;
   var d = '.';   
   var t = ','; 

   sign = (n < 0) ? '-' : '',

   //extracting the absolute value of the integer part of the number and converting to string
   i = parseInt(n = Math.abs(n).toFixed(c)) + '', 

   j = ((j = i.length) > 3) ? j % 3 : 0; 
   return currencySign+sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
}

//remove non digit chars
String.prototype.toValidNumber = function()
  {
    return  this.replace(/[^\d\.\ ]/g, '');    
  }
  
//return true or false
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function AJAXPostParams(formId){ 
    "use strict"
    var elem = document.getElementById(formId).elements;
    var params = "";
    
    var k=0;
    for(var i = 0; i < elem.length; i++){
    
        var divi = (k === 0) ? '' : '&';
    
        if (elem[i].tagName === "SELECT"){
            k=1;
            params += divi + elem[i].name + "=" + encodeURIComponent(elem[i].options[elem[i].selectedIndex].value);
        }else if (elem[i].type==='radio'){
            if(elem[i].checked){
                k=1;
                params += divi + elem[i].name + "=" + encodeURIComponent(elem[i].value);
            }
        }
        else if(typeof elem[i].name!='undefined' && typeof elem[i].value != 'undefined'){
                k=1;
                params += divi + elem[i].name + "=" + encodeURIComponent(elem[i].value);
        }
    }
    return params;
}
