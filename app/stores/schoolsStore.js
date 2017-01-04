var dispatcher = require("../dispatcher");

function SchoolStore(){
  var listeners = [];
  var schools = [ {name:"Rutgers University", tagline:"This is my alma mater, an awesome school!"},
                {name:"St. Peter's Prep", tagline:"Another awesome school!"},
                {name:"RCB", tagline:"An excellent coding bootcamp!"}];

    function getSchools(){
      return schools;
    }

    function onChange(listener){
      listeners.push(listener);
    }

    function addSchool(school){
      schools.push(school)
      triggerListeners();
    }

    function deleteSchool(school){
      var _index;
      schools.map(function(s, index){
        if(s.name === school.name){
          _index = index;
        }
      });
      schools.splice(_index, 1);
      triggerListeners();
    }

    function triggerListeners(){
      listeners.forEach(function(listener){
        listener(schools);
      });
    }

    dispatcher.register(function(payload){
      var split = payload.type.split(":");
      if(split[0] === "school"){
        switch (split[1]){
          case "addSchool":
            addSchool(payload.school);
            break;
          case "deleteSchool":
            deleteSchool(payload.school);
            break;
        }
      }
    });

    return{
      getSchools: getSchools,
      onChange: onChange
    }
}

module.exports = SchoolStore();