$('#logout-button').on('click', function() {
    $.get('/logout', function() {
        window.location.href = '/login';
    });
});