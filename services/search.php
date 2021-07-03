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

        $sql = "select name as title from qaqc.poi_data1 where name LIKE '%{$key}%' limit 5";

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