/*!
    * Start Bootstrap - SB Admin v7.0.4 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2021 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
// 
// Scripts
// 
window.addEventListener('DOMContentLoaded', event => {

  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector('#sidebarToggle');
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener('click', event => {
      event.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    });
  }

});

var xLabel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var tempData = [];

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';
// Area Chart Example
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

setTempAndHumid();
setInterval(function () { setTempAndHumid() }, 60000);

var getTable = document.getElementById("myTable");

//https://ros-temphumid.herokuapp.com/history/?format=json
async function setTempAndHumid() {
  var innerHTML = "";
  var sideBarHTML = "";
  //get temp and humid from api
  const ros_temphumi_URL = "https://ros-temphumid.herokuapp.com/?format=json"
  const x = "b3dhaXM6YWRtaW4=";
  var request = new XMLHttpRequest();
  request.open("GET", ros_temphumi_URL, false); // false for synchronous request
  request.setRequestHeader("Authorization", "Basic " + x)
  request.send(null);
  var response = JSON.parse(request.responseText)
  response.forEach(resp => {
    var title = resp["name"];
    var subtitle = resp["location"];
    var currentTemperature = resp["temperature"];
    var tempClass = "bg-primary";
    var currentHumid = resp["humidity"];
    var humidClass = "bg-primary";
    var histHTML = "";
    var k = 0;
    console.log(title, subtitle, currentHumid, currentTemperature);

    const ros_temphumi_URLTwo = "https://ros-temphumid.herokuapp.com/history/?format=json"
    var requestTwo = new XMLHttpRequest();
    requestTwo.open("GET", ros_temphumi_URLTwo, false); // false for synchronous request
    requestTwo.setRequestHeader("Authorization", "Basic " + x)
    requestTwo.send(null);
    var responseTwo = JSON.parse(requestTwo.responseText)
    responseTwo.forEach(resp => {
      var titleTwo = resp["name"];
      var currentTemperatureTwo = resp["temperature"];
      var currentHumidTwo = resp["humidity"];
      var date = resp["date"];
      console.log(titleTwo, currentTemperatureTwo, currentHumidTwo, date);


      if (titleTwo == title) {
        histHTML += "<tr><td>" + moment().subtract(k, 'minute').format('hh:mm a') + "</td><td>" + currentTemperatureTwo + "</td><td>" + currentHumidTwo + "</td></tr>";
        k++
      }

    });

    //change color for bad temp/humid
    if (currentTemperature < 250) {
      //less than 250 degrees
      tempClass = "bg-success"
    } else if (currentTemperature >= 250 && currentTemperature < 300) {
      //greater than 250 degrees but less than 300
      tempClass = "bg-warning"
    } else {
      //greater than 300 degrees
      tempClass = "bg-danger"

      kendoAlert("Temperature for " + title + " has passed the \"Danger\" threshold")
    }
    if (currentHumid < 50) {
      //less than  %
      humidClass = "bg-success"
    } else if (currentHumid >= 50 && currentHumid < 75) {
      //greater than  but less than 
      humidClass = "bg-warning"
    } else {
      //greater than 
      humidClass = "bg-danger"
      kendoAlert("Humidity for " + title + " has passed the \"Danger\" threshold")
    }
    //set value to currtemp card
    sideBarHTML += '<a class="nav-link" href="#' + title + '"><div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>' + title + '</a>'
    innerHTML += '<div class="card bg-white m-4 px-3 shadow" id="' + title + '"><h1 class="mt-4">' + title + '</h1><ol class="breadcrumb mb-4"><li class="breadcrumb-item active">' + subtitle + ' </li></ol><div class="row"><div class="col-md-2"><div class="card ' + tempClass + ' text-white text-center mb-3" style="{height=10rem}" id="tempCard"><div class="card-body">Current Temperature<p class="text card-text " id="currentTemperature">' + currentTemperature + '°C</p></div></div><div class="card ' + humidClass + ' text-white text-center mb-3" style = "{height=10rem}" id="humidCard"><div class="card-body">Current Humidity<p class="text card-text " id="currentHumidity">' + currentHumid + '%</p></div></div></div><div class="col-md-6 h-100"><div class="card mb-4"><div class="card-header">History</div><table id="myTable" class="table"><tr><th>Date</th><th>Temperature</th><th>Humidity</th></tr>' + histHTML + '</table></div></div></div></div></div>';
  });
  document.getElementById("moduleContainer").innerHTML = innerHTML
  document.getElementById("sideBar").innerHTML = sideBarHTML
}

window.kendoAlert = (function () {

  // this function is executed as soon as
  // it is loaded into the browser

  // create modal window on the fly and 
  // store it in a variable
  var win = $("<div>").kendoWindow({
    modal: true
  }).getKendoWindow();

  // returning a function will set kendoAlert to a function
  return function (msg) {

    // anything inside this function has access to the `win`
    // variable which contains the Kendo UI Window.  Even WAY
    // after the outer function was run and this object was created

    // set the content
    win.content(msg);

    // center it and open it
    win.center().open();
  };

}());
