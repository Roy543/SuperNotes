$('#logout-button').on('click', function() {
    $.get('/logout', function() {
        window.location.href = '/login';
    });
});

$(document).ready(function(){
    $('.read-more').on('click', function(){
        var $moreText = $(this).prev('.more-text');
        if ($moreText.is(':hidden')) {
            $moreText.show();
            $(this).text('Read Less');
        } else {
            $moreText.hide();
            $(this).text('Read More');
        }
    });

    $('.update-note').on('click', function(){
        var noteId = $(this).data('note-id');
        
        // Get the new data for the note
        var updatedNoteTopic = prompt('Enter the new note topic:');
        var updatedNoteText = prompt('Enter the new note text:');
        
        // Send a PUT request to the server
        $.ajax({
            url: '/note/' + noteId,
            method: 'PUT',
            data: JSON.stringify({
                noteTopic: updatedNoteTopic,
                noteText: updatedNoteText
            }),
            contentType: 'application/json'
        }).done(function() {
            alert('Note updated successfully');
            location.reload();  // Reload the page to show the updated note
        }).fail(function(err) {
            alert('Error: ' + err.responseText);
        });
    });
    
});