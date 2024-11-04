if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./sw.js", { scope: "." })
        .then((reg) => {
            console.log("Registration succeeded. Scope is " + reg.scope);
        })
        .catch((error) => {
            console.log("Registration failed with " + error);
        });
}
let videoFile = null;
const selectedFile = () => {
    console.log('selectedFile')
    const inputElement = document.getElementById('input')
    videoFile = inputElement.files[0]
    console.log(videoFile)
    if(!videoFile) return
    const url = URL.createObjectURL(videoFile)
    const videoElement = document.createElement('video');
    videoElement.src = url;
    videoElement.controls = true;
    videoElement.width = 640;
    videoElement.height = 360;
    videoElement.autoplay = true;
    inputElement.disabled = true;
    const divVideo = document.getElementById('videoContainer')
    divVideo.append(videoElement)
    const button = document.getElementById('button')
    button.disabled = false
    // const file = inputElement.files
}
const sendVideo = async () => {
    console.log('sendVideo')
    const formData = new FormData()
    formData.append('video',videoFile,'test')
    try {
        const response = await fetch('/save-video', {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const json = await response.json();
        console.log(JSON.stringify(json));
    } catch (error) {
        console.error("Error:", error);
    }
}
