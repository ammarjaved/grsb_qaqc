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


        $sql1="select user_name,count(*) from(
select a.*,b.user_name from poi_data a left join tbl_users b on a.created_by::integer=b.id
) as foo group by user_name";
		


        $result_query1 = pg_query($sql1);
        if ($result_query1) {
            $output= pg_fetch_all($result_query1);
        }
		


        $this->closeConnection();
        return $output;
    }

}

$json = new Pss();
//$json->closeConnection();
// echo $json->loadData();


?>