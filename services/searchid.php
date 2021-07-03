<?php
session_start();
include("connection.php");
class Divisions extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }
    public function loadData()
    {

        $key=$_GET['key'];

        $sql = "select id as title from poi_data where id=$key limit 5";

        $output = array();

        $result_query = pg_query($sql);
        if($result_query)
        {
           // $output = pg_fetch_assoc($result_query);
            while($row=pg_fetch_assoc($result_query))
            {
                $output[] = $row['title'];
            }
        }

        $this->closeConnection();
        return json_encode($output);
    }

}

$json = new Divisions();
echo $json->loadData();
?>