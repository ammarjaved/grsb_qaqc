<?php
// Reading shape file

// Register autoloader
require_once('php-shapefile/src/Shapefile/ShapefileAutoloader.php');
Shapefile\ShapefileAutoloader::register();

// Import classes
use Shapefile\Shapefile;
use Shapefile\ShapefileException;
use Shapefile\ShapefileReader;

echo "<pre>";
 // echo "Lib Start<br>";
try {
    // Open Shapefile
    $Shapefile = new ShapefileReader('shapefile/sindh_na_boundaries.shp');
    // Get Shape Type
    echo "Shape Type : ";
    echo $Shapefile->getShapeType() . " - " . $Shapefile->getShapeType(Shapefile::FORMAT_STR);
    echo "\n\n";
    
    // Get number of Records
    echo "Records : ";
    print_r($Shapefile->getTotRecords());
    echo "\n\n";
    
    // Get Bounding Box
    echo "Bounding Box : ";
    print_r($Shapefile->getBoundingBox());
    echo "\n\n";
    
    // Get PRJ
    echo "PRJ : ";
    print_r($Shapefile->getPRJ());
    echo "\n\n";
    
    // Get Charset
    echo "Charset : ";
    print_r($Shapefile->getCharset());
    echo "\n\n";
    
    // Get DBF Fields
    echo "DBF Fields : ";
    print_r($Shapefile->getFields());
    echo "\n\n";
    
} catch (ShapefileException $e) {
    // Print detailed error information
    echo "Error Type: " . $e->getErrorType()
        . "\nMessage: " . $e->getMessage()
        . "\nDetails: " . $e->getDetails();
        
}
echo "</pre>";
?>