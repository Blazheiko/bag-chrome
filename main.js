if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./sw.js", { scope: "/" })
        .then((registration) => {
            console.log("Registration succeeded. Scope is " + registration.scope);
            registration.update()
                .then(() => {
                    console.log('registration.update');
                });
        })
        .catch((error) => {
            console.log("Registration failed with " + error);
        });
}
const getCanvas = (el) => {
    const w = el.width;
    const h = el.height;
    const canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(el, 0, 0, w, h);
    return canvas;
}
let videoFile = null;
let videoElement = null;
// let copyVideoFile = null;
const selectedFile = () => {
    console.log('selectedFile')
    const inputElement = document.getElementById('input')
    videoFile = inputElement.files[0]
    // copyVideoFile = new File([videoFile], videoFile.name, {type: videoFile.type});
    console.log(videoFile)
    if(!videoFile) return
    const url = URL.createObjectURL(videoFile)
    videoElement = document.createElement('video');
    videoElement.src = url;
    videoElement.controls = true;
    videoElement.width = 400;
    videoElement.height = 300;
    videoElement.muted = true;
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
    if (!videoFile || !videoElement) return
    URL.revokeObjectURL(videoElement.src)
    const canvas = getCanvas(videoElement);
    const poster = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.95));
    const formData = new FormData()
    // formData.append('copyVideoFile', videoFile ) // it works
    formData.append('video', videoFile ) // it error
    formData.append('poster', poster )
    try {
        const response = await fetch('/save-video', {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const data = await response.json();
        console.log(data);
        if(!data || data.status !== 'ok') return;
        console.log('Send Video successfully')
        const videoContainer = document.getElementById('videoContainer')
        const span = document.createElement('span');
        span.innerText = 'Sent Video. Test successfully';
        span.style.color = 'green';
        videoContainer.append(span)
        const button = document.getElementById('button')
        button.disabled = true

    } catch (error) {
        console.error("Error:", error);
    }
}
