<?php
session_start();
$loc = 'http://' . $_SERVER['HTTP_HOST'];
if (isset($_SESSION['un1'])) {

}
else {
header("Location:" . $loc . "/grab_qaqc/login.php");
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#000000">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Grab</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css">
    <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.css">
    <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.Default.css">
    <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.43.0/L.Control.Locate.css">
    <link rel="stylesheet" href="assets/leaflet-groupedlayercontrol/leaflet.groupedlayercontrol.css">
    <link rel="stylesheet" href="assets/css/app.css">
      <link rel="stylesheet" href="lib/leaflet.label.css">


      <link rel="apple-touch-icon" sizes="76x76" href="assets/img/favicon-76.png">
    <link rel="apple-touch-icon" sizes="120x120" href="assets/img/favicon-120.png">
    <link rel="apple-touch-icon" sizes="152x152" href="assets/img/favicon-152.png">
    <link rel="icon" sizes="196x196" href="assets/img/favicon-196.png">
    <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico">
      <!-- include summernote css/js -->
      <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
    <style>
      #panorama {
        width: 400px;
        height: 400px;
      }
    </style>
      <script>

          var user_id='<?php echo $_SESSION['uid'];?>'
          //alert(user_id)
      </script>
  </head>

  <body>

    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <div class="navbar-icon-container">
            <a href="#" class="navbar-icon pull-right visible-xs" id="nav-btn"><i class="fa fa-bars fa-lg white"></i></a>
            <a href="#" class="navbar-icon pull-right visible-xs" id="sidebar-toggle-btn"><i class="fa fa-search fa-lg white"></i></a>

          </div>
<!--          <a class="navbar-brand" href="#">QAQC</a>-->
        </div>
        <div class="navbar-collapse collapse">
          <form class="navbar-form navbar-right" role="search">
            <div class="form-group has-feedback">

<!--                <span id="searchicon" class="fa fa-search form-control-feedback"></span>-->
            </div>
          </form>
          <ul class="nav navbar-nav">



          <!--  <li class="hidden-xs" id="dnp" style="display: none;"><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" onclick="drawNewPoint()">Add&nbsp;POI</a></li>
            <li class="hidden-xs" id="drp" style="display: none;"><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" onclick="removemarker()">Remove Marker</a></li>
              <li class="hidden-xs" id="ex" style="display: none;"><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" onclick="showExcelModel()">Export Excel</a></li>
-->
              <li class="navbar-brand" href="#">QAQC</li>
              <li class="hidden-xs"><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="list-btn"><i class="fa fa-list white"></i>&nbsp;&nbsp;</a></li>

              <li class="hidden-xs"><div style="padding-top: 10px;padding-left: 50px;"><spsn style="color:white;">POI Search</spsn>&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text"  id="typeahead"  name="hec" class="typeahead"/></div></li>
              <li class="hidden-xs"><button style="margin-top: 10px;margin-left: 20px"  class="btn-success" onclick="search()">Search</button></li>
              <li class="hidden-xs"><div style="padding-top: 10px;padding-left: 50px;"><spsn style="color:white;">POI Id Search</spsn>&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text"  name="hec1" id="typeahead1" class="typeahead"/></div></li>
              <li class="hidden-xs"><button style="margin-top: 10px;margin-left: 20px"  class="btn-success" onclick="searchid()">Search</button></li>
              <li class="hidden-xs"><div style="padding-top: 10px;padding-left: 50px;"><spsn style="color:white;">POI xy Search</spsn>&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text"  name="search_xy" id="search_xy" class="typeahead"/></div></li>
              <li class="hidden-xs"><button style="margin-top: 10px;margin-left: 20px"  class="btn-success" onclick="search_xy()">Search</button></li>
              <li class="hidden-xs"><a  href="services/logout.php">Logout</a></li>

          </ul>
        </div><!--/.navbar-collapse -->
      </div>
    </div>

    <div id="sidebar">
        <div class="sidebar-wrapper">
            <div class="panel panel-default" id="features">
                <div class="panel-heading">
                    <h3 class="panel-title">
                        <button type="button" class="btn btn-xs btn-default pull-right" id="sidebar-hide-btn"><i class="fa fa-chevron-left"></i></button></h3>
                    <div class="row">
                        <button class="btn btn-success" style="display: none;" id="asc" onclick="activeSelectedCustomerActual()">Activate Address</button>
                        <button class="btn btn-success" onclick="percentages()">Activate InComplete</button>
                        <button class="btn btn-success" style="padding-top:5px;margin-top: 10px;" onclick="drawRect()">update status</button>
                        <input type="checkbox" id="qlc"> check make qaqc done/uncheck undo done
                      <!--  <button class="btn btn-success" style="margin-top: 10px;" onclick="incomplete()">Activate Incomplete</button>-->
                    </div>
                </div>

                <div  style="overflow-y: scroll;height: 600px;" id="c_data_form" class="panel-body">
<!--                    <ul class="nav nav-tabs">-->
<!--                        <li class="active" onclick="activeSelectedCustomer()"><a data-toggle="tab" href="#home">Customer White</a></li>-->
<!--                        <li onclick="activeSelectedCustomerActual()"><a data-toggle="tab" href="#c_data_form">Address</a></li>-->
<!--                    </ul>-->
<!--                    <div class="row">-->
<!--                    <button class="btn btn-success" onclick="activeSelectedCustomer()">Customer Black</button>-->
<!--                    </div>-->
<!--                    <div class="tab-content">-->
<!--                    <div id="home" class="tab-pane fade ">-->
<!--                    <table style="margin-top: 30px;" class="table table-bordered">-->
<!--                        <tbody id="customer_details"></tbody>-->
<!--                    </table>-->
<!--                    </div>-->
<!--                    <div style="overflow-y: scroll;height: 500px;" id="c_data_form">-->
<!---->
<!--                    </div>-->
<!--                    </div>-->

                </div>

            </div>
        </div>
    </div>


      <div id="map" style="z-index: 1">
          <div style="z-index: 1000000;position: absolute;padding-left: 100px;"  class="row">
              <div class="col-md-4">
                  <div class="card">
                      <div class="btn btn-info">
                          <h5 class="card-title">Total POI</h5>
                          <p class="card-text" id="tpoi" style="text-align: center;">00</p>
                      </div>
                  </div>
              </div>
              <div class="col-md-4">
                  <div class="card">
                      <div class="btn btn-success">
                          <h5 class="card-title">Complete POI</h5>
                          <p class="card-text" id="cpoi" style="text-align: center;">00</p>
                      </div>
                  </div>
              </div>

              <div class="col-md-4">
                  <div class="card">
                      <div class="btn btn-danger">
                          <h5 class="card-title">Incomplete POI</h5>
                          <p class="card-text" id="inpoi" style="text-align: center;">00</p>
                      </div>
                  </div>
              </div>
          </div>
<!--          <div id="pie_chart" style="display:none;width:300px;height: 300px;background-color: white;z-index: 1000000;position: absolute;margin-top:23%;margin-left: 20px;"></div>-->
      </div>



    <div id="wg" class="windowGroup">

    </div>
    </div>
<!--    <div id="loading">-->
<!--      <div class="loading-indicator">-->
<!--        <div class="progress progress-striped active">-->
<!--          <div class="progress-bar progress-bar-info progress-bar-full"></div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->






    <div class="modal fade" id="featureModal" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" type="button" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title text-primary" id="feature-title"></h4>
          </div>
          <div class="modal-body" id="feature-info"></div>
          <!--          <div class="modal-footer">-->
          <!--            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>-->
          <!--          </div>-->
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <div class="modal fade" id="featureModal1" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div style="background-color: green" class="modal-header">
                    <button class="close" type="button" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title text-primary" style="color: white" id="feature-title">
                        Export Excel
                    </h4>
                </div>
                <div class="modal-body" id="feature-info1"></div>
                <div class="container-fluid" style="height: 200px;">
                    <div class="row">
                        <div class="col-md-1">Start date</div><div class="col-md-4"><input type="date" id="date1"></div>
                        <div class="col-md-1">End date</div><div class="col-md-4"><input type="date" id="date2"></div>
                        <div id="ancr" style="display: none;"></div>
                    </div>
                    <div class="row" style="padding-left: 10px;padding-top: 10px;">
                        <input type="checkbox" id="export_xls"> Check to export Images<br />
                        <input type="checkbox" id="export_xls1"> incomplete

                    </div>
                    <div class="row">
                        <div class="col-md-4" style="padding-top: 30px;"><button class="btn btn-success" onclick="exportExcelNow()">Export Excel</button></div>
                    </div>

                </div>

            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->



    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script src="assets/js/typeahead.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/list.js/1.1.1/list.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"></script>
    <script src="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js"></script>
    <script src="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.43.0/L.Control.Locate.min.js"></script>
    <script src="assets/leaflet-groupedlayercontrol/leaflet.groupedlayercontrol.js"></script>
    <script src="assets/js/app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
    <script src="assets/jquery.form.js"></script>
    <script src="https://unpkg.com/esri-leaflet@1.0.5"></script>

<!--    <script src="assets/leaflet_draw/src/Leaflet.draw.js"></script>-->
<!--    <script src="assets/leaflet_draw/src/Leaflet.Draw.Event.js"></script>-->
<!--    <script src="assets/leaflet_draw/src/ext/TouchEvents.js"></script>-->
<!--    <script src="assets/leaflet_draw/src/edit/handler/Edit.SimpleShape.js"></script>-->
<!--    <script src="assets/leaflet_draw/src/edit/handler/Edit.Marker.js"></script>-->
<!--    <script src="assets/leaflet_draw/src/edit/handler/Edit.CircleMarker.js"></script>-->
<!--    <script src="assets/leaflet_draw/src/edit/handler/Edit.Rectangle.js"></script>-->
    <link rel="stylesheet" href="resources/draw/leaflet.draw.css"/>
    <script src="resources/draw/leaflet.draw-custom.js"></script>



    <link rel="stylesheet" href="assets/js/window-engine.css" />
    <script src="assets/js/window-engine.js"></script>
    <link rel="stylesheet" href="lib/images_slider/css-view/lightbox.css" type="text/css" />
    <script src="lib/images_slider/js-view/lightbox-2.6.min.js"></script>
    <script src="lib/images_slider/js-view/jQueryRotate.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="lib/leaflet.label.js"></script>

  </body>
</html>
<script>
    $(document).ready(function(){
        setTimeout(function(){
            $('#typeahead').typeahead({
                name: 'hec',
                remote:'services/search.php?key=%QUERY',
                limit: 5
            });

            $('#typeahead1').typeahead({
                name: 'hec1',
                remote:'services/searchid.php?key=%QUERY',
                limit: 5
            });

        }, 3000);





    });


   // var searchlayer='null';
    function search(){
        var name=$('.typeahead').val();
        $.ajax({
            url: 'services/searchByName.php?name='+name,
            dataType: 'JSON',
            //data: data,
            method: 'GET',
            async: false,
            success: function callback(data) {
                if(searchlayer!='null'){
                    map.removeLayer(searchlayer);
                }
                var geom1=JSON.parse(data[0].geometry);
                searchlayer=L.geoJson(geom1).addTo(map);
                map.setView(new L.LatLng(geom1.coordinates[1],geom1.coordinates[0]), 18);
            }
        });

    }








    // var searchlayer='null';
    function searchid(){
        var name=$('#typeahead1').val();
        $.ajax({
            url: 'services/searchById.php?name='+name,
            dataType: 'JSON',
            //data: data,
            method: 'GET',
            async: false,
            success: function callback(data) {
                if(searchlayer!='null'){
                    map.removeLayer(searchlayer);
                }
                var geom1=JSON.parse(data[0].geometry);
                searchlayer=L.geoJson(geom1).addTo(map);
                map.setView(new L.LatLng(geom1.coordinates[1],geom1.coordinates[0]), 18);
            }
        });

    }

</script>