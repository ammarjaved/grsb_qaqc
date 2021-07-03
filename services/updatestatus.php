<?php
session_start();
include("connection.php");
class GetAllData extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }
    public function loadData()
    {

        $geom=$_GET['geom'];
        $status=$_GET['status'];

        if($status==0){
            $sql = "update qaqc.poi_data1 set qaqc_status=0  where st_intersects(geom,st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326))";
        }else {
            $sql = "update qaqc.poi_data1 set qaqc_status=1  where st_intersects(geom,st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326))";
        }
        $output ='';

        $result_query = pg_query($sql);
        if($result_query)
        {
           // $output = pg_fetch_all($result_query);
            $output= 'success';
        }else{
            $output= 'failed';
        }


        $this->closeConnection();
        return $output;
    }

}

$json = new GetAllData();
echo $json->loadData();
?>