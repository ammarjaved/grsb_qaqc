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
        $st_name=$_REQUEST['st_name'];
         $p_code=$_REQUEST['p_code'];
         $state=$_REQUEST['state'];
         $coor=$_REQUEST['coor'];
        $wkt=$_REQUEST['geom'];
        $cn=$_REQUEST['cn'];
        $nh=$_REQUEST['nh'];
        $uid=$_REQUEST['uid'];
        $img_path=$_REQUEST['img_path'];
        $gs=$_REQUEST['gs'];
        $an=$_REQUEST['an'];
        $mukim=$_REQUEST['mukim'];
        $daerah=$_REQUEST['daerah'];







        $sql_dist="INSERT INTO public.poi_data(
         name, business_type, lot_no, street_name, post_code, state, xy, geom, area_building_name_neighbourhood, city_name, created_by,image_path,grab_street,alternative_name,mukim,daerah)
        VALUES ('".$poi."', '".$bt."', '".$lot_no."', '".$st_name."', '".$p_code."', '".$state."', '".$coor."', st_geomFromText('$wkt',4326), '".$nh."', '".$cn."','".$uid."','".$img_path."','".$gs."','".$an."','".$mukim."','".$daerah."');";



       //echo $sql_dist;
     // exit();
        $result_query_dist = pg_query($sql_dist);
        if($result_query_dist)
        {
            return "data successfully saved";
        }else{
            return "failed";
        }




        $this->closeConnection();
    }

}

$json = new Start();
echo $json->loadData();
?>