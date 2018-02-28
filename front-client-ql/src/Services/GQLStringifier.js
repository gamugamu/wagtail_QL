
export class GQLStringifier{
  static preventR = 0;

  static stringify(obj, exclude = [], include = []){
    console.log("will parse ", obj, GQLStringifier.preventR, GQLStringifier.preventR++ >= 20, obj === 'undefined', obj === null);

    // start
    var elm = ""
    if(obj instanceof Array){
      elm += "["
      for (var i = 0; i < obj.length; i++) {
          console.log("from iterator");
          elm += GQLStringifier.stringify(obj[i], exclude, include)
          elm += ","
      }
      console.log("endFor+++");
      elm = GQLStringifier.lastOperatorCheck(elm)
      elm += "]"
      console.log("Test", elm);
    }
    else{
      elm += "{";
      for(var someKey in obj){
        if (obj.hasOwnProperty(someKey)){
          //var myActualPropFromObj = obj[someKey];
          //var shouldBeBar = myActualPropFromObj.b;
          if(someKey.substring(0, 2) != "__"){
            // include logique
            if(include.length !== 0){
               if(include.indexOf(someKey) > -1){
                 console.log("include only --->", someKey);
                 elm += someKey + ":" + JSON.stringify(obj[someKey]) + ","
               }
            }else{
              // pas d'inculsion
              elm += someKey + ":" + JSON.stringify(obj[someKey]) + ","
              console.log("--->", someKey);
            }
          }
        }
      }    
      elm = GQLStringifier.lastOperatorCheck(elm)
      elm += "}"
    }
    // end

    return elm
  }

  static lastOperatorCheck(elm){
    if(elm.charAt(elm.length - 1) == ','){
      elm = elm.substring(0, elm.length - 1);
    }

    return elm
  }
}
