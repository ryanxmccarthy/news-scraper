function addNote(e) {
  e.preventDefault();
  var id = $(this).attr('value');
  var obj = {
    title: $('#note-title').val().trim(),
    body: $('note-body').val().trim()
  };
  $.post('/note/' + id, obj, data => {
    window.location.href = '/saved';
  });
}

function showNote(e) {
  e.preventDefault();
  var id = $(this).attr('value');
  $('#addNote').fadeIn(300).css('display', 'flex');
  $('#add-note').attr('value', id);
  $.get('/' + id, data => {
    $('#article-title').text(data.title);
    $.get('/note/' + id, data => {
      if (data) {
        $('#note-title').val(data.title);
        $('#note-body').val(data.body);
      }
    });
  });
}

function changeStatus() {
  var status = $(this).attr('value');
  if (status === 'Saved') {
    $(this).html('Unsave');
  }
}

function changeBack() {
  $(this).html($(this).attr('value'));
}

$(document).on('click', '#add-note', addNote)
$(document).on('click', '.addnote-button', showNote);
$('.status').hover(changeStatus, changeBack);
$('#close-note').on('click' () => {
  $('#addNote').fadeOut(300);
});