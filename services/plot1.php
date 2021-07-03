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

        $user_id=$_GET['id'];
        if($user_id=='23'||$user_id=='22'||$user_id=='26'){
            $sql1 = "SELECT json_build_object(
    'type', 'FeatureCollection',
    'crs',  json_build_object(
        'type',      'name', 
        'properties', json_build_object(
            'name', 'EPSG:4326'  
        )
    ), 
    'features', json_agg(
        json_build_object(
            'type',       'Feature',
            'id',         id, -- the GeoJson spec includes an 'id' field, but it is optional, replace {id} with your id field
            'geometry',   ST_AsGeoJSON(geom)::json,
            'properties', json_build_object(
               'poi', name,
				'business_type', business_type,
				'lot_no', lot_no,
				'street_name', street_name,
				'post_code',post_code ,
				'state',state,
				'xy', xy,
				'area_building_name_neighbourhood',area_building_name_neighbourhood,
				'city_name',city_name,
				'created_by',created_by,
				'image_path',image_path,
				'grab_street',grab_street,
				'alternative_name',alternative_name,
				'mukim',mukim,
				'daerah',daerah
				
            )
        )
    )
)
FROM (
SELECT id, name, business_type, lot_no, street_name, post_code, state, xy,geom,area_building_name_neighbourhood,city_name,created_by,image_path,grab_street,alternative_name,mukim,daerah
	FROM public.poi_data) as tbl1 where name is  null or business_type is null or
                street_name is  null or  post_code is  null or state is  null or xy is null 
                or area_building_name_neighbourhood is null or city_name is null or image_path is null or
                grab_street is null or image_path='' or image_path='null'";

        }else {
            $sql1 = "SELECT json_build_object(
    'type', 'FeatureCollection',
    'crs',  json_build_object(
        'type',      'name', 
        'properties', json_build_object(
            'name', 'EPSG:4326'  
        )
    ), 
    'features', json_agg(
        json_build_object(
            'type',       'Feature',
            'id',         id, -- the GeoJson spec includes an 'id' field, but it is optional, replace {id} with your id field
            'geometry',   ST_AsGeoJSON(geom)::json,
            'properties', json_build_object(
               'poi', name,
				'business_type', business_type,
				'lot_no', lot_no,
				'street_name', street_name,
				'post_code',post_code ,
				'state',state,
				'xy', xy,
				'area_building_name_neighbourhood',area_building_name_neighbourhood,
				'city_name',city_name,
				'created_by',created_by,
				'image_path',image_path,
				'grab_street',grab_street,
				'alternative_name',alternative_name,
				'mukim',mukim,
				'daerah',daerah
				
            )
        )
    )
)
FROM (
SELECT id, name, business_type, lot_no, street_name, post_code, state, xy,geom,area_building_name_neighbourhood,city_name,created_by,image_path,grab_street,alternative_name,mukim,daerah
	FROM public.poi_data) as tbl1 where name is  null or business_type is null or
                street_name is  null or  post_code is  null or state is  null or xy is null 
                or area_building_name_neighbourhood is null or city_name is null or image_path is null or
                grab_street is null or image_path='' or image_path='null' and created_by='$user_id'";

        }
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