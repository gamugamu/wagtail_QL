
export class GQLStringifier{
  static preventR = 0;

  static stringify(obj, exclude = [], include = []){
    // start
    var elm = ""
    if(obj instanceof Array){
      elm += "["
      for (var i = 0; i < obj.length; i++) {
          elm += GQLStringifier.stringify(obj[i], exclude, include)
          elm += ","
      }
      elm = GQLStringifier.lastOperatorCheck(elm)
      elm += "]"
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
                 elm += someKey + ":" + JSON.stringify(obj[someKey]) + ","
               }
            }else{
              // pas d'inculsion
              if(exclude.indexOf(someKey) < 0){
                elm += someKey + ":" + JSON.stringify(obj[someKey]) + ","
              }
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
