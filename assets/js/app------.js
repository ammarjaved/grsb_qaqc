var map
var allAdminData;
var customer;
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var identifyme='';
var oldValuePc;
var oldValuePcr;
var img_sel_path='';


function searchPlaces(){
  var inp = document.getElementById("addr");
  $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=10&q=' + inp.value, function(data) {
    var items = [];

    $.each(data, function(key, val) {
      bb = val.boundingbox;
      items.push("<li><a href='#' onclick='chooseAddr(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></li>');
    });

    $('#results').empty();
    if (items.length != 0) {
      $('<p>', { html: "Search results:" }).appendTo('#results');
      $('<ul/>', {
        'class': 'my-new-list',
        html: items.join('')
      }).appendTo('#results');
    } else {
      $('<p>', { html: "No results found" }).appendTo('#results');
    }
  })
  }


var percent='';
function percentages() {
  if(percent!=''){
    map.removeLayer(percent);
  }
  percent = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 5,
        fillColor: '#00F700',
        fillOpacity: 1,
        color: '#00F700',
        weight: 1
        ,
        title: '',
        riseOnHover: true
      });
    },
    onEachFeature: function (feature, layer) {
      if (feature.properties) {
        var content = "<table class='table table-striped table-bordered table-condensed'>" +
            "<tr><th>Id</th><td>" + "<input type='text' class='form-control' value="+feature.id+" id='id1' name='id1' readonly/>" + "</td></tr>" +
            "<tr><th>Poi Name</th><td>" + "<input type='text' class='form-control' value='"+feature.properties.poi+"' id='poi_name1' name='poi_name1'/>" + "</td></tr>" +
            "<tr><th>Alternative Name</th><td>" + "<input type='text' class='form-control' value='"+feature.properties.alternative_name+"' id='an1' name='an1'/>" + "</td></tr>" +

            "<tr><th>Business Type</th><td>"+

            "<select name='bt1'  class='form-control' id='bt1' >"+
            "<option  value='"+feature.properties.business_type+"'>"+feature.properties.business_type+"</option>"+
            "<option value='Healthcare' >Healthcare</option>"+
            "<option value='Education'>Education</option>"+
            "<option value='Temple'>Temple</option>"+
            "<option value='Residential'>Residential</option>"+
            "<option value='Government Building'>Government Building</option>"+
            "<option value='Movie/Theatre'>Movie/Theatre</option>"+
            "<option value='Hotel'>Hotel</option>"+
            "<option value='Airport'>Airport</option>"+
            "<option value='Mank'>Bank</option>"+
            "<option value='Museum'>Museum</option>"+
            "<option value='Monument'>Monument</option>"+
            "<option value='Church'>Church</option>"+
            "<option value='Mosque'>Mosque</option>"+
            "<option value='Library'>Library</option>"+
            "<option value='Station'>Station</option>"+
            "<option value='Food And Beverage'>Food And Beverage</option>"+
            "<option value='Commercial Building'>Commercial Building</option>"+
            "<option value='Sports/Recreation Center'> Sports/Recreation Center</option>"+
            "<option value='Police'>Police</option>"+
            "<option value='Shopping Mall/Shops'>Shopping Mall/Shops</option>"+
            "<option value='Market'>Market</option>"+
            "<option value='Stadium'> Stadium</option>"+
            "<option value='Bar/Pub/Club'> Bar/Pub/Club</option>"+
            "<option value='Embassy'>Embassy</option>"+
            "<option value='Casino'>Casino</option>"+
            "<option value='Quay'>Quay</option>"+
            "<option value='Utilities'>Utilities</option>"+
            "<option value='Street'>Street</option>"+
            "<option value='Parking lot'>Parking lot</option>"+
            "</select>"+
            "</td>" +
            "</tr>" +
            "<tr><th>Lot No</th><td>" + "<input type='text' class='form-control' id='lot_no1' value='"+feature.properties.lot_no+"' name='lot_no1'>"+ "</td></tr>" +
            "<tr><th>Street Name</th><td>"+ "<input type='text' class='form-control' value='"+feature.properties.street_name+"' id='street_name1' name='street_name1'/>"+ "</td></tr>" +
            "<tr><th>Branch Poi Name</th><td>"+ "<input type='checkbox' onclick='combineName1()'  id='pc1' name='pc'>"+ "</td></tr>" +
            "<tr><th>Area/Building/Neighbourhood</th><td>"+ "<input type='text' class='form-control' value='"+feature.properties.area_building_name_neighbourhood+"' id='nh1' name='nh1'/>"+ "</td></tr>" +
            "<tr><th>Residential Poi Name</th><td>"+ "<input type='checkbox' onclick='combineNameR1()'  id='pcr1' name='pcr1'>"+ "</td></tr>" +
            "<tr><th>Post Code</th><td>" + "<input type='text' class='form-control' value='"+feature.properties.post_code+"' id='post_code1' name='post_code1'/>" + "</td></tr>" +
            "<tr><th>City Name</th><td>"+ "<input type='text' class='form-control' value='"+feature.properties.city_name+"' id='cn1' name='cn1'/>"+ "</td></tr>" +
            "<tr><th>State</th><td>" + "<input type='text' class='form-control' value='"+feature.properties.state+"' id='state1' name='state1'/>" + "</td></tr>" +
            "<tr><th>XY</th><td>" + feature.properties.xy + "</td></tr>" +

            '<tr><th>Image Path</th><td>'+
            '<input type="text" class="form-control" value="'+feature.properties.image_path+'" id="img_path1" name="img_path1">'+
            '<button onclick="getNewPath()" class="btn btn-success">get new path</button>'+
            '</td></tr>'+

            // '<tr><th>Image preview </th><td>'+
            // '<img src="'+'http://121.121.232.53:88'+img_sel_path+'" width=30px height=30px/>'+
            // '</td></tr>'+

            "<tr><td><button class='btn btn-success' onclick='updateRec()'>update</button></td><td><button class='btn btn-danger' onclick='deleteRec()'>Delete</button></td></tr>" +
            "</table>";
        ;
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.id);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
         //   highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));

          }
        });
      }
    }
  });
  $.getJSON("services/plot.php", function (data) {
    percent.addData(JSON.parse(data[0].json_build_object));
    // map.addLayer(landuse);
    // setTimeout(function(){
    map.addLayer(percent);
    // },2000)
  });
}



var incom='';
function incomplete() {
  if(incom!=''){
    map.removeLayer(incom);
  }
  incom = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 5,
        fillColor: '#E20000',
        fillOpacity: 1,
        color: '#E20000',
        weight: 1
        ,
        title: '',
        riseOnHover: true
      });
    },
    onEachFeature: function (feature, layer) {
      if (feature.properties) {
        var content = "<table class='table table-striped table-bordered table-condensed'>" +
            "<tr><th>Id</th><td>" + "<input type='text' class='form-control' value="+feature.id+" id='id1' name='id1' readonly/>" + "</td></tr>" +
            "<tr><th>Poi Name</th><td>" + "<input type='text' class='form-control' value='"+feature.properties.poi+"' id='poi_name1' name='poi_name1'/>" + "</td></tr>" +
            "<tr><th>Alternative Name</th><td>" + "<input type='text' class='form-control' value='"+feature.properties.alternative_name+"' id='an1' name='an1'/>" + "</td></tr>" +

            "<tr><th>Business Type</th><td>"+

            "<select name='bt1'  class='form-control' id='bt1' >"+
            "<option  value='"+feature.properties.business_type+"'>"+feature.properties.business_type+"</option>"+
            "<option value='Healthcare' >Healthcare</option>"+
            "<option value='Education'>Education</option>"+
            "<option value='Temple'>Temple</option>"+
            "<option value='Residential'>Residential</option>"+
            "<option value='Government Building'>Government Building</option>"+
            "<option value='Movie/Theatre'>Movie/Theatre</option>"+
            "<option value='Hotel'>Hotel</option>"+
            "<option value='Airport'>Airport</option>"+
            "<option value='Mank'>Bank</option>"+
            "<option value='Museum'>Museum</option>"+
            "<option value='Monument'>Monument</option>"+
            "<option value='Church'>Church</option>"+
            "<option value='Mosque'>Mosque</option>"+
            "<option value='Library'>Library</option>"+
            "<option value='Station'>Station</option>"+
            "<option value='Food And Beverage'>Food And Beverage</option>"+
            "<option value='Commercial Building'>Commercial Building</option>"+
            "<option value='Sports/Recreation Center'> Sports/Recreation Center</option>"+
            "<option value='Police'>Police</option>"+
            "<option value='Shopping Mall/Shops'>Shopping Mall/Shops</option>"+
            "<option value='Market'>Market</option>"+
            "<option value='Stadium'> Stadium</option>"+
            "<option value='Bar/Pub/Club'> Bar/Pub/Club</option>"+
            "<option value='Embassy'>Embassy</option>"+
            "<option value='Casino'>Casino</option>"+
            "<option value='Quay'>Quay</option>"+
            "<option value='Utilities'>Utilities</option>"+
            "<option value='Street'>Street</option>"+
            "<option value='Parking lot'>Parking lot</option>"+
            "</select>"+
            "</td>" +
            "</tr>" +
            "<tr><th>Lot No</th><td>" + "<input type='text' class='form-control' id='lot_no1' value='"+feature.properties.lot_no+"' name='lot_no1'>"+ "</td></tr>" +
            "<tr><th>Street Name</th><td>"+ "<input type='text' class='form-control' value='"+feature.properties.street_name+"' id='street_name1' name='street_name1'/>"+ "</td></tr>" +
            "<tr><th>Branch Poi Name</th><td>"+ "<input type='checkbox' onclick='combineName1()'  id='pc1' name='pc'>"+ "</td></tr>" +
            "<tr><th>Area/Building/Neighbourhood</th><td>"+ "<input type='text' class='form-control' value='"+feature.properties.area_building_name_neighbourhood+"' id='nh1' name='nh1'/>"+ "</td></tr>" +
            "<tr><th>Residential Poi Name</th><td>"+ "<input type='checkbox' onclick='combineNameR1()'  id='pcr1' name='pcr1'>"+ "</td></tr>" +
            "<tr><th>Post Code</th><td>" + "<input type='text' class='form-control' value='"+feature.properties.post_code+"' id='post_code1' name='post_code1'/>" + "</td></tr>" +
            "<tr><th>City Name</th><td>"+ "<input type='text' class='form-control' value='"+feature.properties.city_name+"' id='cn1' name='cn1'/>"+ "</td></tr>" +
            "<tr><th>State</th><td>" + "<input type='text' class='form-control' value='"+feature.properties.state+"' id='state1' name='state1'/>" + "</td></tr>" +
            "<tr><th>XY</th><td>" + feature.properties.xy + "</td></tr>" +

            '<tr><th>Image Path</th><td>'+
            '<input type="text" class="form-control" value="'+feature.properties.image_path+'" id="img_path1" name="img_path1">'+
            '<button onclick="getNewPath()" class="btn btn-success">get new path</button>'+
            '</td></tr>'+

            // '<tr><th>Image preview </th><td>'+
            // '<img src="'+'http://121.121.232.53:88'+img_sel_path+'" width=30px height=30px/>'+
            // '</td></tr>'+

            "<tr><td><button class='btn btn-success' onclick='updateRec()'>update</button></td><td><button class='btn btn-danger' onclick='deleteRec()'>Delete</button></td></tr>" +
            "</table>";
        ;
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.id);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
            //   highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));

          }
        });
      }
    }
  });
  $.getJSON("services/plot1.php", function (data) {
    incom.addData(JSON.parse(data[0].json_build_object));
    // map.addLayer(landuse);
    // setTimeout(function(){
    map.addLayer(incom);
    // },2000)
  });
}


function showExcelModel(){
  $("#featureModal1").modal("show");
}

// $.ajax({
//   url: "services/start.php",
//   type: "GET",
//   dataType: "json",
//   contentType: "application/json; charset=utf-8",
//   success: function callback(response) {
//     allAdminData=response;
//     var str='<option>select district</option>';
//     for(var i=0;i<allAdminData.district.length;i++){
//       str=str+'<option val="'+allAdminData.district[i].district_name+'">'+allAdminData.district[i].district_name+'</option>'
//     }
//     $("#dist").html(str)
//   }
// });


function getNewPath(){
  $("#img_path1").val(img_sel_path)
}

function updateRec(){
  // var poi=$("#poi_name1").val()
  // var bt=$("#bt1").val()
  // var lot_no=$("#lot_no1").val()
  // var st_name=$("#street_name1").val()
  // var post_code=$("#post_code1").val()
  // var state=$("#state1").val();
  // var nh=$("#nh1").val();
  // var cn=$("#cn1").val();
  var gs=combineNameGS1();
  var poi=encodeURIComponent($("#poi_name1").val().replace(/\'/g, "''"))
  var bt=encodeURIComponent($("#bt1").val().replace(/\'/g, "''"))
  var lot_no=encodeURIComponent($("#lot_no1").val().replace(/\'/g, "''"))
  var st_name=encodeURIComponent($("#street_name1").val().replace(/\'/g, "''"))
  var post_code=encodeURIComponent($("#post_code1").val().replace(/\'/g, "''"))
  var state=encodeURIComponent($("#state1").val().replace(/\'/g, "''"))
  var cn=encodeURIComponent($("#cn1").val().replace(/\'/g, "''"))
  var nh=encodeURIComponent($("#nh1").val().replace(/\'/g, "''"))
  var id=$("#id1").val()
  var an=$("#an1").val()
  var img_path=$("#img_path1").val()
  $.ajax({
    url: "services/update.php?poi="+poi+'&bt='+bt+'&lot_no='+lot_no+'&id='+id+'&st_name='+st_name+'&p_code='+post_code+'&state='+state+'&nh='+nh+'&cn='+cn+'&uid='+user_id+'&an='+an+'&img_path='+img_path+'&gs='+gs,
    type: "GET",
    // dataType: "json",
    // contentType: "application/json; charset=utf-8",
    success: function callback(response) {
      alert(response);
      percentages()
      incomplete()
      $('#featureModal').modal('toggle');
      highlight.clearLayers()
    }
  });
}


function deleteRec(){

  var id=$("#id1").val()
  $.ajax({
    url: "services/delete.php?id="+id,
    type: "GET",
    // dataType: "json",
    // contentType: "application/json; charset=utf-8",
    success: function callback(response) {
      alert(response);
      percentages()
      incomplete()
      $('#featureModal').modal('toggle');
      highlight.clearLayers()
    }
  });
}

map = L.map("map", {
  zoom: 11,
  center: [3.016603, 101.858382],
  layers: [highlight],
  zoomControl: false,
  attributionControl: false
});
document.getElementById('map').style.cursor = 'pointer'
/* La

/* Filter sidebar feature list to only show features in current map bounds */

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);
map.on("click", function(e) {
  highlight.clearLayers();
});

var st=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
//.addTo(map);
var st1=L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 22,
  subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

customer = L.tileLayer.wms("http://121.121.232.53:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:pano_layer',
  format: 'image/png',
  maxZoom: 22,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
customer.addTo(map);


dist_boundary = L.tileLayer.wms("http://121.121.232.53:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:district boundary',
  format: 'image/png',
  maxZoom: 22,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
dist_boundary.addTo(map);


state = L.tileLayer.wms("http://121.121.232.53:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:state_boundary',
  format: 'image/png',
  maxZoom: 22,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
state.addTo(map);

postcode = L.tileLayer.wms("http://121.121.232.53:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:poscode_boundary',
  format: 'image/png',
  maxZoom: 22,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
//postcode.addTo(map);

cpoi = L.tileLayer.wms("http://121.121.232.53:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:complete_poi',
  format: 'image/png',
  maxZoom: 22,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
//cpoi.addTo(map);
inpoi = L.tileLayer.wms("http://121.121.232.53:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:incomplete_poi',
  format: 'image/png',
  maxZoom: 22,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
//inpoi.addTo(map);

/* GPS enabled geolocation control set to follow the user's location */


/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": st,
  "Aerial Imagery": st1
};
setTimeout(function(){
  var groupedOverlays = {
    "Points of Interest": {
      //"Area B Violations All": theaterLayer,
      "panoLayer":customer,
      "complete":percent,
      "incomplete":incom,
      "district boundary":dist_boundary,
      "state boundary":state,
      "postcode boundary":postcode
      // ,
      // "complete poi":cpoi,
      // "incomplete poi":inpoi


      // "<img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums": museumLayer
    },
    //,
    "Reference": {

    }
  };

  var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
    collapsed: isCollapsed
  }).addTo(map);
},3000)






var theMarker='';
function drawNewPoint(){
  map.off("click");
  if(identifyme!=''){
    map.removeLayer(identifyme)
  }
  map.on('click', function (e) {
    var lat = e.latlng.lat;
    var lon = e.latlng.lng;

    let drawnGeom = JSON.parse('{"type":"Point","coordinates":[' + lon + ',' + lat + ']}');



    console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
    //Clear existing marker,

    // if (theMarker != undefined) {
    //     map.removeLayer(theMarker);
    // };

    //Add a marker to show where you clicked.
    console.log([lat, lon])
     theMarker = L.marker([lat, lon]).addTo(map);

    $.ajax({
      url: "services/main.php?geom="+lon+' '+lat,
      type: "GET",
      // dataType: "json",
      // contentType: "application/json; charset=utf-8",
      success: function callback(response) {
       var col_street='';
        if(response.street==false){
          col_street=null
        }else{
          col_street=response.street[0].street;
        }

    var tbl= '<form action="">'+
        '<div class="form-group" style="height: 400px;overflow-y: scroll;">'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >POI Name :</label>'+
        '<input type="text" class="form-control" id="poi_name" name="poi_name">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Alternative Name :</label>'+
        '<input type="text" class="form-control" id="an" name="an">'+
        '</div>'+

        '<div class="form-group">'+
        '<select name="bt" class="form-control" id="bt" >'+
        '<option selected value="en">Select business type</option>'+
        '<option value="HealthCare" >Healthcare</option>'+
        '<option value="Education">Education</option>'+
        '<option value="Temple">Temple</option>'+
        '<option value="Residential">Residential</option>'+
        "<option value='Government building'>Government building</option>"+
        "<option value='Movie/Theatre'>Movie/theatre</option>"+
        "<option value='Hotel'>Hotel</option>"+
        '<option value="Airport">Airport</option>'+
        '<option value="Bank">Bank</option>'+
        '<option value="Museum">Museum</option>'+
        '<option value="Monument">Monument</option>'+
        '<option value="Church">Church</option>'+
        '<option value="Mosque">Mosque</option>'+
        '<option value="Library">Library</option>'+
        '<option value="Station">Station</option>'+
        '<option value="Food and Beverage">Food and Beverage</option>'+
        '<option value="Commercial Building"> Commercial Building</option>'+
        '<option value="Sports/Recreation Center"> Sports/Recreation Center</option>'+
        '<option value="Police">Police</option>'+
        '<option value="Shopping Mall/Shops">Shopping Mall/Shops</option>'+
        '<option value="Market">Market</option>'+
        '<option value="Stadium"> Stadium</option>'+
        '<option value="Bar/Pub/Club"> Bar/Pub/Club</option>'+
        '<option value="Embassy">Embassy</option>'+
        '<option value="Casino">Casino</option>'+
        '<option value="Quay">Quay</option>'+
        '<option value="Utilities">Utilities</option>'+
        '<option value="Street">Street</option>'+
        '<option value="Parking Lot">Parking Lot</option>'+
        '</select>'+
        '</div>'+
        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Lot No :</label>'+
        '<input type="text" class="form-control"  value="" id="lot_no" name="lot_no">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Street Name  :</label>'+
        '<input type="text" class="form-control" value="'+col_street+'" id="st_name" name="st_name">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
         '<label for="img" >Branch Poi Name:</label>'+
        '<input type="checkbox" onclick="combineName()"  id="pc" name="pc">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Area/Building Name/Neighbourhood  :</label>'+
        '<input type="text" class="form-control" value="" id="nh" name="nh">'+
        '</div>'+


        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Residential Poi Name :</label>'+
        '<input type="checkbox"  onclick="combineNameR()" id="pcr" name="pcr">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Grab Street:</label>'+
        '<input type="text" class="form-control" value="" id="gs" name="gs" readonly>'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Fill Grab Street:</label>'+
        '<input type="checkbox"  onclick="combineNameGS()" id="pgs" name="pgs">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Postcode:</label>'+
        '<input type="text" value="'+response.postcode[0].postcode+'" class="form-control" id="p_code" name="p_code">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >City Name :</label>'+
        '<input type="text" value="Klang valley" class="form-control" id="cn" name="cn" readonly>'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >State    :</label>'+
        '<input type="text" class="form-control" value="'+response.state[0].nam+'" id="state" name="state">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Coordinates (x/y)    :</label>'+
        '<input type="text" value="'+parseFloat(lon).toFixed(6)+','+parseFloat(lat).toFixed(6)+'" id="coor" class="form-control" name="coor">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Image Path    :</label>'+
        '<input type="text" class="form-control" value="'+img_sel_path+'" id="img_path" name="img_path">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Image preview    :</label>'+
        '<a href="'+'http://121.121.232.53:88'+img_sel_path+'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="'+'http://121.121.232.53:88'+img_sel_path+'" width=30px height=30px/></a>'+
        '</div>'+




        '</form>'+
        '<button id="btnSave" type="button" onclick="savedata()" class="btn btn-success">Save</button>';
    theMarker.bindPopup(tbl, {
      minWidth : 250
    });
      }
    });


    map.off("click");
    activeSelectedLayerPano();



  });
}


$(document).ready(function () {
  percentages();
  incomplete();
  if(user_id=='2'){
    $('#ex').show();
    $('#pie_chart').show()

  }

  activeSelectedLayerPano()
  $("date1").on("change", function() {
    this.setAttribute(
        "data-date",
        moment(this.value, "YYYY-MM-DD")
            .format( this.getAttribute("data-date-format") )
    )
  }).trigger("change")

  $.ajax({
    url: "services/count.php",
    type: "GET",
    // dataType: "json",
    // contentType: "application/json; charset=utf-8",
    success: function callback(response) {
     $("#tpoi").html(response.count[0].count);
      $("#cpoi").html(response.complete[0].count);
      $("#inpoi").html(response.incomplete[0].count);
      var total_count=((parseInt(response.count[0].count))/700000)*100
      var complete=((parseInt(response.complete[0].count))/700000)*100
      var incomplete=((parseInt(response.incomplete[0].count))/700000)*100
      var remaining=((700000-(parseInt(response.count[0].count)))/700000)*100
          var data=[{
        name: 'total poi Draw',
        y: total_count,
        sliced: true,
        selected: true
      }, {
        name: 'complete',
        y: complete
      }, {
        name: 'Incomplete',
        y: incomplete
      }, {
        name: 'Remainung Count',
        y: remaining
      }]

      pieChart(data);

    }
  });

})




function combineName(){
  if($('#pc').is(':checked')){
    var comb=$("#poi_name").val()+'-'+$("#st_name").val();
    oldValuePc=$("#poi_name").val()
    $("#poi_name").val(comb)
  }else{
    $("#poi_name").val(oldValuePc)
  }
}

function combineNameR(){
  if($('#pcr').is(':checked')){
    var comb=$("#lot_no").val()+', '+$("#poi_name").val()+' '+$("#st_name").val()+', '+$("#nh").val();
    oldValuePcr=$("#poi_name").val()
    $("#poi_name").val(comb)
  }else{
    $("#poi_name").val(oldValuePcr)
  }
}

function combineNameGS(){
    var comb=$("#st_name").val()+', '+$("#nh").val();
    $("#gs").val(comb)
}



function combineName1(){
  if($('#pc1').is(':checked')){
    var comb=$("#poi_name1").val()+'-'+$("#street_name1").val();
    oldValuePc=$("#poi_name1").val()
    $("#poi_name1").val(comb)
  }else{
    $("#poi_name1").val(oldValuePc)
  }
}

function combineNameR1(){
  if($('#pcr1').is(':checked')){
    var comb=$("#lot_no1").val()+', '+$("#poi_name1").val()+' '+$("#street_name1").val()+', '+$("#nh1").val();
    oldValuePcr=$("#poi_name1").val()
    $("#poi_name1").val(comb)
  }else{
    $("#poi_name1").val(oldValuePcr)
  }
}

function combineNameGS1(){
    var comb=$("#street_name1").val()+', '+$("#nh1").val();
        return comb;
}



function savedata(){
  combineNameGS();
  var poi=encodeURIComponent($("#poi_name").val().replace(/\'/g, "''"))
  var bt=encodeURIComponent($("#bt").val().replace(/\'/g, "''"))
  var lot_no=encodeURIComponent($("#lot_no").val().replace(/\'/g, "''"))
  var st_name=encodeURIComponent($("#st_name").val().replace(/\'/g, "''"))
  var p_code=encodeURIComponent($("#p_code").val().replace(/\'/g, "''"))
  var state=encodeURIComponent($("#state").val().replace(/\'/g, "''"))
  var coor=$("#coor").val().replace(/\'/g, "''")
  var cn=encodeURIComponent($("#cn").val().replace(/\'/g, "''"))
  var nh=encodeURIComponent($("#nh").val().replace(/\'/g, "''"))
  var gs=$("#gs").val()
  var an=$("#an").val()
  var img_path=$("#img_path").val()

  if(poi==''||bt==''||st_name==''||p_code==''||state==''||coor==''){
    alert("please fill all fields")
    return false;
  }

  var wkt='POINT('+coor.split(',')[0]+' '+coor.split(',')[1]+')'



  $.ajax({
  url: "services/start.php?poi="+poi+'&bt='+bt+'&lot_no='+lot_no+'&st_name='+st_name+'&p_code='+p_code+'&state='+state+'&coor='+coor+'&geom='+wkt+'&cn='+cn+'&nh='+nh+'&uid='+user_id+'&img_path='+img_path+'&gs='+gs+'&an='+an,
  type: "GET",
 // dataType: "json",
 // contentType: "application/json; charset=utf-8",
  success: function callback(response) {
        alert(response);
    removemarker()
    percentages()
    incomplete()
  }
});
}

function removemarker(){
  map.removeLayer(theMarker);
  if(identifyme!=''){
    map.removeLayer(identifyme)
  }
}

function clearHighlight() {
  highlight.clearLayers();
}

function activeSelectedLayerPano() {
//alert(val)
  map.off('click');
  map.on('click', function(e) {
    //map.off('click');
    $("#wg").html('');
    // Build the URL for a GetFeatureInfo
    var url = getFeatureInfoUrl(
        map,
        customer,
        e.latlng,
        {
          'info_format': 'application/json',
          'propertyName': 'NAME,AREA_CODE,DESCRIPTIO'
        }
    );
    $.ajax({
      url: 'services/proxy.php?url='+encodeURIComponent(url),
      dataType: 'JSON',
      //data: data,
      method: 'GET',
      async: false,
      success: function callback(data) {

        //  alert(data
        var str='<div id="window1" class="window">' +
            '<div class="green">' +
            '<p class="windowTitle">Pano Images</p>' +
            '</div>' +
            '<div class="mainWindow">' +
            // '<canvas id="canvas" width="400" height="480">' +
            // '</canvas>' +
            '<div id="panorama" width="400px" height="480px"></div>'+
            '<div class="row"><button style="margin-left: 30%;" onclick=preNext("pre") class="btn btn-success">Previous</button><button  onclick=preNext("next")  style="float: right;margin-right: 35%;" class="btn btn-success">Next</button></div>'

        '</div>' +
        '</div>'

        $("#wg").html(str);


        console.log(data)
        if(data.features.length!=0){
          createWindow(1);
          selectedId=data.features[0].id.split('.')[1];
          // var canvas = document.getElementById('canvas');
          // var context = canvas.getContext('2d');
          // context.clearRect(0,0 ,canvas.width,canvas.height)
          //     img.src = data.features[0].properties.image_path;
          //     init_pano('canvas')
          // setTimeout(function () {
          //     init_pano('canvas')
          // },1000)
          img_sel_path=data.features[0].properties.photo;
          pannellum.viewer('panorama', {
            "type": "equirectangular",
            "panorama": data.features[0].properties.photo,
            "compass": true,
            "autoLoad": true
          });
          if(identifyme!=''){
            map.removeLayer(identifyme)
          }
          identifyme = L.geoJson(data.features[0].geometry).addTo(map);

        }

      }
    });




  });
}

function preNext(status){
  $("#wg").html('');
  $.ajax({
    url: 'services/pre_next.php?id='+selectedId+'&st='+status,
    dataType: 'JSON',
    //data: data,
    method: 'GET',
    async: false,
    success: function callback(data) {

      //  alert(data
      var str='<div id="window1" class="window">' +
          '<div class="green">' +
          '<p class="windowTitle">Pano Images</p>' +
          '</div>' +
          '<div class="mainWindow">' +
          // '<canvas id="canvas" width="400" height="480">' +
          // '</canvas>' +
          '<div id="panorama" width="400px" height="480px"></div>'+
          '<div class="row"><button style="margin-left: 30%;" onclick=preNext("pre") class="btn btn-success">Previous</button><button  onclick=preNext("next")  style="float: right;margin-right: 35%;" class="btn btn-success">Next</button></div>'
      '</div>' +
      '</div>'

      $("#wg").html(str);

      createWindow(1);
      console.log(data)
      // var canvas = document.getElementById('canvas');
      // var context = canvas.getContext('2d');
      // context.clearRect(0,0 ,canvas.width,canvas.height)
      //     img.src = data.features[0].properties.image_path;
      //     init_pano('canvas')
      // setTimeout(function () {
      //     init_pano('canvas')
      // },1000)=
      selectedId=data[0].gid
      pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": data[0].photo,
        "compass": true,
        "autoLoad": true
      });
      if(identifyme!=''){
        map.removeLayer(identifyme)
      }
      identifyme = L.geoJson(JSON.parse(data[0].geom)).addTo(map);

    }
  });

}

function getFeatureInfoUrl(map, layer, latlng, params) {

  var point = map.latLngToContainerPoint(latlng, map.getZoom()),
      size = map.getSize(),

      params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
        styles: layer.wmsParams.styles,
        transparent: layer.wmsParams.transparent,
        version: layer._wmsVersion,
        format:layer.wmsParams.format,
        bbox: map.getBounds().toBBoxString(),
        height: size.y,
        width: size.x,
        layers: layer.wmsParams.layers,
        query_layers: layer.wmsParams.layers,
        info_format: 'application/json'
      };

  params[params.version === '1.3.0' ? 'i' : 'x'] = parseInt(point.x);
  params[params.version === '1.3.0' ? 'j' : 'y'] = parseInt(point.y);

  // return this._url + L.Util.getParamString(params, this._url, true);

  var url = layer._url + L.Util.getParamString(params, layer._url, true);
  if(typeof layer.wmsParams.proxy !== "undefined") {


    // check if proxyParamName is defined (instead, use default value)
    if(typeof layer.wmsParams.proxyParamName !== "undefined")
      layer.wmsParams.proxyParamName = 'url';

    // build proxy (es: "proxy.php?url=" )
    _proxy = layer.wmsParams.proxy + '?' + layer.wmsParams.proxyParamName + '=';

    url = _proxy + encodeURIComponent(url);

  }

  return url.toString();

}

function exportExcelNow(){
  var sd=$('#date1').val()
var ed=$('#date2').val();

  $()

  if(sd==''||ed==''){
    alert("Please select dates");
  }else {
    // $.ajax({
    //   url: "services/ExportExcel.php?sd=" + sd + '&ed=' + ed,
    //   type: "GET",
    //   // dataType: "json",
    //   // contentType: "application/json; charset=utf-8",
    //   success: function callback(response) {
    //
    //   }
    // });
    $("#ancr").html('<a id="anchr1" href="services/ExportExcel.php?sd='+ sd + '&ed=' + ed+'" target="_blank"></a>>');
    setTimeout(function(){
      $("#anchr1")[0].click()
    },2000)
  }
}


function pieChart(data){
  Highcharts.chart('pie_chart', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'POI %'
    },
    // tooltip: {
    //   pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    // },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [{
      name: 'POI',
      colorByPoint: true,
      data: data
    }]
  });
}