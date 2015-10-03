// JavaScript Document
var pages = [], links=[];
var numLinks = 0;
var numPages = 0;
var pageTime = 20;

var pageshow = document.createEvent("CustomEvent");
pageshow.initEvent("pageShow", false, true);


document.addEventListener("deviceready", intfunc, false);

function intfunc() {
    //device ready listener
    pages = document.querySelectorAll('[data-role="page"]');
    numPages = pages.length;
    links = document.querySelectorAll('[data-role="pagelink"]');
    numLinks = links.length;
	

	
    for(var i=0;i<numLinks; i++){
			addHammerRecognizer(links[i]);		
    }	
	
	
	
	
    //add the listener for pageshow to each page
    for(var p=0; p < numPages; p++){
        pages[p].addEventListener("pageShow", handlePageShow, false);
        pages[p].addEventListener("pageShow", maplocation, false);
    }
    
    loadPage(null);
};


function addHammerRecognizer(theElement)
{
	// We create a manager object, which is the same as Hammer(), but without 	  //the presetted recognizers. 
	var mc = new Hammer.Manager(theElement);


	// Tap recognizer with minimal 2 taps
	mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
	// Single tap recognizer
	mc.add( new Hammer.Tap({ event: 'singletap' }) );


	// we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
	mc.get('doubletap').recognizeWith('singletap');
	// we only want to trigger a tap, when we don't have detected a doubletap
	mc.get('singletap').requireFailure('doubletap');


	mc.on("singletap doubletap", function(ev) {
			if(theElement.className !="activetab")
			{
			  handleNav(ev);
			}
		
	});
	
};



//handle the click event
function handleNav(ev){
    ev.preventDefault();
    var href = ev.target.href;
    var parts = href.split("#");
    loadPage( parts[1] );
    return false;
}

function handlePageShow(ev){
    ev.target.className = "active";
}

function loadPage( url ){
    if(url == null){
        //home page first call
        pages[0].className = 'active';
        history.replaceState(null, null, "#home");
    }else{
        for(var i=0; i < numPages; i++){
            pages[i].className = "hidden";
            //get rid of all the hidden classes
            //but make them display block to enable anim.
            if(pages[i].id == url){
                pages[i].className = "show";
                //add active to the proper page
                history.pushState(null, null, "#" + url);
                setTimeout(addDispatch, pageTime, i);
            }
        }
        //set the activetab class on the nav menu
        for(var t=0; t < numLinks; t++){
            links[t].className = "";
            if(links[t].href == location.href){
                links[t].className = "activetab";
            }
        }
    }
}



function addDispatch(num){
    pages[num].dispatchEvent(pageshow);
    //num is the value i from the setTimeout call
    //using the value here is creating a closure
}


function maplocation(ev){
    if(ev.currentTarget.id == "two"){
        two();
    }
    
    else if(ev.currentTarget.id == "three"){
        three();
    }
    
}

function two() {
    
    var params = {
    enableHighAccuracy: true,
    timeout: 36000,
    maximumAge: 60000
    };
    var id =navigator.geolocation.getCurrentPosition(reportPosition, gpsError, params);
    //navigator.geolocation.clearWatch(id);
    
}


function reportPosition(position) {
    
    var mapUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=14&size=300x300&maptype=roadmap" + "&markers=color:red%7C" + position.coords.latitude + "," + position.coords.longitude;
    
    
    var canvas = document.createElement("canvas");
    canvas.setAttribute("height", "300");
    canvas.setAttribute("width", "300");
    canvas.setAttribute("id", "myCanvas");
	
    var locationOutput=document.querySelector('#output')
	while (locationOutput.hasChildNodes()) {
    	locationOutput.removeChild(locationOutput.lastChild);
	}
	
    locationOutput.appendChild(canvas);
    
    var mycan = document.querySelector('#myCanvas');
    var context = mycan.getContext('2d');
    var img = document.createElement("img");
    img.onload = function () {
        context.drawImage(img, 0, 0);
    };
    img.src = mapUrl;
    
}

function gpsError(error) {
    var errors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
    };
    alert("Error: " + errors[error.code]);
}



// find all contacts

function three(){
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {

    var options = new ContactFindOptions();
    options.filter = "";
    var filter = ["name", "addresses","phoneNumbers","emails","birthday"];
    navigator.contacts.find(filter, onSuccess, onError, options);
    
}
}


function onSuccess(contacts) {
    console.log(contacts);
    var x = Math.floor(Math.random() * contacts.length);
    console.log(x);
    console.log(contacts.length);
    var list = ''
    if (contacts[x].displayName != null) {
        list += '<li>' + 'Name: ' + contacts[x].displayName + '</li>';
    }
    if (contacts[x].phoneNumbers != null) {
        for (var p = 0; p < contacts[x].phoneNumbers.length; p++) {
            list += '<li>' + 'Phone Numbers: ' + contacts[x].phoneNumbers[p].type + ' ' + contacts[x].phoneNumbers[p].value + '</li>'
        }/Users/desenguo/Downloads/index.js
    }
    if (contacts[x].birthday != null) {
        list += '<li>' + 'Birthday: ' + new Date(contacts[x].birthday).toString() + '</li>'
    }
    if (contacts[x].addresses != null) {
        for (var j = 0; j < contacts[x].addresses.length; j++) {
            list += '<li>' + 'Address: ' + contacts[x].addresses[j].type + ' ' + contacts[x].addresses[j].streetAddress + '</li>'
        }
    }
    if (contacts[x].emails != null) {
        for (var e = 0; e < contacts[x].emails.length; e++) {
            list += '<li>' + 'Emails: ' + contacts[x].emails[e].value + '</li>'
        }
    }
    document.querySelector('#lists').innerHTML = list;
};

function onError(contactError) {
    alert("Error = " + contactError.code);
};



    



