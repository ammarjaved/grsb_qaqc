<?php
session_start();
include("connection.php");
class Start extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }
    public function loadData()
    {


       $poi=$_REQUEST['poi'];
        $bt=$_REQUEST['bt'];
        $lot_no=$_REQUEST['lot_no'];
        $id=$_REQUEST['id'];
        $st_name=$_REQUEST['st_name'];
         $p_code=$_REQUEST['p_code'];
         $state=$_REQUEST['state'];
        $cn=$_REQUEST['cn'];
        $nh=$_REQUEST['nh'];
        $uid=$_REQUEST['uid'];
        $an=$_REQUEST['an'];
        $img_path=$_REQUEST['img_path'];
        $gs=$_REQUEST['gs'];
        $geom=$_REQUEST['geom'];
//         $coor=$_REQUEST['coor'];
//        $wkt=$_REQUEST['geom'];




        if(geom=='1') {
            $sql_dist = "UPDATE qaqc.poi_data1 SET  name='$poi', business_type='$bt', lot_no='$lot_no',street_name='$st_name', post_code='$p_code', state='$state', area_building_name_neighbourhood='$nh', city_name='$cn',alternative_name='$an',image_path='$img_path',grab_street='$gs' WHERE id='$id';";
        }else{
            $sql_dist = "UPDATE qaqc.poi_data1 SET  name='$poi', business_type='$bt', lot_no='$lot_no',street_name='$st_name', post_code='$p_code', state='$state', area_building_name_neighbourhood='$nh', city_name='$cn',alternative_name='$an',image_path='$img_path',grab_street='$gs',geom='ST_GeomFromGeoJSON('$geom')' WHERE id='$id';";

        }
       // echo $sql_dist;
        $result_query_dist = pg_query($sql_dist);
        if($result_query_dist)
        {
            return "data successfully Updated";
        }else{
            return "failed";
        }




        $this->closeConnection();
    }

}

$json = new Start();
echo $json->loadData();
?>