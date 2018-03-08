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
$url =  'https://www.alexa.com/siteinfo/'.$link;
$html = file_get_html($url); 
$array = array();
$vala = "https://traffic.alexa.com/graph?o=lt&y=t&b=ffffff&n=666666&f=999999&p=4e8cff&r=1y&t=2&z=30&c=1&h=150&w=340&u=".$link;
$array['global_graph'] = $vala;
$valb = $html->find('.metrics-data', 0)->innertext;
$array['global_rank'] = $valb; 
$tempa = $html->find('.metrics-title', 1)->innertext;
$tempa = str_get_html($tempa);
foreach($tempa->find("a") as $ht) {
   $data = $ht->innertext;
}
$tempa = $data;
$valc = $html->find('.metrics-data', 1)->innertext;
$tempb = $html->find('.countryRank',0)->innertext;
if(!empty($tempb)){
$tempb = str_get_html($tempb);
foreach($tempb->find("img") as $ht) {
   $datac = $ht->attr['src'];
}
$tempb = $datac;
}
$array['country']['name'] = $tempa;
$array['country']['rank'] = $valc; 
$array['country']['flag'] = "https://www.alexa.com/".$datac; 
$vald = str_replace("/http","http",str_replace("Rank in Country", "Rank",str_replace("Percent of Visitors","Visitors",str_replace("/topsites/countries/","http://alexa.com/topsites/countries/",str_replace("images/flags","http://alexa.com/images/flags",$html->find('#demographics_div_country_table', 0)->innertext)))));
$array['demographics_country_table'] = "<table class='table global_stats' width='100%'>".$vald."</table>"; 
$vale = $html->find('#engagement-content', 0)->innertext;
$array['engage_content'] = $vale; 
$valf = "https://traffic.alexa.com/graph?o=lt&y=q&b=ffffff&n=666666&f=999999&p=4e8cff&r=1y&t=2&z=0&c=1&h=150&w=340&u=".$link;
$array['search_graph'] = $valf;
$valg = $html->find('.sitemetrics-col', 0)->innertext;
$array['search_data'] = $valg; 
$valh = $html->find('#keywords_top_keywords_table', 0)->innertext;
$array['top_search_keywords'] = str_replace("Percent of Search Traffic","Traffic","<table class='table global_stats' width='100%'>".$valh."</table>"); 
$vali = $html->find('#keywords_upstream_site_table', 0)->innertext;
$array['upstream_sites'] = "<table class='upstream_sites table'>".str_replace("Percent of Unique Visits","Percent",$vali)."</table>"; 
$valj = $html->find('.box1-med3', 0)->innertext;
$array['count_linkin_sites'] = $valj; 
$valk = $html->find('#linksin_table', 0)->innertext;
$array['linkin_sites'] = "<table class='table'>".str_replace("Page","",$valk)."</table>"; 
$valm = $html->find('#audience_overlap_table', 0)->innertext;
$array['similar_sites'] = "<table class='similar_sites table'>".str_replace("Percent of Unique Visits","Percent",$valm)."</table>";  
$valn = $html->find('#subdomain_table', 0)->innertext;
$array['subdomains'] = "<table class='subdo_table'>".str_replace("<td","<td width='100px'",str_replace("Percent of Visitors","Visitors",$valn))."</table><Br>"; 
$valo = $html->find('#loadspeed-panel-content', 0)->innertext;
$array['load_speed'] = $valo;  
echo json_encode($array, JSON_PRETTY_PRINT);
?>
