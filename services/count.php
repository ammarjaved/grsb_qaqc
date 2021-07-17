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


        $sql1="select count (*) from qaqc.poi_data1 ";
		
		$sql2 = "SELECT count(*) FROM qaqc.poi_data1 where qaqc_status=1 ;";

        $sql3 = "SELECT count(*)
                FROM qaqc.poi_data1 where qaqc_status=0";

        $sql4="SELECT count(*)
                FROM qaqc.poi_data1 where qaqc_status='2'";


        $result_query1 = pg_query($sql1);
        if ($result_query1) {
            $output['count']= pg_fetch_all($result_query1);
        }
		
        $result_query2 = pg_query($sql2);
        if ($result_query2) {
            $output['complete']= pg_fetch_all($result_query2);
        }
        $result_query3= pg_query($sql3);
        if ($result_query3) {
            $output['incomplete']= pg_fetch_all($result_query3);
        }

        $result_query4= pg_query($sql4);
        if ($result_query4) {
            $output['exported']= pg_fetch_all($result_query4);
        }




        $this->closeConnection();
        return $output;
    }

}

$json = new Pss();
//$json->closeConnection();
// echo $json->loadData();


?>