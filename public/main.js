$(document).on('ready', function() {
  var data = window.campaignData;
  data.forEach(function(element, index, array) {
    var nid = element.nid;
    $('#' + nid).on('click', function() {
      $('.diagonal-tile_container').css('background-image', 'url(' + element.cover_landscape + ')');
      $('.tile_problem').text(element.problem);
      $('.tile_cta').text(element.cta);
      $('.tile_cta').attr('href', 'https://www.dosomething.org/us/node/' + element.nid);
      $('.selected').removeClass('selected');
      $(this).addClass('selected');
      $('html, body').animate({
        scrollTop: 0
      }, 500);
    });
  });
});
