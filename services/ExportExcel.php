<?php
ini_set('MAX_EXECUTION_TIME', '-1');
session_start();
include("connection.php");
class ExportExcel extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }
    public function loadData()
    {

        //$key=$_GET['key'];


       // $filename = "grab_data.xls"; // File Name
        $date1=$_REQUEST['sd'];
        $date2=$_REQUEST['ed'];
        $status=$_REQUEST['status'];
        $inc=$_REQUEST['inc'];
        $filename=$date1.'_'.$date2.".xls";
        if (!file_exists("../../".$date1."_".$date2)) {
            mkdir("../../" . $date1 . "_" . $date2);
        }

        header("Content-Disposition: attachment; filename=\"$filename\"");
        header("Content-Type: application/vnd.ms-excel");



        $slash_sp=',';
          if($inc=='no') {

              $sql = 'select id, name as "english name", business_type as "business type", lot_no as "house", street_name as "street", post_code as "postcode", state as "state", split_part(xy,'."'".$slash_sp."'".',1) as X,split_part(xy,'."'".$slash_sp."'".',2) as Y , 
			area_building_name_neighbourhood as "Area", city_name as "L1(City)", image_path as "Photo", grab_street as "Grab Street", alternative_name as "Alternative Name",created_by
			from poi_data where date_time::date>=' . "'" . $date1 . "'" . '::date and date_time::date<=' . "'" . $date2 . "'" . '::date and name is not null and business_type is not null  and
                street_name is not null and  post_code is not null and state is not null and xy is not null 
                and area_building_name_neighbourhood is not null and city_name is not null  and
                grab_street is not null and image_path<>' . "''" . ' and image_path is not null ;';
          }else{
              $sql = 'select a.* from (select id, name as "english name", business_type as "business type", lot_no as "house", street_name as "street", post_code as "postcode", state as "state", split_part(xy,'."'".$slash_sp."'".',1) as X,split_part(xy,'."'".$slash_sp."'".',2) as Y , 
			area_building_name_neighbourhood as "Area", city_name as "L1(City)", image_path as "Photo", grab_street as "Grab Street", alternative_name as "Alternative Name",created_by,date_time
			from poi_data where  name is  null or business_type is null or
            street_name is  null or  post_code is  null or state is  null or xy is null
            or area_building_name_neighbourhood is null or city_name is null or
            grab_street is null or image_path is not null or image_path<>' . "''" . ' or image_path=' . "'null'" . ') as a
             where a.date_time::date>=' . "'" . $date1 . "'" . '::date and a.date_time::date<=' . "'" . $date2 . "'" . '::date  and a."Photo"=\'\' or a."Photo"=\'null\' or
            a."Photo" is null;';
          }


         //echo $sql;

		  
      // exit();
        $result_query = pg_query($sql);
        $flag = false;
        while ($row = pg_fetch_assoc($result_query)) {
			

			   $path=$row["Photo"];
			  // echo $path;
			  // exit();
			   if(strlen($path)>10) {
                   $pic = explode('/', $path);
                   $size = sizeof($pic) - 1;
                   $myid=$row["id"];
                   // $row["Photo"]=$date1."_".$date2.'/'.$pic[$size];
                   $row["Photo"] = $date1 . "_" . $date2 . '/' . $myid . '.jpg';
               }else{
                   $row["Photo"]='';
               }
            if($row["created_by"]){
            $sql_status11="select user_name from tbl_users where id=". $row["created_by"]." and user_name is not null";
            $result_query11=pg_query($sql_status11);

                $row1 = pg_fetch_assoc($result_query11);
                $row["created_by"] = $row1['user_name'];
            }else{
                $row["created_by"] = '';
            }
			   
			//   echo $pic[$size];
            if($status=='yes') {
               // copy('../..' . $path, '../../'.$date1."_".$date2.'/' . $pic[$size]);
                copy('../..' . $path, '../../'.$date1."_".$date2.'/' . $row["id"].'.jpg');

                $sql_status="update poi_data set status='exported' where id=".$row["id"];
                pg_query($sql_status);
            }
           //  exit();
			
            if (!$flag) {
                // display field/column names as first row
                echo implode("\t", array_keys($row)) . "\r\n";
                $flag = true;
            }
            echo implode("\t", array_values($row)) . "\r\n";
			
        }
		
		$this->closeConnection();
    }

}

$excel = new ExportExcel();
echo $excel->loadData();
?>