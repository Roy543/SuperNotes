var isCameraStarted = false;

async function loadModels() {
    const MODEL_URL = '/models';
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
}

loadModels();

window.onload = function () {
    // Clear the results div
    document.getElementById('results').innerHTML = '';
};

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

function stopCamera() {
    if (isCameraStarted) {
        Webcam.reset();
        isCameraStarted = false;
    }
}

document.getElementById('start-camera').onclick = function (event) {
    startCamera();
    document.getElementById('capture-photo').disabled = false; // Enable the capture button
};

document.getElementById('capture-photo').onclick = async function (event) {
    Webcam.snap(async function (data_uri) {
        document.getElementById('snapshot').value = data_uri;

        // Convert the data URI to a HTML image element
        const img = new Image();
        img.src = data_uri;
        await new Promise(resolve => img.onload = resolve);

        // Extract the face descriptor
        const detections = await faceapi.detectAllFaces(img)
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length > 0) {
            const descriptor = detections[0].descriptor;
            document.getElementById('descriptor').value = JSON.stringify(descriptor);
            console.log(`Stored descriptor: ${JSON.stringify(descriptor)}`);
            // Enable the submit button
            document.getElementById('submit-search').disabled = false;
        }
    });

    stopCamera();
    document.getElementById('capture-photo').disabled = true;  // Disable the snapshot button
};

document.getElementById('submit-search').onclick = function (event) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    while (resultsDiv.firstChild) {
        resultsDiv.firstChild.remove();
    }

    const descriptorString = document.getElementById('descriptor').value;
    console.log(`Sent descriptor: ${descriptorString}`);
    const descriptor = JSON.parse(descriptorString);
    $.ajax({
        url: '/facesearch',
        method: 'POST',
        data: JSON.stringify({ descriptor: descriptor }),
        processData: false,
        contentType: 'application/json'
    }).done(function (notes) {
        const resultsDiv = document.getElementById('results');
        notes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.textContent = `Topic: ${note.noteTopic}, Name: ${note.personName}, Text: ${note.noteText}`; // Add the note details
            resultsDiv.appendChild(noteDiv);
        });
    }).fail(function (err) {
        alert('Error: ' + err.responseText);
    });
};