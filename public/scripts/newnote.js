var isCameraStarted = false;

// Function to start the camera
function startCamera() {
    if (!isCameraStarted) {
        Webcam.set({
            width: 320,
            height: 240,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.attach('#my-camera');
        isCameraStarted = true;
    }
}

// Function to stop the camera
function stopCamera() {
    if (isCameraStarted) {
        Webcam.reset();
        isCameraStarted = false;
    }
}

// Handle start camera button click
document.getElementById('start-camera').onclick = function (event) {
    startCamera();
    document.getElementById('capture-photo').disabled = false;  // Enable the snapshot button
};

// Handle capture button click
document.getElementById('capture-photo').onclick = function (event) {
    Webcam.snap(function (data_uri) {
        document.getElementById('snapshot').value = data_uri;
    });

    stopCamera();
    document.getElementById('capture-photo').disabled = true;  // Disable the snapshot button
};


$('#new-note-form').on('submit', function (e) {
    e.preventDefault();

    var personName = $('#person-name').val();
    var noteTopic = $('#note-topic').val();
    var noteText = $('#note-text').val();
    var photo = $('#snapshot').val();

    var data = {
        personName: personName,
        noteTopic: noteTopic,
        noteText: noteText,
        photo: btoa(photo)  // use Base64 encoding
    };

    $.ajax({
        url: '/newnote',
        method: 'POST',
        data: JSON.stringify(data),
        processData: false,
        contentType: 'application/json'  // tell the server we're sending JSON
    }).done(function () {
        alert('Note created successfully');
        window.location.href = '/profile';
    }).fail(function (err) {
        alert('Error: ' + err.responseText);
    });
});
