//copy-paste inside onload if required and call after check for pdf,gif etc
function normaliseURL(url) {
if (url.startsWith('https')) {
	url = url.replace('https', 'http');
				  }
if (response[i][1].indexOf(':80') > (-1)) {
	url = response[i][1].replace(':80', '');
}
url = url.replace(/www0|www1|www2|www3/gi, 'www');
if (url.indexOf('://www') == (-1)) {
	url = "http://www." + url.substring(7);
}
var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
var n = 0;
while (format.test(url.charAt(url.length - 1))) {
	n++;
	url = url.substring(0, url.length - 1);
}
if (url.charAt(url.length - 1) != '/') {
	if (url.charAt(url.length - 2) != '/') {
		url = url + '/';
	} else {
		url = url.substring(0, url.length - 1);
	}
}
if (url.includes('%0a')) {
	url.replace('%0a', '');
}
if (url.slice(-2) == '//') {
	url = url.substring(0, url.length - 1);
}
if (url.includes(',')) {
	url = url.replace(/,/g, '');
}
return url;
}
GlobYear = 0;
/**
if (document.getElementById('myModal').getAttribute('count') == 1) {
	var animate = document.createElement('img');
	var fullURL = chrome.runtime.getURL('images/logo-animate.svg');
	animate.setAttribute('src', fullURL);
	animate.setAttribute('id', 'animated-logo');
	document.getElementById('chart').appendChild(animate);
}
**/
chrome.runtime.sendMessage({ message: 'sendurlforrt' });
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.RTurl != "") {
		var url = message.RTurl;
		if (url.includes('https')) {
			url = url.replace('https://', '');
		} else {
			url = url.replace('http://', '');
		}

    var target = document.getElementById('myModal');
    console.log(target);
    RadialTree(target, {url: url});
    console.log("telos");
    return;

		var pos = url.indexOf('/');
		if (pos != -1) url = url.substring(0, pos);
		var base_url = url;
		var xhr = new XMLHttpRequest();
		//xhr.open("GET", "https://web.archive.org/cdx/search/cdx?url=" + url + "/&fl=timestamp,original,urlkey&matchType=prefix&filter=statuscode:200&filter=mimetype:text/html&output=json", true);
        xhr.open("GET", "https://web.archive.org/web/timemap/json?url="+url+"/&fl=timestamp:4,original,urlkey&matchType=prefix&filter=statuscode:200&filter=mimetype:text/html&collapse=urlkey&collapse=timestamp:4", true);
		xhr.onerror = function() {
			var animateSvg = document.getElementById('animated-logo');
			document.getElementById('chart').removeChild(animateSvg);
			alert("An error occured. Please refresh the page and try again");
		};
		xhr.ontimeout = function() {
			var animateSvg = document.getElementById('animated-logo');
			document.getElementById('chart').removeChild(animateSvg);
			alert("Time out. Please refresh the page and try again");
		}
		xhr.onload = function() {
			var response = JSON.parse(xhr.responseText);
			if (response.length > 0) {
                var year_arr = new Array();
				var j = 0;
				for (var i = 1; i < response.length; i++) {
                    if(response[i][1].match(/jpg|pdf|png|form|gif/)){
                        continue;   
                    }
					var urlkey = response[i][2];
					var urlkey_arr = urlkey.split(',');
					var domain = "";
					for (var k = 0; k < urlkey_arr.length - 1; k++) {
						if (k == 0) domain = urlkey_arr[0];
						else domain = urlkey_arr[k] + '.' + domain;
					}
					if (urlkey_arr[urlkey_arr.length - 1].indexOf('/') == urlkey_arr[urlkey_arr.length - 1].length - 1) {
						var url = urlkey_arr[urlkey_arr.length - 1].replace(")/", '.' + domain + '/');
						url = "http://www." + url;
					} else {
						var url = urlkey_arr[urlkey_arr.length - 1].replace(")/", '.' + domain + '/');
						url = "http://www." + url + '/';
					}
                    response[i][1] = url;
					if (i == 1) {
                        year_arr[0]= new Array();
                        year_arr[0].push(response[1][1]);
                        year_arr[0].push(response[1][0]);
                    } else if (response[i - 1][1] == response[i][1]) {
                        year_arr[j].push(response[i][0]);
					} else {
						j++;
                        year_arr[j]= new Array();
                        year_arr[j].push(response[i][1]);
                        year_arr[j].push(response[i][0]);
					}
				}
				var years = new Array();
				for (var i = 1; i < year_arr[0].length; i++) {
					years[i - 1] = new Array();
					years[i - 1].push(year_arr[0][i]);
				}
                for (var i = 0; i < year_arr.length; i++) {
					var url = year_arr[i][0];
					for (var j = 1; j < year_arr[i].length; j++) {
						var date = year_arr[i][j];
						var k = 0;
						if (years[k] != undefined) {
							while (years[k] != undefined && years[k][0] != date) {
								k++;
							}
							if (years[k] != undefined) {
								years[k].push(url);
							}
						}
					}
				}
				for (var i = 0; i < years.length; i++) {
					for (var j = 1; j < years[i].length; j++) {
						var url;
						if (years[i][j].includes('http')) {
							url = years[i][j].substring(7);
						} else if (years[i][j].includes('https')) {
							url = years[i][j].substring(8);
						}
						url = url.slice(0, -1);
						if (url.includes('//')) {
							url = url.split('//').join('/');
						}
						url = url.split('/').join('/');
						years[i][j] = url;
					}
				}
				var all_years = [];
				for (var i = 0; i < years.length; i++) {
					if (years[i].length > 1) {
						all_years.push(years[i][0]);
					}
				}
				if (document.getElementById('myModal').getAttribute('count') == 1) {
					var animateSvg = document.getElementById('animated-logo');
					document.getElementById('chart').removeChild(animateSvg);
                    document.getElementById('sequence').style.backgroundColor="black";
				}

				function make_new_text(n) {
					var text = "";
					var x = 2;
					if (years[n].length == 2) {
						x = 1;
					}
					for (var i = x; i < years[n].length; i++) {
						if (i != (years[n].length - 1)) {
							text = text + years[n][i] + " ,1" + "\n";
						} else {
							text = text + years[n][i] + " ,1";
						}
					}
					return text;
				}
				var divBtn = document.getElementById('divBtn');
				if (document.getElementsByClassName('yearbtn').length == 0) {
					for (var i = 0; i < all_years.length; i++) {
						var btn = document.createElement('button');
						btn.setAttribute('class', 'yearbtn');
						btn.setAttribute('id', all_years[i]);
						btn.innerHTML = all_years[i];
						btn.onclick = highlightBtn;
						divBtn.appendChild(btn);
					}
				}

				function highlightBtn(eventObj) {
					var target = eventObj.target;
					if (document.getElementsByClassName('activebtn').length != 0) {
						document.getElementsByClassName('activebtn')[0].classList.remove('activebtn');
					}
					target.classList.add('activebtn');
					GlobYear = target.id;
					var num = all_years.indexOf(target.id);
					var text = make_new_text(num);
					make_chart(text);
				}
				var btns = document.getElementsByClassName('yearbtn');
				if (document.getElementsByClassName('activebtn').length != 0) {
					var actId = document.getElementsByClassName('activebtn')[0].id;
					var index = all_years.indexOf(actId);
					GlobYear = actId;
					var text = make_new_text(index);
					make_chart(text);
				} else {
					if (btns.length >= 2) {
						btns[btns.length - 2].classList.add('activebtn');
						var text = make_new_text(btns.length - 2);
					} else {
						btns[0].classList.add('activebtn');
						var text = make_new_text(0);
					}
					GlobYear = document.getElementsByClassName('activebtn')[0].id;
					make_chart(text);
				}

				function make_chart(text) {
					// Dimensions of sunburst.
					document.getElementById('sequence').innerHTML = "";
					document.getElementById('chart').innerHTML = "";
					document.getElementById('message').innerHTML = "";
					var width = window.innerWidth - 150;
					var height = window.innerHeight - 150;
					var radius = Math.min(width, height) / 2;
					// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
					var b = {
						w: 100,
						h: 30,
						s: 3,
						t: 10
					};
					var colors = d3.scaleOrdinal(d3.schemeCategory20b);
					// Total size of all segments; we set this later, after loading the data.
					var totalSize = 0;
					var vis = d3.select("#chart").append("svg:svg").attr("width", width).attr("height", height).append("svg:g").attr("id", "container").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
					var partition = d3.partition().size([2 * Math.PI, radius * radius]);
					var arc = d3.arc().startAngle(function(d) { return d.x0; }).endAngle(function(d) { return d.x1; }).innerRadius(function(d) { return Math.sqrt(d.y0); }).outerRadius(function(d) { return Math.sqrt(d.y1); });
					// Use d3.text and d3.csvParseRows so that we do not need to have a header
					// row, and can receive the csv as an array of arrays.
					var csv = d3.csvParseRows(text);
					var json = buildHierarchy(csv);
					createVisualization(json);
					// Main function to draw and set up the visualization, once we have the data.
					function createVisualization(json) {
						// Bounding circle underneath the sunburst, to make it easier to detect
						// when the mouse leaves the parent g.
						vis.append("svg:circle").attr("r", radius).style("opacity", 0);
						// Turn the data into a d3 hierarchy and calculate the sums.
						var root = d3.hierarchy(json).sum(function(d) { return d.size; }).sort(function(a, b) { return b.value - a.value; });
						// For efficiency, filter nodes to keep only those large enough to see.
						var nodes = partition(root).descendants()
						var path = vis.data([json]).selectAll("path").data(nodes).enter().append("svg:path").attr("display", function(d) { return d.depth ? null : "none"; }).attr("d", arc).attr("fill-rule", "evenodd").style("fill", function(d) {
							if (d.data.name == 'end') { return '#000000'; } else {
								return colors((d.children ? d : d.parent).data.name);
							}
						}).style("opacity", 1).style("cursor", 'pointer').on("mouseover", mouseover).on("click", openTheUrl);
						// Add the mouseleave handler to the bounding circle.
						d3.select("#container").on("mouseleave", mouseleave);
						// Get total size of the tree = value of root node from partition.
						totalSize = path.datum().value;
					};

					function openTheUrl(d) {
						var year = GlobYear;
						var anc = d.ancestors().reverse();
						var url = "";
						for (var i = 1; i < anc.length; i++) {
							if (anc[i].data.name == 'end') {
								break;
							}
							url = url + '/' + anc[i].data.name;
						}
						var wb_url = "https://web.archive.org/web/" + year + "0630";
						chrome.runtime.sendMessage({ message: 'openurl', wayback_url: wb_url, page_url: url });
					}
					// Fade all but the current sequence, and show it in the breadcrumb trail.
					function mouseover(d) {
						var sequenceArray = d.ancestors().reverse();
						sequenceArray.shift(); // remove root node from the array
						updateBreadcrumbs(sequenceArray);
						// Fade all the segments.
						d3.selectAll("path").style("opacity", 0.3);
						// Then highlight only those that are an ancestor of the current segment.
						vis.selectAll("path").filter(function(node) {
							return (sequenceArray.indexOf(node) >= 0);
						}).style("opacity", 1);
					}
					// Restore everything to full opacity when moving off the visualization.
					function mouseleave(d) {
						document.getElementById("sequence").innerHTML = "";
						// Deactivate all segments during transition.
						d3.selectAll("path").on("mouseover", null);
						// Transition each segment to full opacity and then reactivate it.
						d3.selectAll("path").transition().style("opacity", 1).on("end", function() {
							d3.select(this).on("mouseover", mouseover);
						});
					}
					// Update the breadcrumb trail to show the current sequence and percentage.
					function updateBreadcrumbs(nodeArray) {
						var anc_arr = nodeArray;
						// Data join; key function combines name and depth (= position in sequence).
						var trail = document.getElementById("sequence");
						var text = "";
						var symb = document.createElement('span');
						symb.setAttribute('class', 'symb');
						symb.innerHTML = "/";
						for (var i = 0; i < anc_arr.length; i++) {
							if (i == 0) {
								text = " " + anc_arr[i].data.name;
							} else {
								text = text + symb.innerHTML + anc_arr[i].data.name;
							}
						}
						trail.innerHTML = text;
						// Make the breadcrumb trail visible, if it's hidden.
					}
					// Take a 2-column CSV and transform it into a hierarchical structure suitable
					// for a partition layout. The first column is a sequence of step names, from
					// root to leaf, separated by hyphens. The second column is a count of how 
					// often that sequence occurred.
					function buildHierarchy(csv) {
						csv.sort(function(a, b) {
							return a[0].length - b[0].length || a[0].localeCompare(b[0]);
						});
						var real_urls = {};
						real_urls[base_url] = 1;
						if (base_url.slice(-1) != '/') {
							real_urls[base_url + '/'] = 1;
						}
						for (var i = 0, length = csv.length; i < length; i++) {
							var key = String(csv[i][0]).trim().replace(":80/", "/");
							real_urls[key] = 1;
							if (key.slice(-1) != '/') {
								real_urls[key + '/'] = 1;
							}
						}
						// Add DELIMITER instead of '/' for NOT real URLs.
						var DELIMITER = '|';

						function filter_real_url(url) {
							var parts = url.trim().split("/");
							var delimiter_index = [];
							for (var i = 1; i < parts.length; i++) {
								var potentialUrl = parts.slice(0, i).join("/");
								if (potentialUrl in real_urls === false && i > 0) {
									var pos = parts.slice(0, i).join('/').length;
									delimiter_index.push(pos);
								}
							}
							if (delimiter_index.length > 0) {
								var result_url = url;
								for (var j = 1; j < delimiter_index.length; j++) {
									var index = delimiter_index[j];
									result_url = result_url.substr(0, index) + DELIMITER + result_url.substr(index + 1);
								}
								return result_url;
							}
							return url;
						}
						var root = { "name": "root", "children": [] };
						for (var i = 0; i < length; i++) {
							var sequence = filter_real_url(csv[i][0]);
							var size = +csv[i][1];
							if (isNaN(size)) { // e.g. if this is a header row
								continue;
							}
							var parts = sequence.split("/");
							parts = parts.map(function(s) { return s.replace(/\|/g, '/'); });
							var currentNode = root;
							for (var j = 0; j < parts.length; j++) {
								var children = currentNode["children"];
								var nodeName = parts[j];
								var childNode;
								if (j + 1 < parts.length) {
									// Not yet at the end of the sequence; move down the tree.
									var foundChild = false;
									for (var k = 0; k < children.length; k++) {
										if (children[k]["name"] == nodeName) {
											childNode = children[k];
											foundChild = true;
											break;
										}
									}
									// If we don't already have a child node for this branch, create it.
									if (!foundChild) {
										childNode = { "name": nodeName, "children": [] };
										children.push(childNode);
									}
									currentNode = childNode;
								} else {
									// Reached the end of the sequence; create a leaf node.
									childNode = { "name": nodeName, "size": size };
									children.push(childNode);
								}
							}
						}
						return root;
					}
				}
			} else {
				var animateSvg = document.getElementById('animated-logo');
				document.getElementById('chart').removeChild(animateSvg);
				alert("No results found");
			}
		};
		xhr.send();
	}
});
