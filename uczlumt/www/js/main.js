var geoJSONData
var client;

function loadQuestion(){
	var url = 'https://developer.cege.ucl.ac.uk:31083/getGeoJSON/question/geom'
	client = new XMLHttpRequest();
	
	client.open('GET', url);
	client.onreadystatechange = dataResponse; //note don't use earthquakeResponse() with brackets as that doesn't work
	client.send();
}

//create the code to wait for the response from the data server, and process the response once it is received
function dataResponse(){
//this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4){
		//once the data is ready, process the data
		geoJSONData = client.responseText;
		listQuestion(geoJSONData);
	}
}
var geoJSON
function listQuestion(geoJSONData){
	geoJSON = JSON.parse(geoJSONData);
	var htmlString = "<table> <thead> <tr><th>#</th><th>Question</th><th>Answer</th><th style = 'width: 44.4px'>Edit</th><th style = 'width: 44.4px'>Delete</th> </tr></thead><tbody>";
	for(var i = 0; i < geoJSON[0].features.length; i++) {
		var feature = geoJSON[0].features[i];
		htmlString = htmlString + "<tr> <td>" + (i+1) + "</td>"
		htmlString = htmlString + "<td>" + feature["properties"]["question"] + "</td>"
		htmlString = htmlString + "<td>" + feature["properties"][feature["properties"]["answer"]] + "</td>"
		htmlString = htmlString + "<td> <button id = 'edit" + feature["properties"]["id"] + "' class = 'btn' onclick ='editQuestion(this.name)' name = '" + i + "'> <i class = 'material-icons'>edit</i></button></td>"
		htmlString = htmlString + "<td> <button id = 'delete" + feature["properties"]["id"] + "' class = 'btn' onclick ='deleteQuestion(this.name)' name = '"+ + feature["properties"]["id"]+ "'> <i class = 'material-icons'>delete</i></button></td>"
		
		htmlString = htmlString + "</tr>"
		
	}
	htmlString = htmlString + "</tbody></table>"
	document.getElementById("Question list").innerHTML = htmlString
}


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
		loadQuestion();
	}
}

var xhr; //define the globle to process the AJAX request


function addNew(){
	var url = "./four_choices.html";
	xhr = new XMLHttpRequest();
	//var url = document.getElementById("url").value;
	if (url == ""){
		return
	}
	xhr.open("GET",url,true);
	//xhr.open("GET",".test.html",true);
	xhr.onreadystatechange = processDivChange_addNew;
	try{
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	}
	catch(e){
		//this only works in internet explorer
	}
	xhr.send();
	
}

function processDivChange_addNew(){
	//while waiting response from server
	if(xhr.readyState <4)  document.getElementById('question form').innerHTML="Loading...";
	///4 = response from server has been completely loaded.
	else if (xhr.readyState === 4){
		//200-300 --> all successful
		if (xhr.status==200&&xhr.status<300) {
			document.getElementById('question form').innerHTML=xhr.responseText;
			loadmap();
		}
	}
}

var edit_id;
function editQuestion(id){
	edit_id = id;
	var url = "./four_choices.html";
	xhr = new XMLHttpRequest();
	//var url = document.getElementById("url").value;
	if (url == ""){
		return
	}
	xhr.open("GET",url,true);
	//xhr.open("GET",".test.html",true);
	xhr.onreadystatechange = processDivChange_edit;
	try{
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	}
	catch(e){
		//this only works in internet explorer
	}
	xhr.send();
}

function processDivChange_edit(){
	//while waiting response from server
	if(xhr.readyState <4)  document.getElementById('question form').innerHTML="Loading...";
	///4 = response from server has been completely loaded.
	else if (xhr.readyState === 4){
		//200-300 --> all successful
		if (xhr.status==200&&xhr.status<300) {
			document.getElementById('question form').innerHTML=xhr.responseText;
			document.getElementById("head").innerHTML = "Edit question: #" + (Number(edit_id)+1);
			document.getElementById("question").value = geoJSON[0].features[edit_id]["properties"]["question"];
			document.getElementById("qurl").value = geoJSON[0].features[edit_id]["properties"]["qurl"];
			document.getElementById("choice1").value = geoJSON[0].features[edit_id]["properties"]["choice1"];
			document.getElementById("choice2").value = geoJSON[0].features[edit_id]["properties"]["choice2"];
			document.getElementById("choice3").value = geoJSON[0].features[edit_id]["properties"]["choice3"];
			document.getElementById("choice4").value = geoJSON[0].features[edit_id]["properties"]["choice4"];
			document.getElementById("choice1url").value = geoJSON[0].features[edit_id]["properties"]["choice1url"];
			document.getElementById("choice2url").value = geoJSON[0].features[edit_id]["properties"]["choice2url"];
			document.getElementById("choice3url").value = geoJSON[0].features[edit_id]["properties"]["choice3url"];
			document.getElementById("choice4url").value = geoJSON[0].features[edit_id]["properties"]["choice4url"];
			
			document.getElementById("lat").value = geoJSON[0].features[edit_id]["geometry"]["coordinates"][1];
			document.getElementById("lon").value = geoJSON[0].features[edit_id]["geometry"]["coordinates"][0];
			var correctANS = geoJSON[0].features[edit_id]["properties"]["answer"];
			var ans = "ans" + correctANS.charAt(correctANS.length-1);
			document.getElementById(ans).checked = true;
			document.getElementById("upload").innerHTML = "<button id = 'startUpload' class = 'btn' onclick ='startDataUpdate("+ geoJSON[0].features[edit_id]["properties"]["id"] +")'> <i class = 'material-icons'>update</i>  Edit Question</button>";
			loadmap();
			edit_id = null;
			loadmap();
		}
	}
}

loadQuestion();