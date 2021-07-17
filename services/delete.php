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


        $id=$_REQUEST['id'];
//        $st_name=$_REQUEST['st_name'];
//         $p_code=$_REQUEST['p_code'];
//         $state=$_REQUEST['state'];
//         $coor=$_REQUEST['coor'];
//        $wkt=$_REQUEST['geom'];





        $sql_dist="delete from qaqc.poi_data1 where id='$id'";

       // echo $sql_dist;
        $result_query_dist = pg_query($sql_dist);
        if($result_query_dist)
        {
            return "data successfully Deleted";
        }else{
            return "failed";
        }




        $this->closeConnection();
    }

}

$json = new Start();
echo $json->loadData();
?>