var map
var allAdminData;
var customer;
var searchlayer='null';
var selectedCustomerId='';
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 3
};

var identifyme='';
var oldValuePc;
var oldValuePcr;
var img_sel_path='';

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

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



  function search_xy(){
    var arr=[]
    var xy=$("#search_xy").val();
    var rs=xy.split(',');
    arr.push(rs[0]);
    arr.push(rs[1]);
    map.setView(arr,18);

  }

  function drawRect() {
    var polygonDrawer = new L.Draw.Rectangle(map);
    polygonDrawer.enable();
  }

$(document).ready(function(){
  setTimeout(function(){
    map.on(L.Draw.Event.CREATED, function(event) {
      var layer = event.layer.toGeoJSON();
      console.log(layer);
      updateLayerStatus(JSON.stringify(layer.geometry))
    });
  },3000)
})

function updateLayerStatus(geom){
  var status=0;
  if($('#qlc').is(':checked')){
    status=1
  }

  $.ajax({
    url: 'services/updatestatus.php?geom='+geom+'&status='+status,
    dataType: 'JSON',
    //data: data,
    method: 'GET',
    async: false,
    success: function callback(data) {
      // console.log(data);


    }
  });

}

var percent='';
function percentages() {
  // if(percent!=''){
  //   map.removeLayer(percent);
  // }
  //percent = L.geoJson(null, {
    // pointToLayer: function (feature, latlng) {
    //   label = String("Lot No:"+feature.properties.lot_no)
    //   return L.circleMarker(latlng, {
    //     radius: 5,
    //     fillColor: '#00F700',
    //     fillOpacity: 1,
    //     color: '#00F700',
    //     weight: 1
    //     ,
    //     title: '',
    //     riseOnHover: true
    //   }).bindLabel(label)
    // },
   // onEachFeature: function (feature, layer) {
  map.off('click');
  map.on('click', function(e) {
    //map.off('click');
    // Build the URL for a GetFeatureInfo
    var url = getFeatureInfoUrl(
        map,
        cpoi,
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


        //  if (feature.properties) {
        var content = "<table class='table table-striped table-bordered table-condensed'>" +
            "<tr><th>Id</th><td>" + "<input type='text' class='form-control' value=" + data.features[0].properties.id + " id='id1' name='id1' readonly/>" + "</td></tr>" +
            "<tr><th>Business Type</th><td>" +
            "<select name='bt1'  class='form-control' id='bt1' >" +
            "<option  value='" + data.features[0].properties.business_type + "'>" + data.features[0].properties.business_type + "</option>" +
            "<option value='Healthcare' >Healthcare</option>" +
            "<option value='Education'>Education</option>" +
            "<option value='Temple'>Temple</option>" +
            "<option value='Residential'>Residential</option>" +
            "<option value='Government Building'>Government Building</option>" +
            "<option value='Movie/Theatre'>Movie/Theatre</option>" +
            "<option value='Hotel'>Hotel</option>" +
            "<option value='Airport'>Airport</option>" +
            "<option value='Mank'>Bank</option>" +
            "<option value='Museum'>Museum</option>" +
            "<option value='Monument'>Monument</option>" +
            "<option value='Church'>Church</option>" +
            "<option value='Mosque'>Mosque</option>" +
            "<option value='Library'>Library</option>" +
            "<option value='Station'>Station</option>" +
            "<option value='Food And Beverage'>Food And Beverage</option>" +
            "<option value='Commercial Building'>Commercial Building</option>" +
            "<option value='Sports/Recreation Center'> Sports/Recreation Center</option>" +
            "<option value='Police'>Police</option>" +
            "<option value='Shopping Mall/Shops'>Shopping Mall/Shops</option>" +
            "<option value='Market'>Market</option>" +
            "<option value='Stadium'> Stadium</option>" +
            "<option value='Bar/Pub/Club'> Bar/Pub/Club</option>" +
            "<option value='Embassy'>Embassy</option>" +
            "<option value='Casino'>Casino</option>" +
            "<option value='Quay'>Quay</option>" +
            "<option value='Utilities'>Utilities</option>" +
            "<option value='Street'>Street</option>" +
            "<option value='Parking lot'>Parking lot</option>" +
            "</select>" +
            "</td>" +
            "</tr>" +
            "<tr><th>Poi Name</th><td>" + "<input type='text' class='form-control' value='' id='poi_name1' name='poi_name1'/>" + "</td></tr>" +
            "<tr><th>Branch Poi Name</th><td>" + "<input type='checkbox' onclick='combineName1()'  id='pc1' name='pc'>" + "</td></tr>" +
            "<tr><th>Residential Poi Name</th><td>" + "<input type='checkbox' onclick='combineNameR1()'  id='pcr1' name='pcr1'>" + "</td></tr>" +
            "<tr><th>Alternative Name</th><td>" + "<input type='text' class='form-control' value='" + data.features[0].properties.alternative_name + "' id='an1' name='an1'/>" + "</td></tr>" +
            "<tr><th>Lot No</th><td>" + "<input type='text' class='form-control' id='lot_no1' value='' name='lot_no1'>" + "</td></tr>" +
            "<tr><th>Grab Street</th><td>" + "<input type='text' class='form-control' value='' id='gs1' name='gs1'/>" + "</td></tr>" +

            "<tr><th>Fill Grab Street</th><td>" + '<input type="checkbox"  onclick="combineNameGS1()" id="pgs1" name="pgs1">' + "</td></tr>" +

            "<tr><th>Street Name</th><td>" + "<input type='text' class='form-control' value='' id='street_name1' name='street_name1'/>" + "</td></tr>" +
            "<tr><th>Area/Building/Neighbourhood</th><td>" + "<input type='text' class='form-control' value='' id='nh1' name='nh1'/>" + "</td></tr>" +


            "<tr><th>Mukim</th><td>" + "<input type='text' class='form-control' value='" + data.features[0].properties.mukim + "' id='mukim1' name='mukim1'/></td><td><input type='checkbox'  onclick='combineMukim()' id='mukim_chk1' name='mukim_chk1'>" + "</td></tr>" +
            "<tr><th>Daerah</th><td>" + "<input type='text' class='form-control' value='" + data.features[0].properties.daerah + "' id='daerah1' name='daerah1'/></td><td><input type='checkbox'  onclick='combineDaerah()' id='daerah_chk1' name='daerah_chk1'>" + "</td></tr>" +


            "<tr><th>Post Code</th><td>" + "<input type='text' class='form-control' value='" + data.features[0].properties.post_code + "' id='post_code1' name='post_code1'/>" + "</td></tr>" +
            "<tr><th>City Name</th><td>" + "<input type='text' class='form-control' value='" + data.features[0].properties.city_name + "' id='cn1' name='cn1'/>" + "</td></tr>" +
            "<tr><th>State</th><td>" + "<input type='text' class='form-control' value='" + data.features[0].properties.state + "' id='state1' name='state1'/>" + "</td></tr>" +
            "<tr><th>XY</th><td>" + data.features[0].properties.xy + "</td></tr>" +

            '<tr><th>Image Path</th><td>' +
            '<input type="text" class="form-control" value="' + data.features[0].properties.image_path + '" id="img_path1" name="img_path1">' +
            '<button onclick="getNewPath()" class="btn btn-success">get new path</button>' +
            '</td></tr>';

            // '<tr><th>Image preview </th><td>'+
            // '<img src="'+'http://121.121.232.53:88'+img_sel_path+'" width=30px height=30px/>'+
            // '</td></tr>'+
            if(user_id=="40"||user_id=="41"||user_id=="42"){

            }else{
              content=content+"<tr><td><button class='btn btn-success' onclick='updateRec()'>update</button></td><td><button class='btn btn-danger' onclick='deleteRec()'>Delete</button></td></tr>";

            }

           content=content+ "</table>";
        ;
        // layer.on({
        //   click: function (e) {
          //  $("#feature-title").html(data.features[0].properties.id);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");

        $("#poi_name1").val(data.features[0].properties.name)
        $("#lot_no1").val(data.features[0].properties.lot_no)
        $("#street_name1").val(data.features[0].properties.street_name)
        $("#gs1").val(data.features[0].properties.grab_street)
        $("#nh1").val(data.features[0].properties.area_building_name_neighbourhood)

            highlight.clearLayers().addLayer(L.circleMarker([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]], highlightStyle));
        //
        //   }
        // });

        //  }
        //   }
        // });
        // $.getJSON("services/plot.php?id="+user_id, function (data) {
        //   percent.addData(JSON.parse(data[0].json_build_object));
        //   // map.addLayer(landuse);
        //   // setTimeout(function(){
        //   map.addLayer(percent);
        //   // },2000)
        // });
        activeSelectedLayerPano()
      }
      });




  });
}

function replaceAppos(val){
  var rs= val.replace(/'|\\'/g, "\\'");
  return rs;
}

//var incom='';
function incomplete() {
  // if(incom!=''){
  //   map.removeLayer(incom);
  // }
  // incom = L.geoJson(null, {
  //   pointToLayer: function (feature, latlng) {
  //     label = String("Lot No:"+feature.properties.lot_no)
  //     return L.circleMarker(latlng, {
  //       radius: 5,
  //       fillColor: '#E20000',
  //       fillOpacity: 1,
  //       color: '#E20000',
  //       weight: 1,
  //       title: '',
  //       riseOnHover: true
  //     }).bindLabel(label)
  //   },
  //   onEachFeature: function (feature, layer) {
  //     if (feature.properties) {

  map.off('click');
  map.on('click', function(e) {
    //map.off('click');
    // Build the URL for a GetFeatureInfo
    var url = getFeatureInfoUrl(
        map,
        inpoi,
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



        var content = "<table class='table table-striped table-bordered table-condensed'>" +
            "<tr><th>Id</th><td>" + "<input type='text' class='form-control' value="+data.features[0].properties.id+" id='id1' name='id1' readonly/>" + "</td></tr>" +

            "<tr><th>Business Type</th><td>"+

            "<select name='bt1'  class='form-control' id='bt1' >"+
            "<option  value='"+data.features[0].properties.business_type+"'>"+data.features[0].properties.business_type+"</option>"+
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
            "<tr><th>Poi Name</th><td>" + "<input type='text' class='form-control' value='' id='poi_name1' name='poi_name1'/>" + "</td></tr>" +
            "<tr><th>Branch Poi Name</th><td>"+ "<input type='checkbox' onclick='combineName1()'  id='pc1' name='pc'>"+ "</td></tr>" +
            "<tr><th>Residential Poi Name</th><td>"+ "<input type='checkbox' onclick='combineNameR1()'  id='pcr1' name='pcr1'>"+ "</td></tr>" +
            "<tr><th>Alternative Name</th><td>" + "<input type='text' class='form-control' value='"+data.features[0].properties.alternative_name.replace("'","\'")+"' id='an1' name='an1'/>" + "</td></tr>" +
            "<tr><th>Lot No</th><td>" + "<input type='text' class='form-control' id='lot_no1' value='' name='lot_no1'>"+ "</td></tr>" +
            "<tr><th>Grab Street</th><td>"+ "<input type='text' class='form-control' value='' id='gs1' name='gs1'/>"+ "</td></tr>" +
            "<tr><th>Fill Grab Street</th><td>"+'<input type="checkbox"  onclick="combineNameGS1()" id="pgs1" name="pgs1">'+ "</td></tr>" +

            "<tr><th>Street Name</th><td>"+ "<input type='text' class='form-control' value='' id='street_name1' name='street_name1'/>"+ "</td></tr>" +
            "<tr><th>Area/Building/Neighbourhood</th><td>"+ "<input type='text' class='form-control' value='' id='nh1' name='nh1'/>"+ "</td></tr>" +

            "<tr><th>Mukim</th><td>" + "<input type='text' class='form-control' value='"+data.features[0].properties.mukim+"' id='mukim1' name='mukim1'/></td><td><input type='checkbox'  onclick='combineMukim()' id='mukim_chk1' name='mukim_chk1'>" + "</td></tr>" +
            "<tr><th>Daerah</th><td>" + "<input type='text' class='form-control' value='"+data.features[0].properties.daerah+"' id='daerah1' name='daerah1'/></td><td><input type='checkbox'  onclick='combineDaerah()' id='daerah_chk1' name='daerah_chk1'>" + "</td></tr>" +

            "<tr><th>Post Code</th><td>" + "<input type='text' class='form-control' value='"+data.features[0].properties.post_code+"' id='post_code1' name='post_code1'/>" + "</td></tr>" +
            "<tr><th>City Name</th><td>"+ "<input type='text' class='form-control' value='"+data.features[0].properties.city_name+"' id='cn1' name='cn1'/>"+ "</td></tr>" +
            "<tr><th>State</th><td>" + "<input type='text' class='form-control' value='"+data.features[0].properties.state+"' id='state1' name='state1'/>" + "</td></tr>" +
            "<tr><th>XY</th><td>" + data.features[0].properties.xy + "</td></tr>" +

            '<tr><th>Image Path</th><td>'+
            '<input type="text" class="form-control" value="'+data.features[0].properties.image_path+'" id="img_path1" name="img_path1">'+
            '<button onclick="getNewPath()" class="btn btn-success">get new path</button>'+
            '</td></tr>';

            // '<tr><th>Image preview </th><td>'+
            // '<img src="'+'http://121.121.232.53:88'+img_sel_path+'" width=30px height=30px/>'+
            // '</td></tr>'+
        if(user_id=="40"||user_id=="41"||user_id=="42"){

        }else{
          content=content+"<tr><td><button class='btn btn-success' onclick='updateRec()'>update</button></td><td><button class='btn btn-danger' onclick='deleteRec()'>Delete</button></td></tr>";

        }
        content=content+"</table>";

        // layer.on({
        //   click: function (e) {
        //     $("#feature-title").html(feature.properties.id);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");

        $("#poi_name1").val(data.features[0].properties.name)
        $("#lot_no1").val(data.features[0].properties.lot_no)
        $("#street_name1").val(data.features[0].properties.street_name)
        $("#gs1").val(data.features[0].properties.grab_street)
        $("#nh1").val(data.features[0].properties.area_building_name_neighbourhood)


               highlight.clearLayers().addLayer(L.circleMarker([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]], highlightStyle));
  //
  //         }
  //       });
  //     }
  //   }
  // });
  // $.getJSON("services/plot1.php?id="+user_id, function (data) {
  //   incom.addData(JSON.parse(data[0].json_build_object));
  //   // map.addLayer(landuse);
  //   // setTimeout(function(){
  //   map.addLayer(incom);
  //   // },2000)
  // });
        activeSelectedLayerPano()
      }
    });




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
  var gs=combineNameGS1().replace(/\'/g, "''");
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
     // percentages()
     // incomplete()
      cpoi.setParams({fake: Date.now()}, false);
      inpoi.setParams({fake: Date.now()}, false);
      map.addLayer(cpoi);
      map.addLayer(inpoi);
      $('#featureModal').modal('toggle');
      highlight.clearLayers()
    }
  });
}


function deleteRec(){
  if (confirm("Press ok to delete this record or cancel to go back")) {
  var id=$("#id1").val()
  $.ajax({
    url: "services/delete.php?id="+id,
    type: "GET",
    // dataType: "json",
    // contentType: "application/json; charset=utf-8",
    success: function callback(response) {
      alert(response);
    //  percentages()
    //  incomplete()
      cpoi.setParams({fake: Date.now()}, false);
      inpoi.setParams({fake: Date.now()}, false);
      map.addLayer(cpoi);
      map.addLayer(inpoi);
      $('#featureModal').modal('toggle');
      highlight.clearLayers()
    }
  });
  } else {
    //txt = "You pressed Cancel!";
  }
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
  maxZoom: 21,
  subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

customer = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:pano_layer',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
customer.addTo(map);


dist_boundary = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:district boundary',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
dist_boundary.addTo(map);


state = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:state_boundary',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
state.addTo(map);

postcode = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:poscode_boundary',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
//postcode.addTo(map);

cpoi = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:poi_data1',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
cpoi.addTo(map);

locality = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:locality_boundary',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  transparent: true
}, {buffer: 10});

mukim_daerah = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:sempadan_mukim',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
//cpoi.addTo(map);
inpoi = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:incomplete_data',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
//inpoi.addTo(map);

g_10 = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:grid_10',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
//g_10.addTo(map);
// grab_customer = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
//   layers: 'GRAB:grab_customer',
//   format: 'image/png',
//   maxZoom: 21,
//   zIndex: 10,
//   transparent: true
// }, {buffer: 10});
// grab_customer.addTo(map)

cd = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:customer_data',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  cursor:'pointer',
  transparent: true
}, {buffer: 10});
if(user_id!="40"&&user_id!="41"&&user_id!="42") {
  cd.addTo(map);
}

inc_boundary = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/GRAB/wms", {
  layers: 'GRAB:incomplete_boundary',
  format: 'image/png',
  maxZoom: 21,
  zIndex: 10,
  transparent: true
}, {buffer: 10});
//inc_boundary.addTo(map);



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

  var groupedOverlays='';
  if(user_id=="40"||user_id=="41"||user_id=="42"){
    groupedOverlays = {
      "Points of Interest": {
        //"Area B Violations All": theaterLayer,
        "Pano Layer": customer,
        // "Complete":percent,
        // "Incomplete":incom,
        "District Boundary": dist_boundary,
        "State Boundary": state,
        "Mukim Boundary": mukim_daerah,
        "Locality Boundary": locality,
       // "Postcode Boundary": postcode,
        // "Customers":grab_customer,
        //"Address": cd,
        // ,
        "complete poi": cpoi,
       // "incomplete poi": inpoi,
        "Grid 10X10": g_10


        // "<img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums": museumLayer
      },
      //,
      "Reference": {}
    };
  }else {
    groupedOverlays = {
      "Points of Interest": {
        //"Area B Violations All": theaterLayer,
        "Pano Layer": customer,
        // "Complete":percent,
        // "Incomplete":incom,
        "District Boundary": dist_boundary,
        "State Boundary": state,
        "Mukim Boundary": mukim_daerah,
        "Locality Boundary": locality,
        "Postcode Boundary": postcode,
        // "Customers":grab_customer,
        "Address": cd,
        // ,
        "complete poi": cpoi,
       // "incomplete poi": inpoi,
       // "Incomplete_boundary":inc_boundary,
        "Grid 10X10": g_10



        // "<img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums": museumLayer
      },
      //,
      "Reference": {}
    };
  }
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
       var locallity='';
        var mukim='';
        var daerah='';
        if(response.street==false){
          col_street=null
        }else{
          col_street=response.street[0].street;
        }

        if(response.locality==false) {
          locallity='';
        }else{
          locallity=response.locality[0].name;
        }

        if(response.mukdae==false) {
          mukim='';
          daerah='';
        }else{
          mukim=response.mukdae[0].mukim;
          daerah=response.mukdae[0].daerah;
        }



    var tbl= '<form action="">'+
        '<div class="form-group" style="height: 400px;overflow-y: scroll;">'+

        '<div class="form-group">'+
        '<select name="bt" class="form-control" id="bt" >'+
        '<option selected value="">Select business type</option>'+
        '<option value="HealthCare" >Healthcare</option>'+
        '<option value="Education">Education</option>'+
        '<option value="Temple">Temple</option>'+
        '<option value="Residential"  selected="selected">Residential</option>'+
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
        '<label for="img" >POI Name :</label>'+
        '<input type="text" class="form-control" id="poi_name" name="poi_name">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Residential POI Name :</label>'+
        '<input type="checkbox"  onclick="combineNameR()" id="pcr" name="pcr">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Branch POI Name:</label>'+
        '<input type="checkbox" onclick="combineName()"  id="pc" name="pc">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Apartment:</label>'+
        '<input type="checkbox"  id="apartment" name="apartment">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Alternative Name :</label>'+
        '<input type="text" class="form-control" id="an" name="an">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Lot No :</label>'+
        '<input type="text" class="form-control"  id="lot_no" name="lot_no">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Grab Street:</label>'+
        '<input type="text" class="form-control" value="" id="gs" name="gs">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Fill Grab Street:</label>'+
        '<input type="checkbox"  onclick="combineNameGS()" id="pgs" name="pgs">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Street Name  :</label>'+
        '<input type="text" class="form-control" value="'+col_street+'" id="st_name" name="st_name">'+
        '</div>'+


        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Area/Building Name/Neighbourhood  :</label>'+
        '<input type="text" class="form-control" value="'+locallity+'" id="nh" name="nh">'+
        '</div>'+




        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Mukim  :<input type="checkbox"  onclick="combineMukim()" id="mukim_chk" name="mukim_chk" checked></label>'+
        '<input type="text" class="form-control" value="'+mukim+'" id="mukim" name="mukim">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Daerah  :<input type="checkbox"  onclick="combineDaerah()" id="daerah_chk" name="daerah_chk"></label>'+
        '<input type="text" class="form-control" value="'+daerah+'" id="daerah" name="daerah">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >Postcode:</label>'+
        '<input type="text" value="'+response.postcode[0].postcode+'" class="form-control" id="p_code" name="p_code">'+
        '</div>'+

        '<div class="form-group" style="width: 280px;">'+
        '<label for="img" >City Name :</label>'+
        '<input type="text" value="Klang Valley" class="form-control" id="cn" name="cn" readonly>'+
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
        '<a href="'+'http://121.121.232.54:88'+img_sel_path+'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="'+'http://121.121.232.54:88'+img_sel_path+'" width=30px height=30px/></a>'+
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
 // percentages();
  //incomplete();
  if(user_id=='2'||user_id=='22'||user_id=='23'||user_id=='26'){
    $('#ex').show();
    //$('#pie_chart').show()

  }

  if(user_id=='40'||user_id=='41'||user_id=='42'){
    $('#drp').hide();
    $('#dnp').hide();
    $('#asc').hide();
  }else{
    $('#drp').show();
    $('#dnp').show();
    $('#asc').show();
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

    //  pieChart(data);

    }
  });

})




function combineName(){
  if($('#pc').is(':checked')){
    var comb=$("#poi_name").val()+' - '+$("#st_name").val();
    oldValuePc=$("#poi_name").val()
    $("#poi_name").val(comb)
  }else{
    $("#poi_name").val(oldValuePc)
  }
}

function combineNameR(){
  if($('#pcr').is(':checked')){
    var comb=$("#lot_no").val()+','+$("#poi_name").val()+' '+$("#st_name").val()+', '+$("#nh").val();
    oldValuePcr=$("#poi_name").val()
    $("#poi_name").val(comb)
  }else{
    $("#poi_name").val(oldValuePcr)
  }
}

function combineNameGS(){
  if($('#pgs').is(':checked')) {
    if ($('#mukim_chk').is(':checked')) {
      var comb = $("#st_name").val() + ', ' + $("#nh").val() + ', ' + $("#mukim").val();
      $("#gs").val(comb)
    } else if ($('#daerah_chk').is(':checked')) {
      var comb = $("#st_name").val() + ', ' + $("#nh").val() + ', ' + $("#daerah").val();
      $("#gs").val(comb)
    }
  }else{
    $("#gs").val('')
  }

}



function combineName1(){
  if($('#pc1').is(':checked')){
    var comb=$("#poi_name1").val()+' - '+$("#street_name1").val();
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
  if($('#pgs1').is(':checked')) {
    if ($('#mukim_chk1').is(':checked')) {
      var comb = $("#street_name1").val() + ', ' + $("#nh1").val() + ', ' + $("#mukim1").val();
      $("#gs1").val(comb)
    } else if ($('#daerah_chk1').is(':checked')) {
      var comb = $("#street_name1").val() + ', ' + $("#nh1").val() + ', ' + $("#daerah1").val();
      $("#gs1").val(comb)
    }
    return comb
  }else{
    $("#gs1").val('')
  }
}



function combineName3(){
  if($('#pc3').is(':checked')){
    if($('#street_chk4').is(':checked')){
      var comb = $("#poi_name3").val() + ' - ' + $("#st_name4").val();
      oldValuePc = $("#poi_name3").val()
      $("#poi_name3").val(comb)
    }else {
      var comb = $("#poi_name3").val() + ' - ' + $("#st_name3").val();
      oldValuePc = $("#poi_name3").val()
      $("#poi_name3").val(comb)
    }
  }else{
    $("#poi_name3").val(oldValuePc)
  }
}

function combineNameR3(){
  if($('#pcr3').is(':checked')){
    if($('#street_chk4').is(':checked')){
      var comb = $("#lot_no3").val() + ', ' + $("#poi_name3").val() + ' ' + $("#st_name4").val() + ', ' + $("#nh3").val();
      oldValuePcr = $("#poi_name3").val()
      $("#poi_name3").val(comb);
    }else {
      var comb = $("#lot_no3").val() + ', ' + $("#poi_name3").val() + ' ' + $("#st_name3").val() + ', ' + $("#nh3").val();
      oldValuePcr = $("#poi_name3").val()
      $("#poi_name3").val(comb);
    }
  }else{
    $("#poi_name3").val(oldValuePcr)
  }
}

function combineNameGS3(){
  if($('#pgs3').is(':checked')) {
    if($('#mukim_chk4').is(':checked')&&$('#street_chk4').is(':checked')){
      var comb = $("#st_name4").val() + ', ' + $("#nh3").val() + ', ' + $("#district3").val();
      $("#gs3").val(comb)
      //$("#gs3").val(comb)
    }else if($('#mukim_chk4').is(':checked')){
      var comb = $("#st_name3").val() + ', ' + $("#nh3").val() + ', ' + $("#district3").val();
      $("#gs3").val(comb)
    }else {
      if ($('#mukim_chk3').is(':checked')&&$('#street_chk4').is(':checked')) {
        var comb = $("#st_name4").val() + ', ' + $("#nh3").val() + ', ' + $("#mukim3").val();
        $("#gs3").val(comb)
        //$("#gs3").val(comb)
      }else if($('#mukim_chk3').is(':checked')){
        var comb = $("#st_name3").val() + ', ' + $("#nh3").val() + ', ' + $("#mukim3").val();
        $("#gs3").val(comb)
      } else if ($('#daerah_chk3').is(':checked')) {
        var comb = $("#st_name3").val() + ', ' + $("#nh3").val() + ', ' + $("#daerah3").val();
        $("#gs3").val(comb)
      }
    }
  }else{
    $("#gs3").val('')
  }

}



function savedataCustomer(){
  combineNameGS3();
  var poi=encodeURIComponent($("#poi_name3").val().replace(/\'/g, "''"))
  var bt=encodeURIComponent($("#bt3").val().replace(/\'/g, "''"))
  var lot_no=encodeURIComponent($("#lot_no3").val().replace(/\'/g, "''"))
  var st_name=($('#street_chk4').is(':checked'))?encodeURIComponent($("#st_name4").val().replace(/\'/g, "''")):encodeURIComponent($("#st_name3").val().replace(/\'/g, "''"))
  var p_code=encodeURIComponent($("#p_code3").val().replace(/\'/g, "''"))
  var state=encodeURIComponent($("#state3").val().replace(/\'/g, "''"))
  var coor=$("#coor3").val().replace(/\'/g, "''")
  var cn=encodeURIComponent($("#cn3").val().replace(/\'/g, "''"))
  var nh=encodeURIComponent($("#nh3").val().replace(/\'/g, "''"))
  var gs=$("#gs3").val()
  var an=$("#an3").val()

  var mukim=$("#mukim3").val()

  var daerah=$("#daerah3").val()


  var img_path=$("#img_path").val()

  if(poi==''||bt==''||st_name==''||st_name=='null'||p_code==''||state==''||coor==''){
    alert("please fill all fields")
    return false;
  }

  if(gs==''){
    alert("please fill Grab Street or click fill check box")
    return false;
  }

  if($('#apartment1').is(':checked')==false) {
    if (bt == 'Residential') {
      if (lot_no == '') {
        alert("please fill lot no")
        return false;
      }
    }
  }

  var wkt='POINT('+coor.split(',')[0]+' '+coor.split(',')[1]+')'



  $.ajax({
    url: "services/saveCustomer.php?poi="+poi+'&bt='+bt+'&lot_no='+lot_no+'&st_name='+st_name+'&p_code='+p_code+'&state='+state+'&coor='+coor+'&geom='+wkt+'&cn='+cn+'&nh='+nh+'&uid='+user_id+'&img_path='+img_path+'&gs='+gs+'&an='+an+'&mukim='+mukim+'&daerah='+daerah+'&id='+selectedCustomerId,
    type: "GET",
    // dataType: "json",
    // contentType: "application/json; charset=utf-8",
    success: function callback(response) {
      alert(response);
      removemarker()
    //  percentages()
    //  incomplete()
      map.removeLayer(cd);
      cd.setParams({fake: Date.now()}, false);
      map.addLayer(cd);
      map.removeLayer(cpoi);
      map.removeLayer(inpoi);
      cpoi.setParams({fake: Date.now()}, false);
      inpoi.setParams({fake: Date.now()}, false);
      map.addLayer(cpoi);
      map.addLayer(inpoi);





    }
  });
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
  var gs=encodeURIComponent($("#gs").val().replace(/\'/g, "''"))
  var an=encodeURIComponent($("#an").val().replace(/\'/g, "''"))

  var mukim=encodeURIComponent($("#mukim").val().replace(/\'/g, "''"))

  var daerah=encodeURIComponent($("#daerah").val().replace(/\'/g, "''"))


  var img_path=$("#img_path").val()

  if(poi==''||bt==''||st_name==''||st_name=='null'||p_code==''||state==''||coor==''){
    alert("please fill all fields")
    return false;
  }

if(gs==''){
  alert("please fill Grab Street or click fill check box")
  return false;
}

  if($('#apartment').is(':checked')==false) {
    if (bt == 'Residential') {
      if (lot_no == '') {
        alert("please fill lot no")
        return false;
      }
    }
  }

  var wkt='POINT('+coor.split(',')[0]+' '+coor.split(',')[1]+')'



  $.ajax({
  url: "services/start.php?poi="+poi+'&bt='+bt+'&lot_no='+lot_no+'&st_name='+st_name+'&p_code='+p_code+'&state='+state+'&coor='+coor+'&geom='+wkt+'&cn='+cn+'&nh='+nh+'&uid='+user_id+'&img_path='+img_path+'&gs='+gs+'&an='+an+'&mukim='+mukim+'&daerah='+daerah,
  type: "GET",
 // dataType: "json",
 // contentType: "application/json; charset=utf-8",
  success: function callback(response) {
        alert(response);
    removemarker()
 //   percentages()
 //   incomplete()
    map.removeLayer(cpoi);
    map.removeLayer(inpoi);
    cpoi.setParams({fake: Date.now()}, false);
    inpoi.setParams({fake: Date.now()}, false);
    map.addLayer(cpoi);
    map.addLayer(inpoi);
  }
});
}

function removemarker(){
  map.removeLayer(theMarker);
  if(identifyme!=''){
    map.removeLayer(identifyme)
  }
  if(searchlayer!=''){
    map.removeLayer(searchlayer)
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

function activeSelectedCustomer() {
//alert(val)
  map.off('click');
  map.on('click', function(e) {
    //map.off('click');
    $("#wg").html('');
    // Build the URL for a GetFeatureInfo
    var url = getFeatureInfoUrl(
        map,
        grab_customer,
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

        if(data.features.length!=0){

          var str='<tr><th>Address</th><td>'+data.features[0].properties.address+'</td></tr>'+
              '<tr><th>City</th><td>'+data.features[0].properties.city+'</td></tr>'+
              '<tr><th>Post Code</th><td>'+data.features[0].properties.post_code+'</td></tr>'+
              '<tr><th>Region</th><td>'+data.features[0].properties.region+'</td></tr>'+
              '<tr><th>X</th><td>'+data.features[0].properties.x+'</td></tr>'+
              '<tr><th>Y</th><td>'+data.features[0].properties.y+'</td></tr>';
              $("#customer_details").html(str);
              console.log(data)
          if(identifyme!=''){
            map.removeLayer(identifyme)
          }
          identifyme = L.geoJson(data.features[0].geometry).addTo(map);

        }

      }
    });



    activeSelectedLayerPano();
  });
}

function activeSelectedCustomerActual(){
//alert(val)
  map.off('click');
  map.on('click', function(e) {
    //map.off('click');
    $("#wg").html('');
    // Build the URL for a GetFeatureInfo
    var url = getFeatureInfoUrl(
        map,
        cd,
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

        selectedCustomerId=data.features[0].id.split('.')[1];

        if(data.features.length!=0){

          if(identifyme!=''){
            map.removeLayer(identifyme)
          }
          console.log(data)
          var arr=[];
          arr.push(data.features[0].geometry.coordinates[1])
          arr.push(data.features[0].geometry.coordinates[0]);
          identifyme =  L.circleMarker(arr)
          map.addLayer(identifyme)
          var tbl= '<form action="">'+
              '<div class="form-group">'+

              '<div class="form-group">'+
              '<select name="bt" class="form-control" id="bt3" >'+
              '<option selected value="">Select business type</option>'+
              '<option value="HealthCare" >Healthcare</option>'+
              '<option value="Education">Education</option>'+
              '<option value="Temple">Temple</option>'+
              '<option value="Residential" selected="selected">Residential</option>'+
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
              '<label for="img" >POI Name :</label>'+
              '<input type="text" class="form-control" id="poi_name3" name="poi_name">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Residential POI Name :</label>'+
              '<input type="checkbox"  onclick="combineNameR3()" id="pcr3" name="pcr">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Branch POI Name:</label>'+
              '<input type="checkbox" onclick="combineName3()"  id="pc3" name="pc">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Apartment:</label>'+
              '<input type="checkbox" onclick="combineName3()"  id="apartment1" name="apartment1">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Alternative Name :</label>'+
              '<input type="text" class="form-control" id="an3" name="an">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Lot No :</label>'+
              '<input type="text" class="form-control"  value="'+data.features[0].properties.house_no.trim()+'" id="lot_no3" name="lot_no">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Grab Street:</label>'+
              '<input type="text" class="form-control" value="" id="gs3" name="gs">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Fill Grab Street:</label>'+
              '<input type="checkbox"  onclick="combineNameGS3()" id="pgs3" name="pgs">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Street Customer  :<input type="checkbox"   id="street_chk4" name="mukim_chk" checked></label>'+
              '<input type="text" class="form-control" value="'+data.features[0].properties.street.trim()+'" id="st_name4" name="district3">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Street Name  :</label>'+
              '<input type="text" class="form-control" value="" id="st_name3" name="st_name">'+
              '</div>'+


              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Area/Building Name/Neighbourhood  :</label>'+
              '<input type="text" class="form-control" value="" id="nh3" name="nh">'+
              '</div>'+


              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >District  :<input type="checkbox"   id="mukim_chk4" name="mukim_chk" checked></label>'+
              '<input type="text" class="form-control" value="'+data.features[0].properties.district.trim()+'" id="district3" name="district3">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Mukim  :' +
              '<input type="checkbox"  onclick="combineMukim()" id="mukim_chk3" name="mukim_chk">' +
              '</label>'+
              '<input type="text" class="form-control" value="" id="mukim3" name="mukim">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Daerah  :<input type="checkbox"  onclick="combineDaerah()" id="daerah_chk" name="daerah_chk"></label>'+
              '<input type="text" class="form-control" value="" id="daerah3" name="daerah">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Postcode:</label>'+
              '<input type="text" value="" class="form-control" id="p_code3" name="p_code">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >City Name :</label>'+
              '<input type="text" value="Klang Valley" class="form-control" id="cn3" name="cn" readonly>'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >State    :</label>'+
              '<input type="text" class="form-control" value="" id="state3" name="state">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Coordinates (x/y)    :</label>'+
              '<input type="text" value="'+parseFloat(data.features[0].geometry.coordinates[0]).toFixed(6)+','+parseFloat(data.features[0].geometry.coordinates[1]).toFixed(6)+'" id="coor3" class="form-control" name="coor">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Image Path    :</label>'+
              '<input type="text" class="form-control" value="'+img_sel_path+'" id="img_path" name="img_path">'+
              '</div>'+

              '<div class="form-group" style="width: 280px;">'+
              '<label for="img" >Image preview    :</label>'+
              '<a href="'+'http://121.121.232.54:88'+img_sel_path+'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="'+'http://121.121.232.54:88'+img_sel_path+'" width=30px height=30px/></a>'+
              '</div>'+




              '</form>'+
              '<div class="row">'+
              '<button style="padding-left: 30px;" id="btnSave1" type="button" onclick="startEdit()" class="btn btn-success">Start Edit</button>'+
              '<button style="padding-left: 30px;" id="btnSave2" type="button" onclick="stopEdit()" class="btn btn-success">Stop Edit</button>'+
              '<button style="padding-left: 30px;" id="btnSave3" type="button" onclick="fillForm()" class="btn btn-success">Fill Form</button>'+
              '<button style="padding-left: 30px;" id="btnSave" type="button" onclick="savedataCustomer()" class="btn btn-success">Save</button>'+
              '</div>';


          $("#c_data_form").html(tbl);
          identifyme.on('edit', function(e) {
          //  console.log(e);
            var lat_lng=e.target._latlng.lng.toFixed(6)+','+e.target._latlng.lat.toFixed(6);
            $("#coor3").val(lat_lng);
          });

        }

      }
    });



    activeSelectedLayerPano();
  });
}

function fillForm(){
  var latlon=$("#coor3").val().split(',');
  $.ajax({
    url: "services/main.php?geom=" + latlon[0] + ' ' + latlon[1],
    type: "GET",
    // dataType: "json",
    // contentType: "application/json; charset=utf-8",
    success: function callback(response) {
     // console.log(response);
      $("#st_name3").val((response.street==false)? '':response.street[0].street);
      $("#nh3").val((response.locality==false)?'':response.locality[0].name);
      $("#p_code3").val((response.postcode==false)?'':response.postcode[0].postcode);
      $("#state3").val((response.state==false)?'':response.state[0].nam);
      $("#mukim3").val((response.mukdae==false)?'':response.mukdae[0].mukim);
      $("#daerah3").val((response.mukdae==false)?'':response.mukdae[0].daerah);




    }
  });
}

function startEdit(){
  identifyme.editing.enable()
}
function stopEdit(){
  identifyme.editing.disable()
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
  var status=''
  var inc='';
 if($('#export_xls').is(':checked'))
  {
    status='yes';
  }else{
   status='no'
 }
  if($('#export_xls1').is(':checked'))
  {
    inc='yes';
  }else{
    inc='no'
  }

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
    $("#ancr").html('<a id="anchr1" href="services/ExportExcel.php?sd='+ sd + '&ed=' + ed+'&status='+status+'&inc='+inc+'"+inc target="_blank"></a>>');
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