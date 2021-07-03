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
    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</head>

<body>
<nav class="navbar navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Grab Dashboard</a>
        </div>
        <div class="collapse navbar-collapse" id="myNavbar">



        </div>
    </div>
</nav>
<div class="container">
    <div   class="row">
        <div style="height: 120px;" class="well">
        <div class="col-md-3">
            <div class="card">
                <div class="btn btn-info">
                    <h5 class="card-title">Total POI</h5>
                    <p class="card-text" id="tpoi" style="text-align: center;">00</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card">
                <div class="btn btn-success">
                    <h5 class="card-title">Complete POI</h5>
                    <p class="card-text" id="cpoi" style="text-align: center;">00</p>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card">
                <div class="btn btn-danger">
                    <h5 class="card-title">Incomplete POI</h5>
                    <p class="card-text" id="inpoi" style="text-align: center;">00</p>
                </div>
            </div>
        </div>

            <div class="col-md-3">
                <div class="card">
                    <div class="btn btn-warning">
                        <h5 class="card-title">Exported Data</h5>
                        <p class="card-text" id="exp" style="text-align: center;">00</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="pie_chart" class="well"></div>
    <div  class="well">
        <div class="row" id="user_counts"></div>
    </div>

</div>






</body>
</html>
<script>
    $(document).ready(function () {
        $.ajax({
            url: "services/count.php",
            type: "GET",
            // dataType: "json",
            // contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                $("#tpoi").html(response.count[0].count);
                $("#cpoi").html(response.complete[0].count);
                $("#inpoi").html(response.incomplete[0].count);
                $("#exp").html(response.exported[0].count);
                var total_count=((parseInt(response.count[0].count))/700000)*100
                var complete=((parseInt(response.complete[0].count))/700000)*100
                var incomplete=((parseInt(response.incomplete[0].count))/700000)*100
                var remaining=((700000-(parseInt(response.count[0].count)))/700000)*100
                var exports=((700000-(parseInt(response.exported[0].count)))/700000)*100
                var data=[{
                    name: 'total poi Draw',
                    y: total_count,
                    sliced: true,
                    selected: true
                }, {
                    name: 'complete',
                    y: complete,
                    color: 'green'
                }, {
                    name: 'Incomplete',
                    y: incomplete,
                    color:'red'
                }, {
                    name: 'Remainung Count',
                    y: remaining
                }]

                  pieChart(data);

            }
        });
    })


    $(document).ready(function () {
        var str='';
        $.ajax({
            url: "services/count_user.php",
            type: "GET",
            // dataType: "json",
            // contentType: "application/json; charset=utf-8",
            success: function callback(response) {
             //   console.log(response)
                for(var i=0;i<response.length;i++){
                // for(var k in response[i]){
                //     console.log('key is'+k+'valuis'+response[i][k])
                // }
                str=str+'<div class="col-md-2" style="padding-top: 20px;">'+
                       ' <div class="card">'+
                       ' <div class="btn btn-info">'+
                       ' <h5 class="card-title">'+response[i].user_name+'</h5>'+
                   ' <p class="card-text" id="tpoi" style="text-align: center;">'+response[i].count+'</p>'+
                       ' </div>'+
                        '</div>'+
                        '</div>';
                }
                $('#user_counts').html(str);
            }
        });
    })

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
</script>