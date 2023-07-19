$(document).ready(function () {
    $('#signup-form').on('submit', function (e) {
        e.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();

        $.post('/signup', { username: username, password: password })
            .done(function (data) {
                alert('Signup successful!');
                window.location.href = '/profile';
            })
            .fail(function (err) {
                alert('Error: ' + err.responseText);
            });

    });
});
