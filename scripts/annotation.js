function get_annotations() {
  var url = getUrlByParameter('url');
  // TODO URL processing needs to be a separate function and also needs cleanup.
  var test_url = url.replace(/^https?:\/\//,'');
  if(test_url.includes('iskme.org')){
    test_url=test_url.replace(/^www\./,'');
  }
  console.log(test_url);
  test_url = test_url.replace('/','.')
  var url = test_url.split(".");
  var main_url = "";
  for(var i=0;i<url.length-1;i++){
    main_url += '&uri.parts=' + url[i];
  }
  var new_url = 'https://hypothes.is/api/search?' + main_url;
  // TODO
  console.log(new_url);
  $.getJSON(new_url, function(data) {
    const length = data.rows.length;
    if (length > 0) {
      for(let i=0; i<length; i++) {
        const rowData = data.rows[i];
        const date = rowData.created.substring(0,10);
        const source = rowData.target[0].source;
        const exactData = rowData.text;
        const user = rowData.user.substring(5,rowData.user.indexOf('@'));
        const title = rowData.document.title[0];
        let row = $('#row_contain');
        let item = row.clone();
        item.attr('id', 'row-' + i);
        item.find('.date').html('Dated on ' + date);
        item.find('.userinfo').html(user);
        item.find('#source-contain').html('(' + source + ')');
        item.find('#text-contain').html(exactData);
        item.find('.title').html(title);
        item.find('.links').append(
          $('<a>').attr({'href': rowData.links.incontext, 'id': 'link-incontext'})
                  .html('Click to see the in-context'),
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
        $('#container-whole').append(item);
      }
      $('#row_contain').hide();
    } else {
      $('#row_contain').html("There are no Annotations for the current URL");
    }
  });
}
