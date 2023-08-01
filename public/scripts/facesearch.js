async function loadModels() {
    const MODEL_URL = '/models';
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
}

loadModels();

Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
});

document.getElementById('start-camera').onclick = function (event) {
    Webcam.attach('#my-camera');
    document.getElementById('capture-photo').disabled = false; // Enable the capture button
};

document.getElementById('capture-photo').onclick = function (event) {
    Webcam.snap(function (data_uri) {
        document.getElementById('snapshot').value = data_uri;
    });
    Webcam.reset(); // Stop the camera
    document.getElementById('capture-photo').disabled = true; // Disable the capture button
};