var geoJSONData;
var geoJSON; //keep it as Global variable, so doesn't have to be loaded often.
var client;

//								********************** Functions to create list of the questions table **************************

//firstly load data from the DB  
//adapted from the practicle codes in the module
function loadQuestion(){
	//requesting geoJSON of the questions to create the list of the question
	var url = 'https://www.woravich-k.com:49154/getGeoJSON/question/geom'
	client = new XMLHttpRequest();
	
	client.open('GET', url);
	client.onreadystatechange = dataResponse; 
	client.send();
}

//adapted from the practicle codes in the module
//create the code to wait for the response from the data server, and process the response once it is received
function dataResponse(){
//this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4){
		//once the data is ready, process the data
		geoJSONData = client.responseText;
		listQuestion(geoJSONData);
	}
}

// after getting a JSON, create a table by changin the table DIV (Question list)
function listQuestion(geoJSONData){
	geoJSON = JSON.parse(geoJSONData);
	var htmlString = "<table> <thead> <tr><th>#</th><th>Question</th><th>Answer</th><th style = 'width: 44.4px'>Edit</th><th style = 'width: 44.4px'>Delete</th> </tr></thead><tbody>";
	
	//for loop to create HTML code regard to the GeoJSON data that recieve from the server
	for(var i = 0; i < geoJSON[0].features.length; i++) {
		var feature = geoJSON[0].features[i];
		htmlString = htmlString + "<tr> <td>" + (i+1) + "</td>"
		htmlString = htmlString + "<td>" + feature["properties"]["question"] + "</td>"
		htmlString = htmlString + "<td>" + feature["properties"][feature["properties"]["answer"]] + "</td>"
		//edit button
		//set their name as an index of the GeoJSON and pass to the function by this.name, to access other attributes to the selected row without looping again
		htmlString = htmlString + "<td> <button id = 'edit" + feature["properties"]["id"] + "' class = 'btn' onclick ='editQuestion(this.name)' name = '" + i + "'> <i class = 'material-icons'>edit</i></button></td>" 
		
		//delete button
		//set their name as an id(primary key of the question table) of the record, pass to delete function by this.name.
		//This is different from the edit since other attributes are not needed 
		htmlString = htmlString + "<td> <button id = 'delete" + feature["properties"]["id"] + "' class = 'btn' onclick ='deleteQuestion(this.name)' name = '"+ + feature["properties"]["id"]+ "'> <i class = 'material-icons'>delete</i></button></td>"
		
		htmlString = htmlString + "</tr>"
		
	}
	htmlString = htmlString + "</tbody></table>"
	
	//change DIV
	document.getElementById("Question list").innerHTML = htmlString
}






//										********************** Functions to load question form for either adding new or editing question**************************

var xhr; //define the globle to process the AJAX request

//loading question form via AJAX (four_choices.html)
//using AJAX to open up opotunity to have other types of question apart from four choices - i.e. type in question, true-false question, multiple correct answers question

//adapted from the practicle codes in the module
function addNew(){ //load if user want to add new function
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
//adapted from the practicle codes in the module
function processDivChange_addNew(){
	//while waiting response from server
	if(xhr.readyState <4)  document.getElementById('question form').innerHTML="Loading...";
	///4 = response from server has been completely loaded.
	else if (xhr.readyState === 4){
		//200-300 --> all successful
		if (xhr.status==200&&xhr.status<300) {
			document.getElementById('question form').innerHTML=xhr.responseText; //wait for the respose then change the DIV(question form)
			loadmap(); //load map after the div is loaded
		}
	}
}


//functions for loading form for editing
//adapted from the practicle codes in the module
var edit_id; //global variable to use after getting response
function editQuestion(id){ //get id from this.name
	edit_id = id;
	var url = "./four_choices.html"; //load from the same html as adding new to get the basic structure
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

//adapted from the practicle codes in the module
function processDivChange_edit(){
	//while waiting response from server
	if(xhr.readyState <4)  document.getElementById('question form').innerHTML="Loading...";
	///4 = response from server has been completely loaded.
	else if (xhr.readyState === 4){
		//200-300 --> all successful
		if (xhr.status==200&&xhr.status<300) { //after the html is loaded, it is still not suit with editing question, so adapt some part
			document.getElementById('question form').innerHTML=xhr.responseText;
			//change header
			document.getElementById("head").innerHTML = "Edit question: #" + (Number(edit_id)+1); 
			
			//fill in the form by the information before editing
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
			
			//change the button from create new question to edit question
			document.getElementById("upload").innerHTML = "<button id = 'startUpload' class = 'btn' onclick ='startDataUpdate("+ geoJSON[0].features[edit_id]["properties"]["id"] +")'> <i class = 'material-icons'>update</i>  Edit Question</button>";
			
			loadmap(); //load map after the div is loaded
			edit_id = null; //reset global variable
			
		}
	}
}

//cancel function to remove the form without adding or editing
function cancel(){
	document.getElementById('question form').innerHTML = ""
}

//list the question at the first time that the site is loaded
loadQuestion();