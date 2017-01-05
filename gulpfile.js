var gulp = require("gulp");
var browserify = require("browserify");
var reactify = require("reactify");
var source = require("vinyl-source-stream");

gulp.task("bundle", function(){ // this task, bundle, takes main.jsx file and transpiles jsx code to plain javascript using 'reactify' then stream sources it using 'vinyl-source-stream', further creates 'main.js' file on the fly in the 'dist' directory with transpiled js code inside it
  return browserify({
    entries:"./app/main.jsx",
    debug:true
  }).transform(reactify)
  .bundle()
  .pipe(source("main.js"))
  .pipe(gulp.dest("app/dist"))
});

gulp.task("copy", ["bundle"], function(){ // this task, copy, takses index.html, bootstrap.min.css and style.css files and copies them to the 'dist' folder
  return gulp.src(["app/index.html", "app/lib/bootstrap-css/css/bootstrap.min.css", "app/style.css"])
  .pipe(gulp.dest("app/dist"));
});

gulp.task("default", ["copy"], function(){
  console.log("gulp completed...");
});




// extra notes
// after coding SchoolsList.jsx
//a) We are able to use "require" constructs here in order to add references even though browsers do not support that construct, because we will not be adding these files references to our html files directly rather "browserify" library which we have configured as gulp task will resolve these dependencies and bundle all of them together in "main.js" file.
//b) React applications are built using react coponents, you can think of components as self contained templates with functionality bundled within the template itself, although react purists will not agree with this definition, I am proposing it for the simplicity sake. We create a react component by using React.createClass method
//c) The wierd looking syntax within the render function is called JSX, "reactify" which we have configured in the bundle task, trasnpiles this JSX code to JS code which browsers understand. You can write JavaScript expression within curly brackets "{}" which JSX transpiler interpolates while emitting JavaScript code.
//d) Once you have created a react component, you can render that component inside another react component using familiar tag syntax, for example we have rendered SchoolInfo component inside SchoolList component using <SchoolInfo /> tag.
//e) When you need to pass some data to a component, you can do so by  passing objects as value to components attributes while rendering it. Whatever you pass in component's attributes will be accessible within component in the form of a property of this.props Object. For example, while rendering SchoolInfo component in SchoolList, you pass school object in "info" attribute, which you can access in SchoolInfo component by this.props.info. 

// for main.jsx file
//Notice ReactDOM.render function, this indeed renders our react componet "SchoolsList" in Index.html file's div element with container id. 
//The second parameter of ReactDOM.render function takes an html element which acts like a mount point for our entire react app. 
//Also we are passing an array of school objects  as schools attribute of SchoolList component. Now run the "gulp" command again from the command shell and refresh the page, and here you have a hello world react app.







// for React Flux Architecture
//React flux is a programming pattern for react applications which facebook usage internally. Flux ensures only unidirectional data flow throughout your application life cycle. Flux has following agents which keep the flux flow ticking:
//1. Actions: these are the payloads with some data and some context (type) in short objects, these are created by some helper functions as a result of an activity in the view(mostly). For example when user clicks on an add button, we will create an action which will contain infomation to be added and the context. All actions are sent to the dispacher.
//2. Dispatcher: dispatcher works like a global hub which triggers all the listeners registered to it whenever an action is sent to it.
//3. Stores: stores register themselves with dispatchers, when dispatcher broadcasts an actions arrival, stores update themselves if that action is relevant to those stores, and emit a change event which causes UI to get updated.
//4. Views: Views are the html rendered components.


// for dispatcher.js file
//we are going to maintain all the registered listeners in the listeners object. 
//Whoever is interested in registering itself to dispatcher can use register method, on the other side action helpers will call dispatch mehtod of dispatcher to broadcast an action.


// for SchoolActions.js file
//As you can see there are two actions in our Action helper, addSchool and deleteSchool . 
//Both actions take information in the form of school object and then add a context to it in the form of type property which tells which action will be done on which item. 
//Whenever an action method is called (that will be from a view), it will call dispatch method of dispatcher with the payload


// for SchoolsStore.js file
//In our store implementation look at the dispatcher.register method call, this is where store registers itself with the dispatcher. 
//When dispatcher broadcasts an action, store's registered callback is called where it checks the payload's type information and decides an appropriate action whether it's addSchool or deleteSchool in our case.
//Also note that after taking appropriate action in response to dispatcher's call, store calls triggerListeners, this is the final piece of the puzzle which gives UI renderer an opportuinity to update the UI by calling all the subscribers of store's onChange event.
// Now let's update "main.jsx" file so that it connects to the our store rather showing dummy data.

//*** take note that in the "main.jsx" file, requiring files with .jsx type has the .jsx suffix, as in var SchoolsList = require("./components/SchoolsList.jsx");, while requiring files with just the .js suffix are just the filenames, without the suffix as in var schoolsStore = require("./stores/schoolsStore");


// for AddSchool.jsx file
// adding behavior to components
// Let's make our app a little more useful by adding add and delete functionality to it. We will create another react component, so let's add "AddSchool.jsx" file in "components" directory and add the following code in it
//this component has some new syntax so let's quickly revisit.
//1) We have added a form onSubmit handler "addSchool". You can add as many functions as you like within createClass parameter object.
//2) Like we pass external data to a react components via attributes and we access this data by this.props object similar to that we can access internal state of our componet by this.state object. All react componets have their own internal state, and before we can use it, we need to initialize it by getInitialState function. This is a special function and the object it returns becomes the initial state of our components.
//3) Like I have mentioned earlier, react does not support two-way-binding so we need to change the state ourself whenever we feel it's relevant, for example in our case whenever user enters some values in the form controls we update the state using handleInputChange function which get's triggered from onChange event handler. Notice we have used e.preventDefault() in event handlers to avoid page refresh.
//4) When user clicks on "Add School" button, in the submit event handler we start the FLUX flow as shown in the following diagram:
// Views --> Actions --> Dispatcher --> Store
//5) From Event handler we call action helper, which create an action and calls dispatcher. Dispatcher broadcasts the action and since store is subscribed to that action it updates itself and renders the UI. That is precisely the FLUX flow.
//Now let's update the "SchoolsList.jsx" as shown below so that it renders the "AddSchool" component inside it:


// for SchoolsList.jsx file
// we just added the AddSchool.jsx file as in var AddSchool = require("./AddSchool.jsx");
//and also added the Component <AddSchool/> in the place where we said that we would add addSchool functionality
//Also let's update the "SchoolInfo.jsx" to add delete functionality 


// for SchoolInfo.jsx file
// we just added the actions var via var actions = require("./actions/SchoolActions");
// this allowed us to include the deleteSchool function via deleteSchool: function(e){e.preventDefault();actions.deleteSchool(this.props.info);},
// and also added the span via <span className="pull-right text-uppercase delete-button" onClick={this.deleteSchool}>&times;</span>

// Now run the gulp command again and refresh the page, and we have a fully functional react app running. Try adding/deleting school and it should work fine.
// So now we have finished our app's front end portion, however our app has a problem, if you refresh the page, all the new schools you added or deleted, disappear. This is because we are not persisting any information yet. 
// In the next part of this series we will create the backend for this app and we will also revisit our front end code to implement REST API calls.















