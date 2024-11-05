# Bag chrome
When uploading a video file to the server, an error occurs in the Chrome browser. 
The problem arises when a service worker is present, a video preview is used, and a video poster is created using canvas.

The problem exists in Chrome and Edge browsers. Safari and Firefox browsers do not encounter this problem.

## Start

`node server.js` and open page http://127.0.0.1:8002/

add video mp4 and click button sent

One solution to the problem is to create a copy of the file. For preview use one option and for sending to the server another
