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


function check_intersect(lat,lng){
    if(perimeter.length < 3){
        return false;
    }
    var p0 = new Array();
    var p1 = new Array();
    var p2 = new Array();
    var p3 = new Array();

    p2['lat'] = perimeter[perimeter.length-1]['lat'] + 90;
    p2['lng'] = perimeter[perimeter.length-1]['lng'] + 180;
    p3['lat'] = lat + 90;
    p3['lng'] = lng + 180;

    for(var i=0; i<perimeter.length-1; i++){
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
    
    for(var j = 0; j<points.length; j++){
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
                L.circleMarker([points[j][i][2], points[j][i][1]], {radius: 3, color: points[j][i][0], weight: 0, opacity: 1, fillOpacity: 1}).addTo(map);
            }

        }
    }
}

//draw lines for polygon block
var lines = new Array();
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

	if(check_intersect(lat, lng))
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

var jsonResponse = [];
//draw polygon with right click
map.on('contextmenu', async function(e) {
    L.DomEvent.preventDefault(e);   // or e.originalEvent.preventDefault()
    if(lines.length > 1)
    {
    	lines = [];
    	var polygon = L.polygon(perimeter).addTo(map);
    	polygons.push(perimeter);
        await sendData();
        isInsidePolygon(jsonResponse, perimeter);
    	perimeter = [];

    }
    else
    {
    	alert('polygon must have at least 2 sides to create')
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
        perimeter.pop();
        e.preventDefault();   // stop browser's native undo
    }
    //if(e.shiftKey){
    //	sendData();
    //}
});


//fetch pythonAPI data
// Source - https://stackoverflow.com/a/57906124
// Posted by TheSmartMonkey, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-22, License - CC BY-SA 4.0

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

async function sendData(){
	const url = 'http://localhost:8000/coords'
	try
    {
    
    payload = {vector: Array.from(polygons[polygons.length - 1])};
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