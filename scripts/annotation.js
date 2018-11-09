/**
 * Prepare hypothes.is URL to request API.
 */
function hypothesis_api_url(url, type) {
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
  }
  if (type === 'domain') {
    const url_obj = new URL(url);
    const query = 'uri.parts=' + url_obj.host.split('.').join('&uri.parts=')
    return 'https://hypothes.is/api/search?' + query;
  } else if (type === 'url') {
    return 'https://hypothes.is/api/search?uri=' + url;
  }
}

/**
 * Get hypothes.is data and render results.
 */
function get_annotations(type) {
  const url = getUrlByParameter('url');
  const new_url = hypothesis_api_url(url, type);
  $.getJSON(new_url, function(data) {
    const length = data.rows.length;
    if (length > 0) {
      for(let i=0; i<length; i++) {
        const rowData = data.rows[i];
        const date = rowData.created.substring(0,10);
        const source = rowData.target[0].source;
        const exactData = rowData.text;
        const user = rowData.user.substring(5, rowData.user.indexOf('@'));
        let title = '';
        if(rowData.document.title) {
          title = rowData.document.title[0];
        }
        let row = $('#row_contain-' + type);
        let item = row.clone();
        item.attr('id', 'row-' + i);
        item.find('.date').html('Dated on ' + date);
        item.find('.userinfo').html(user);
        item.find('#source-contain').html('(' + source + ')');
        item.find('#text-contain').html(exactData);
        item.find('.title').html(title);
        item.find('.links').append(
          $('<a>').attr({'href': rowData.links.incontext, 'id': 'link-incontext'})
                  .html('Click to see in context'),
          $('<a>').attr({'href': rowData.links.html, 'id': 'link-html'})
                  .html('Click to see the HTML')
        )
        if(rowData.target[0].hasOwnProperty('selector')){
          var selector_length = rowData.target[0].selector.length;
          var exact = rowData.target[0].selector[selector_length-1].exact;
          item.find('.target-selector-exact').html(exact);
        } else {
          item.find('.target-selector-exact').hide();
        }
        $('#container-whole-' + type).append(item);
      }
      $('#row_contain-' + type).hide();
    } else {
      let error_msg;
      if (type === 'domain') {
        error_msg = 'There are no annotations for the current domain.';
      } else {
        error_msg = 'There are no annotations for the current URL.';
      }
      let row = $('#row_contain-' + type);
      let item = row.clone();
      item.html(
        $('<div>').addClass('col-sm-6 col-sm-offset-3 text-center')
                  .html(error_msg)
      );
      $('#container-whole-' + type).append(item);
      row.hide();
    }
  });
}


function showAnnotations(type){
  $('.tabcontent').hide()
  $('.tablink').removeClass('active')
  $('.tablink[value="' + type + '"]').addClass('active')
  $('#' + type).show()
}

$('.tablink').click(function(){
  showAnnotations($(this).attr('value'))
})


if (typeof module !== 'undefined') {
  module.exports = {hypothesis_api_url: hypothesis_api_url,
                    get_annotations: get_annotations}
}
