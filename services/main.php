<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("connection.php");


class Pss extends connection
{


    function __construct()
    {
        $this->connectionDB();

        $result = $this->get_data();
        echo json_encode($result);



    }

    public function get_data()
    {
        $output = array();


        $geometry=$_REQUEST['geom'];

        $sql1="select postcode from poscode_boundary where st_intersects(geom,st_geomfromtext('POINT($geometry)',4326))";

        $result_query1 = pg_query($sql1);
        if ($result_query1) {
            $output['postcode']= pg_fetch_all($result_query1);
        }

        $sql2="select nam from state_boundary where st_intersects(geom,st_geomfromtext('POINT($geometry)',4326))";

        $result_query2 = pg_query($sql2);
        if ($result_query2) {
            $output['state']= pg_fetch_all($result_query2);
        }

        $sql3="select  street  from road_layer where st_intersects(st_buffer(st_transform
                (st_geomfromtext('POINT($geometry)',4326),32647),100,2),st_transform(geom,32647)) and street is not null";





        $result_query3 = pg_query($sql3);
        if ($result_query3) {
            $output['street']= pg_fetch_all($result_query3);
        }

        $sql4="select name from locality_boundary where st_intersects(geom,st_geomfromtext('POINT($geometry)',4326))";

        $result_query4= pg_query($sql4);
        if ($result_query4) {
            $output['locality']= pg_fetch_all($result_query4);
        }

        $sql5="select mukim,daerah from sempadan_mukim where st_intersects(geom,st_geomfromtext('POINT($geometry)',4326))";

        $result_query5= pg_query($sql5);
        if ($result_query5) {
            $output['mukdae']= pg_fetch_all($result_query5);
        }




        $this->closeConnection();
        return $output;
    }

}

$json = new Pss();
//$json->closeConnection();
// echo $json->loadData();


?>