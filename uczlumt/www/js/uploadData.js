
//							****** load simple map and define some icons ******

var lat;
var lon;
var mymap;
var myMarker;
//define as function to load leaflet map whenever the question form is loaded
//adapted from the practicle codes in the module
function loadmap(){
	//read lat and lon in the coordinates boxes to use as marker and center of map
	lat = document.getElementById("lat").value;
	lon = document.getElementById("lon").value;
	mymap = L.map('mapid').setView([lat,lon],13);
	//load the map	
	//load the tiles
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',{
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,'+'<a href="http://creativecommons.org/licenses/by-sa/2.0/"> CC-BY-SA</a>,'+'imagery &copy; <a href="http://mapbox.com">Mapbox</a>', 
		id: 'mapbox.streets'
		}).addTo(mymap);


	myMarker = L.marker([lat, lon], {title: "MyPoint", alt: "The Big I", draggable: true})
		.addTo(mymap)
		.on('dragend', function() {
			var coord = myMarker.getLatLng();
			lat = coord.lat
			lon = coord.lng;
			myMarker.bindPopup(lat + ", " + lon);
			document.getElementById("lat").value = lat;
			document.getElementById("lon").value = lon;	
		});

}


//		********** Functions for maker and input box *********** 
//move maker on change of the input boxes 
function movemarker(){
	lat = document.getElementById("lat").value;
	lon = document.getElementById("lon").value;
	myMarker.setLatLng([lat, lon]);
	myMarker.bindPopup(lat + ", " + lon);
	mymap.fitBounds(myMarker.getLatLng().toBounds(3000));
}

//function for locate me button
function locateMe(){
	navigator.geolocation.getCurrentPosition(function(position){
		document.getElementById("lat").value = position.coords.latitude;
		document.getElementById("lon").value = position.coords.longitude;
		movemarker();
	});
}






//		*************************** Functions for manipulating questions **********************

//		********** Functions for creating new question *********** 
//adapted from the practicle codes in the module
//function for upload data from the form
function startDataUpload(){
	//read inputs
	var question = document.getElementById("question").value;
	var qurl = document.getElementById("qurl").value;
	var choice1 = document.getElementById("choice1").value;
	var choice2 = document.getElementById("choice2").value;
	var choice3 = document.getElementById("choice3").value;
	var choice4 = document.getElementById("choice4").value;
	//check if the form is not filled completely alert to the user
	if (choice1.trim() == '' || choice2.trim() == ''|| choice3.trim() == ''|| choice4.trim() == ''||question.trim() == ''){
		alert('Question and Choices have to be specified!!!');
		return;
	}
	var choice1url = document.getElementById("choice1url").value;
	var choice2url = document.getElementById("choice2url").value;
	var choice3url = document.getElementById("choice3url").value;
	var choice4url = document.getElementById("choice4url").value;
	
	//crete post string
	var postString = "question="+question +"&qurl="+qurl + "&choice1="+choice1 + "&choice1url="+choice1url + "&choice2="+choice2 + "&choice2url="+choice2url + "&choice3="+choice3 + "&choice3url="+choice3url+ "&choice4="+choice4 + "&choice4url="+choice4url +"&latitude="+lat +"&longitude="+lon;
	
	var answer;
	if(document.getElementById("ans1").checked){
		answer='choice1';
	} else if(document.getElementById("ans2").checked){
		answer='choice2';
	} else if(document.getElementById("ans3").checked){
		answer='choice3';
	}else if(document.getElementById("ans4").checked){
		answer='choice4';
	} else { //check if the form is not filled completely alert to the user
		alert('Please select the correct answer!!!');
		return
	}
	//answer will store as choice, choice2 ... but fullanswer will get the value of that choice
	postString = postString + "&answer=" +answer;
	var fullanswer = document.getElementById(answer).value;
	postString = postString + "&fullanswer="+fullanswer;
	//alert(postString);
	postData(postString);
}

//adapted from the practicle codes in the module
//post data to the webserver 
var client;
function postData(postString){
	client = new XMLHttpRequest();
	client.open('POST','https://developer.cege.ucl.ac.uk:31083/uploadQuestion',true);
	client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//wait for the respond and condunct dataUploaded function
	client.onreadystatechange = dataUploaded;
	client.send(postString);
}

//adapted from the practicles of the module
//create the code to wait for the response from the data server, and process the response once it is received
//report/alert the reponse
//this is shared function with editing
function dataUploaded(){
	//this function listens out for the server to say that the data is ready - i.e. state 4
	if(client.readyState == 4){
		
		if (client.status == 400){ //400 is error according to the server side code
			if (client.responseText == "question_geom_unique"){
				// if the question is already taken by another question alert to the user
				document.getElementById("lat").style.border = "2px solid red";
				document.getElementById("lon").style.border = "2px solid red";
				alert("This location is already taken by the another question.");
			}else{
				alert(client.responseText);
			}
			return
		}
		alert(client.responseText);
		document.getElementById('question form').innerHTML = ""
		loadQuestion(); //reload the question list after adding or editing
	}
}


//		********** Functions for editing exiting question *********** 
//adapted from the practicle codes in the module
//id is sent by the button
function startDataUpdate(id){
	// alert(id);
	var question = document.getElementById("question").value;
	var qurl = document.getElementById("qurl").value;
	var choice1 = document.getElementById("choice1").value;
	var choice2 = document.getElementById("choice2").value;
	var choice3 = document.getElementById("choice3").value;
	var choice4 = document.getElementById("choice4").value;
	
	//check if the form is not filled completely alret to the user
	if (choice1.trim() == '' || choice2.trim() == ''|| choice3.trim() == ''|| choice4.trim() == ''||question.trim() == ''){
		alert('Question and Choices have to be specified!!!');
		return;
	}
	var choice1url = document.getElementById("choice1url").value;
	var choice2url = document.getElementById("choice2url").value;
	var choice3url = document.getElementById("choice3url").value;
	var choice4url = document.getElementById("choice4url").value;
	
	
	
	var postString = "question="+question +"&qurl="+qurl + "&choice1="+choice1 + "&choice1url="+choice1url + "&choice2="+choice2 + "&choice2url="+choice2url + "&choice3="+choice3 + "&choice3url="+choice3url+ "&choice4="+choice4 + "&choice4url="+choice4url +"&latitude="+lat +"&longitude="+lon;
	var answer;
	if(document.getElementById("ans1").checked){
		answer='choice1';
	} else if(document.getElementById("ans2").checked){
		answer='choice2';
	} else if(document.getElementById("ans3").checked){
		answer='choice3';
	}else if(document.getElementById("ans4").checked){
		answer='choice4';
	} else {
		alert('Please select the correct answer!!!'); //check if the form is not filled completely alret to the user
		return
	}
	//answer will store as choice, choice2 ... but fullanswer will get the value of that choice
	postString = postString + "&answer=" +answer;
	var fullanswer = document.getElementById(answer).value;
	postString = postString + "&fullanswer="+fullanswer;
	
	//post similar parameters as create new question, plus question id
	postString = postString +"&id=" + id;
	//alert(postString);
	processDataEdit(postString);
}
//post to the server
function processDataEdit(postString){
	client = new XMLHttpRequest();
	client.open('POST','https://developer.cege.ucl.ac.uk:31083/editQuestion/',true);
	client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//use shared function to wait the respond with create new question
	client.onreadystatechange = dataUploaded;
	client.send(postString);
}


//		********** Functions for deleting exiting question ***********
//using GET insead of post since there are only few parameters, (id and table name)
//get id from the buttons
function deleteQuestion(id){
	if (confirm("Press OK to delete this question?") == false) return;
	deleteURL = "https://developer.cege.ucl.ac.uk:31083/deleteRow/question/" + id;
	client = new XMLHttpRequest();
	client.open('GET', deleteURL);
	client.onreadystatechange = deleteResponse; 
	client.send();
}

function deleteResponse(){
	//this function listens out for the server to say that the data is ready - i.e. state 4
	if(client.readyState == 4){
		//change the DIV show the response
		alert(client.responseText);
		loadQuestion(); //reload the question list after deleting
	}
}

