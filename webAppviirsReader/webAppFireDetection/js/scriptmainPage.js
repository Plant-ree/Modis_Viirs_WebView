var map = L.map('map').setView([49.13,9.22], 5);

L.tileLayer.provider('Thunderforest.Landscape', {
	apikey: '9f9afb903ccd4fefa61b842c4580f165',
	noWrap: true
}).addTo(map);


map.on('click', function(e) 
{
    onClick(e);
});


var perimeter = new Array();
//check line intersections block
function line_intersects(p0, p1, p2, p3) {
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1['lat'] - p0['lat'];
    s1_y = p1['lng'] - p0['lng'];
    s2_x = p3['lat'] - p2['lat'];
    s2_y = p3['lng'] - p2['lng'];

    var s, t;
    s = (-s1_y * (p0['lat'] - p2['lat']) + s1_x * (p0['lng'] - p2['lng'])) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0['lng'] - p2['lng']) - s2_y * (p0['lat'] - p2['lat'])) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return true;
    }
    return false; // No collision
}


function check_intersect(lat, lng, ver){
    if(perimeter.length < 3){
        return false;
    }
    var p0 = new Array();
    var p1 = new Array();
    var p2 = new Array();
    var p3 = new Array();
    var i = 0;
    //default, ignores the connection of last and first point
    if(ver == 0){
        p2['lat'] = perimeter[perimeter.length-1]['lat'] + 90;
        p2['lng'] = perimeter[perimeter.length-1]['lng'] + 180;
        p3['lat'] = lat + 90;
        p3['lng'] = lng + 180;
    }
    //this is when we finish up the polygon
    else{
        p2['lat'] = perimeter[0]['lat'] + 90;
        p2['lng'] = perimeter[0]['lng'] + 180;
        p3['lat'] = lat + 90;
        p3['lng'] = lng + 180;
        i = 1;
    }

    for(i; i<perimeter.length-1 - ver; i++){
        p0['lat'] = perimeter[i]['lat'] + 90;
        p0['lng'] = perimeter[i]['lng'] + 180;
        p1['lat'] = perimeter[i+1]['lat'] + 90;
        p1['lng'] = perimeter[i+1]['lng'] + 180;
        if(p1['lat'] == p2['lat'] && p1['lng'] == p2['lng']){ continue; }
        if(p0['lat'] == p3['lat'] && p0['lng'] == p3['lng']){ continue; }
        
        if(line_intersects(p0,p1,p2,p3)==true){

            return true;
        }
    }
    return false;
}

function isInsidePolygon(points, perimeterF)
{
    var res = [];

    /*for(var j = 0; j<points.length; j++){
        for(var i = 0; i<points[j].length; i++){
            var temp = 0;
            var p0 = new Array();
            var p1 = new Array();
            var p2 = new Array();
            var p3 = new Array();
    
            //make a line, one point is the one we're checking, the other is 
            //at the other side of the globe at the same longitude at 
            //-180 degrees 
            p2['lat'] = Number(points[j][i][2]) + 90.0;
            p2['lng'] = Number(points[j][i][1]) + 180.0;
            p3['lat'] = p2['lat'];
            p3['lng'] = 0;
            
            for(var k=0; k<perimeterF.length; k++){
                if(k + 1 < perimeterF.length){
                    p0['lat'] = perimeterF[k]['lat'] + 90.0;
                    p0['lng'] = perimeterF[k]['lng'] + 180.0;
                    p1['lat'] = perimeterF[k+1]['lat'] + 90.0;
                    p1['lng'] = perimeterF[k+1]['lng'] + 180.0;
                }
                else{
                    p0['lat'] = perimeterF[k]['lat'] + 90.0;
                    p0['lng'] = perimeterF[k]['lng'] + 180.0;
                    p1['lat'] = perimeterF[0]['lat'] + 90.0;
                    p1['lng'] = perimeterF[0]['lng'] + 180.0;
                }
                if(line_intersects(p0,p1,p2,p3)==true){
                    temp += 1;
                }
            }
            if(temp % 2 == 1){
                var latf = points[j][i][2];
                var lngf = points[j][i][1];
                var colorf = points[j][i][0];
                var tempP = L.circleMarker([latf, lngf], {radius: 3, color: colorf, weight: 0, opacity: 1, fillOpacity: 1}).addTo(map);
                res.push(tempP);
            }

        }
    }*/
    //console.log(points.length);
    for(var i = 0; i<points.length; i++){
            var temp = 0;

            var p0 = new Array();
            var p1 = new Array();
            var p2 = new Array();
            var p3 = new Array();
    
            //make a line, one point is the one we're checking, the other is 
            //at the other side of the globe at the same longitude at 
            //-180 degrees 
            p2['lat'] = Number(points[i][2]) + 90.0;
            p2['lng'] = Number(points[i][1]) + 180.0;
            p3['lat'] = p2['lat'];
            p3['lng'] = 0;
            
            for(var k=0; k<perimeterF.length; k++){

                if(k + 1 < perimeterF.length){
                    p0['lat'] = perimeterF[k]['lat'] + 90.0;
                    p0['lng'] = perimeterF[k]['lng'] + 180.0;
                    p1['lat'] = perimeterF[k+1]['lat'] + 90.0;
                    p1['lng'] = perimeterF[k+1]['lng'] + 180.0;
                }
                else{
                    p0['lat'] = perimeterF[k]['lat'] + 90.0;
                    p0['lng'] = perimeterF[k]['lng'] + 180.0;
                    p1['lat'] = perimeterF[0]['lat'] + 90.0;
                    p1['lng'] = perimeterF[0]['lng'] + 180.0;
                }
                if(line_intersects(p0,p1,p2,p3)==true){
                    temp += 1;

                }
            }
            if(temp % 2 == 1){
                var latf = points[i][2];
                var lngf = points[i][1];
                var colorf = points[i][0];
                var tempP = L.circleMarker([latf, lngf], {radius: 3, color: colorf, weight: 0, opacity: 1, fillOpacity: 1}).addTo(map);
                res.push(tempP);

            }

        }
    if (res != undefined && res.length != 0) {
        return res;
    }else{
        return null;
    }
}

function polygonCenter(perimeterF){
    var lat = 0.0;
    var lng = 0.0;
    var A = 0.0;

    //getting actual lat, lng of our center point, and area of polygon
    for(var i = 0; i < perimeterF.length; i++){
        var pi1 = new Array();
        var pi2 = new Array();

        pi1 = perimeterF[i];
        pi2 = perimeterF[(i + 1) % perimeterF.length];
        var determinant = (pi1['lng'] * pi2['lat']) - (pi2['lng'] * pi1['lat']);
        A += determinant;
        lat += (pi1['lat'] + pi2['lat']) * determinant;
        lng += (pi1['lng'] + pi2['lng']) * determinant;

    }

    A /= 2.0;
    //A = Math.abs(A);

    lat /= 6.0 * A;
    lng /= 6.0 * A;

    return [lat, lng, A];
    
}

//draw lines for polygon block
var lines = new Array();
var prettyPoints = new Array();
var polygons = new Array();
var complete = false;
function onClick(e) 
{	

	var lat = e.latlng.lat;
	var lng = e.latlng.lng;

	//keep the longitude within the bounds of the map
	if(lng < -180)
		lng = -180;

	if(lng > 180)
		lng = 180;

    var prettyPoint = 
    L.circleMarker([lat, lng], {radius: 4, color: 'red', weight: 0, opacity: 1, fillOpacity: 1}).addTo(map);
    prettyPoints.push(prettyPoint);
	if(check_intersect(lat, lng, 0))
	{
		alert('The line you are drawing intersects another line.');
		return false;
	}

	
	if(perimeter.length > 0)
	{
		var polyline = 
		L.polyline([[lat, lng],[perimeter[perimeter.length-1]['lat'], perimeter[perimeter.length-1]['lng']]], 
			{color: 'red'}).addTo(map);
		lines.push(polyline);
	}
	perimeter.push({'lat':lat, 'lng':lng});
	

}

var dateValuef;
var jsonResponse = [];
const itemMap = new Map();
var itemMapId = 0;
//draw polygon with right click
map.on('contextmenu', async function(e) {
    L.DomEvent.preventDefault(e);   // or e.originalEvent.preventDefault()
    
    if(lines.length > 1 && !check_intersect(perimeter[perimeter.length-1]['lat'], perimeter[perimeter.length-1]['lng'], 1))
    {   
        for(var i = 0; i<lines.length; i++){
            lines[i].remove();
        }
        for(var i = 0; i<prettyPoints.length; i++){
            prettyPoints[i].remove();
        }
        prettyPoints = [];
    	lines = [];
    	var polygon = L.polygon(perimeter).addTo(map);
    	polygons.push(perimeter);

        //get date and use later on
        var formatDate = '';
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var date = new Date().getDate();
        formatDate = year + '-' + (month+1) + '-' + date;
        dateValuef = formatDate;

        await sendData(polygons.length - 1, polygonCenter(perimeter));
        var pointColors = isInsidePolygon(jsonResponse, perimeter);

        //screenshot for the frontend
        try {
            //load plugin
            const ScreenshoterClass = window['leaflet-simple-map-screenshoter'].SimpleMapScreenshoter;
            var simpleMapScreenshoter = new ScreenshoterClass({
                hidden: true,
            }).addTo(map);


            var currentCenter = map.getCenter(); 
            var currentZoom = map.getZoom(); 

            var polygonCenterArea = polygonCenter(perimeter);
            var newZoom = Math.ceil(Math.log2(Math.sqrt(60000 / Math.abs(polygonCenterArea[2]))));
            if(newZoom == 1) newZoom += 1;
            map.setView([polygonCenterArea[0], polygonCenterArea[1]], newZoom, {animate:false});
            //wait a little if zooming out
            await new Promise(r => setTimeout(r, 500));

            const image = await simpleMapScreenshoter.takeScreen('image');
            map.setView(currentCenter, currentZoom, {animate: false});


            var itemList = document.querySelector('.item-list');
            
            if (itemList) {
                var itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                itemDiv.id = itemMapId;

                
                
                const innerMap = new Map();
                itemMap.set(itemMapId, [formatDate, innerMap]);
                innerMap.set(formatDate, pointColors);


                itemMapId += 1;

                var img = document.createElement('img');
                img.src = image;
                img.style.width = '100px'; 
                img.style.height = '60px';

                var textDiv = document.createElement('div');
                textDiv.classList.add('item-text');
                textDiv.innerText = formatDate;

                itemDiv.appendChild(img);
                itemDiv.appendChild(textDiv);
                itemList.prepend(itemDiv);

            }
        } catch (error) {
            console.error("Screenshot failed:", error);
            alert("Could not take screenshot: " + error.toString());
        }

    	perimeter = [];

    }
    else
    {
    	alert('polygon must have at least 2 sides to create or you are trying to form a shape that is not a polygon (line intersections)')
    }
});


//when page url changes (polygon is selected and itemId changes), do the following
window.addEventListener('hashchange', function(e){
    const hashString = window.location.hash.substring(1);
    const params = new URLSearchParams(hashString);
    if(params.size > 0){
        var itemList = document.querySelector('.date-list');
        itemList.innerHTML = '';
        //might be an error here check later
        itemMap.forEach(([formatDate, formatinnerMap], itemMapId) =>{
            if(itemMapId == parseInt(params.get('itemId'))){
                formatinnerMap.forEach((allPoints, specDate) =>{
                    var itemDiv = document.createElement('div');
                    itemDiv.classList.add('dateItem');
    
                    var textDiv = document.createElement('div');
                    textDiv.classList.add('item-text');
                    textDiv.innerText = specDate;
    
                    itemDiv.appendChild(textDiv);
                    itemList.prepend(itemDiv);

                });
            }
        });
    }
});


//date button pressed, add new date to selected polygon
const submitButton = document.getElementById('submitDateBtn');
submitButton.addEventListener('click', async () => {
    const dateValue = document.getElementById('date-selector').value;
    

    const hashString = window.location.hash.substring(1);
    const params = new URLSearchParams(hashString);
    if(params.size > 0){
        var DitemList = document.querySelector('.date-list');
        console.log(itemMap.get(parseInt(params.get('itemId')))[1].has(dateValue))

        if(!itemMap.get(parseInt(params.get('itemId')))[1].has(dateValue)){
            var DitemDiv = document.createElement('div');
            DitemDiv.classList.add('dateItem');

            var DtextDiv = document.createElement('div');
            DtextDiv.classList.add('item-text');

            DtextDiv.innerText = dateValue;
            DitemDiv.appendChild(DtextDiv);
            DitemList.prepend(DitemDiv);

            //http set request here again and get the points + colors, add it in the array
            dateValuef = dateValue;


            await sendData(parseInt(params.get('itemId')), polygonCenter(polygons[parseInt(params.get('itemId'))]));
            var pointColors = isInsidePolygon(jsonResponse, polygons[parseInt(params.get('itemId'))]);
            console.log("Added new date " + dateValuef + " with point array length " + pointColors.length);
            itemMap.get(parseInt(params.get('itemId')))[1].set(dateValue, pointColors);
        }
        
    }
});

//when a date time list item is pressed, change inside points to just the ones of the specific time.
const listD = document.querySelector('.date-list');
listD.addEventListener('click', (event) => {
    const clickedItem = event.target.closest('.dateItem');
    
    if (clickedItem) {
        const allItems = listD.querySelectorAll('.dateItem');
        allItems.forEach(item => item.classList.remove('selected'));
        clickedItem.classList.add('selected');

        const hashString = window.location.hash.substring(1);
        const params = new URLSearchParams(hashString);

        var tempMapItem = itemMap.get(parseInt(params.get('itemId')));

        if(tempMapItem[1].get(tempMapItem[0]) != null){
            console.log("Got to first loop");
            for(var i = 0; i < tempMapItem[1].get(tempMapItem[0]).length; i++){
                tempMapItem[1].get(tempMapItem[0])[i].remove();
            }
        }

        tempMapItem[0] = clickedItem.innerText;
        if(tempMapItem[1].get(tempMapItem[0]) != null){
            console.log("Got to second loop");
            for(var i = 0; i < tempMapItem[1].get(tempMapItem[0]).length; i++){
                tempMapItem[1].get(tempMapItem[0])[i].addTo(map);
            }
        }
    }
});


//undo line created with ctrl + z
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && perimeter.length > 0) {
        if(lines.length > 0) 
        {
        	lines[lines.length-1].remove();
        	lines.pop();
        }
        if(prettyPoints.length > 0){
            prettyPoints[prettyPoints.length - 1].remove();
            prettyPoints.pop();
        } 
        perimeter.pop();
        e.preventDefault();   // stop browser's native undo
    }
    //if(e.shiftKey){
    //	sendData();
    //}
});



async function getData() {
    const url = 'http://localhost:8000/data'
    try
    {
    const response = await fetch(url);
    const json = await response.json();
    //jsonResponse = JSON.stringify(json);
    /*fetch(url)
    .then(response => response.json())  
    .then(json => {
        console.log(json);*/
        
    //})
	} catch(error)
	{
		console.error('Error: ',error)
	}
}

async function sendData(polyI, polyCenter){
	const url = 'http://localhost:8000/coords'
	try
    {
    
    payload = {vector: Array.from(polygons[polyI]), date: new String(dateValuef), center: Array.from(polyCenter)};
console.log(polygons[polygons.length - 1]);
    const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' //Tell the server you are sending JSON
            },
            body: JSON.stringify(payload) //Convert the js object to a JSON string
        });
    const json = await response.json();
    jsonResponse = json;
    /*fetch(url)
    .then(response => response.json())  
    .then(json => {
        console.log(json);*/
        
    //})
	} catch(error)
	{
		console.error('Error: ',error)
	}
}