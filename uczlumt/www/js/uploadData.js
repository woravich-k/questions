
//							****** load simple map and define some icons ******
//load the map
var lat;
var lon;
var mymap;
var myMarker;
function loadmap(){
	lat = document.getElementById("lat").value;
	lon = document.getElementById("lon").value;
	mymap = L.map('mapid').setView([lat,lon],13);
		
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
function movemarker(){
	lat = document.getElementById("lat").value;
	lon = document.getElementById("lon").value;
	myMarker.setLatLng([lat, lon]);
	myMarker.bindPopup(lat + ", " + lon);
	mymap.fitBounds(myMarker.getLatLng().toBounds(3000));
}

function locateMe(){
	navigator.geolocation.getCurrentPosition(function(position){
		document.getElementById("lat").value = position.coords.latitude;
		document.getElementById("lon").value = position.coords.longitude;
		movemarker();
	});
}

//function for upload data from the form
function startDataUpload(){
	var question = document.getElementById("question").value;
	var qurl = document.getElementById("qurl").value;
	var choice1 = document.getElementById("choice1").value;
	var choice2 = document.getElementById("choice2").value;
	var choice3 = document.getElementById("choice3").value;
	var choice4 = document.getElementById("choice4").value;
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
		alert('Please select the correct answer!!!');
		return
	}
	postString = postString + "&answer=" +answer;
	var fullanswer = document.getElementById(answer).value;
	postString = postString + "&fullanswer="+fullanswer;
	//alert(postString);
	postData(postString);
}

var client;
function postData(postString){
	client = new XMLHttpRequest();
	client.open('POST','https://developer.cege.ucl.ac.uk:31083/uploadQuestion',true);
	client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	client.onreadystatechange = dataUploaded;
	client.send(postString);
}

//create hte code to wait for the response from the data server, and process the response once it is received
function dataUploaded(){
	//this function listens out for the server to say that the data is ready - i.e. state 4
	if(client.readyState == 4){
		//change the DIV show the response
		if (client.status == 400){
			if (client.responseText == "question_geom_unique"){
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
		loadQuestion();
	}
}

function cancel(){
	document.getElementById('question form').innerHTML = ""
}

function startDataUpdate(id){
	// alert(id);
	var question = document.getElementById("question").value;
	var qurl = document.getElementById("qurl").value;
	var choice1 = document.getElementById("choice1").value;
	var choice2 = document.getElementById("choice2").value;
	var choice3 = document.getElementById("choice3").value;
	var choice4 = document.getElementById("choice4").value;
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
		alert('Please select the correct answer!!!');
		return
	}
	postString = postString + "&answer=" +answer;
	var fullanswer = document.getElementById(answer).value;
	postString = postString + "&fullanswer="+fullanswer;
	postString = postString +"&id=" + id;
	//alert(postString);
	processDataEdit(postString);
}

function processDataEdit(postString){
	client = new XMLHttpRequest();
	client.open('POST','https://developer.cege.ucl.ac.uk:31083/editQuestion/',true);
	client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	client.onreadystatechange = dataUploaded;
	client.send(postString);
}

