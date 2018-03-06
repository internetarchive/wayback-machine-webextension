<?php
/*
* Credits
* @rohitcoder - Rohit Kumar
* Website - https://rohitcoder.cf
* Profile - https://github.com/rohitcoder
*/
header("Content-Type: application/json");
include('simple_html_dom.php');
$link = $_GET['site'];	   
$url =  'https://www.whois.com/whois/'.$link;
$html = file_get_html($url);
$array = array(); 
$vala = str_replace("/https","https",str_replace("eimg","https://www.whois.com/eimg",$html->find('.df-block', 0)->innertext));
$array['domain_info'] = $vala; 
$valb = str_replace("/https","https",str_replace("eimg","https://www.whois.com/eimg",$html->find('.df-block', 1)->innertext));
$array['registrant_contact'] = $valb; 
$valc = str_replace("/https","https",str_replace("eimg","https://www.whois.com/eimg",$html->find('.df-block', 2)->innertext));
$array['admin_contact'] = $valc;  
$vald = str_replace("/https","https",str_replace("eimg","https://www.whois.com/eimg",$html->find('.df-block', 3)->innertext));
$array['technical_contact'] = $vald;  
echo json_encode($array, JSON_PRETTY_PRINT);
?>