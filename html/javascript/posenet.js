// let video;
// let videourl = './img/run2.mp4';
// let poseNet;
// let pose;
// let skeleton;
// let playing = false;
// let poseconfig = {
//     architecture: 'ResNet50',
//     imageScaleFactor: 0.3,
//     outputStride: 32,let videourl = './img/run2.mp4';
//     minConfidence: 0.5,
//     maxPoseDetections: 5,
//     scoreThreshold: 0.5,
//     nmsRadius: 20,
//     detectionType: 'single',
//     inputResolution: 513,
//     //multiplier: 0.75,
//     quantBytes: 4,
// };

// function selectfile() {
//     //firebase
//     // Create a reference to the file we want to download
//     var starsRef = firebase.storage().ref('test/run2.mp4');

//     // Get the download URL
//     starsRef.getDownloadURL()
//         .then((url) => {
//             // Insert url into an <img> tag to "download"
//             //alert(url);
//             videourl = url;
//         })
//         .catch((error) => {
//             // A full list of error codes is available at
//             // https://firebase.google.com/docs/storage/web/handle-errors
//             switch (error.code) {
//                 case 'storage/object-not-found':
//                     alert("File doesn't exist");
//                     break;
//                 case 'storage/unauthorized':
//                     alert("User doesn't have permission to access the object");
//                     break;
//                 case 'storage/unknown':
//                     alert("Unknown error occurred, inspect the server response")
//                     break;
//             }
//         });
//     //firebaseEnd
// }

// function setup() {
//     createCanvas(640, 360);
//     video = createVideo(videourl, vidLoad);
// }

// // This function is called when the video loads
// function vidLoad() {
//     video.size(width, height);
//     video.volume(0);
//     video.noLoop();
//     video.hide();
//     //init posenet
//     poseNet = ml5.poseNet(video, poseconfig, modelLoaded);
// }

// function runposenet() {
//     //posenet
//     poseNet.on('pose', gotPoses);
//     video.play();
// }

// function gotPoses(poses) {
//     console.log(poses);
//     if (poses.length > 0) {
//         pose = poses[0].pose;
//         skeleton = poses[0].skeleton;
//     }
// }

// function modelLoaded() {
//     console.log('poseNet ready');
//     //enable run button
//     document.getElementById("runpose").style.display = "block";
// }

// function draw() {
//     image(video, 0, 0, width, height);
//     if (pose) {
//         let eyeR = pose.rightEye;
//         let eyeL = pose.leftEye;
//         let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
//         fill(255, 0, 0);
//         ellipse(pose.nose.x, pose.nose.y, d);
//         fill(0, 0, 255);
//         ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
//         ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

//         for (let i = 0; i < pose.keypoints.length; i++) {
//             let x = pose.keypoints[i].position.x;
//             let y = pose.keypoints[i].position.y;
//             fill(0, 255, 0);
//             ellipse(x, y, 16, 16);
//         }

//         for (let i = 0; i < skeleton.length; i++) {
//             let a = skeleton[i][0];
//             let b = skeleton[i][1];
//             strokeWeight(2);
//             stroke(255);
//             line(a.position.x, a.position.y, b.position.x, b.position.y);
//         }
//     }
// }

