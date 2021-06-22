var started = false;
var replaynose = false;
var replaynosewithleg = false;
var replaynosewithhip = false;
var video;
var videofile;
let img;
let poseNet;
let poses = [];
let history;
let p = 0;
let v = 0;
let posetimes = 0;
// set some options
let options = {
    architecture: 'ResNet50',
    imageScaleFactor: 0.50,
    outputStride: 32,
    flipHorizontal: false,
    minConfidence: 0,
    maxPoseDetections: 1,
    scoreThreshold: 0,
    nmsRadius: 20,
    detectionType: 'single',
    inputResolution: 640,
    //multiplier: 1,
    quantBytes: 4,
};
var username;
var counter = 0;
var runvideo;
//json
var txt = '{"pose":[]}';
var obj = JSON.parse(txt);
var objnose = JSON.parse(txt);
var objleftleg = JSON.parse(txt);
var objrightleg = JSON.parse(txt);
var objleftElbow = JSON.parse(txt);
var objrightElbow = JSON.parse(txt);
var objleftWrist = JSON.parse(txt);
var objrightWrist = JSON.parse(txt);
var objleftHip = JSON.parse(txt);
var objrightHip = JSON.parse(txt);
var objleftShoulder = JSON.parse(txt);
var objrightShoulder = JSON.parse(txt);
var leftlegmin = JSON.parse(txt);
var leftlegmin2 = JSON.parse(txt);
var leftlegmin3 = JSON.parse(txt);
var rightlegmin = JSON.parse(txt);
var rightlegmin2 = JSON.parse(txt);
var rightlegmin3 = JSON.parse(txt);

function setup() {
    canvas = createCanvas(1280, 720);
    canvas.parent("canvasplacement");
    var button = createButton("Show head movement");
    button.mousePressed(drawheadwithvideo);
    button.parent("btnplacement");
    var button = createButton("Show head with hip movement");
    button.mousePressed(drawheadwithhipvideo);
    button.parent("btnplacement");
    var button = createButton("Show head with feet land movement");
    button.mousePressed(drawheadwithlegvideo);
    button.parent("btnplacement");
}

function startSketch() {
    canvas.background(204);
    
    video = createVideo(videofile);
    video.id("test");
    video.size(1280, 720);
    video.speed(0.1);
    video.volume(0);
    video.onended(sayDone);
    video.hide();
    poseNet = ml5.poseNet(video, options, modelReady);
    started = true;
}

// put the pose event callback in a variable
callback = function (results) {
    poses = results;
    console.log(poses);
}

function sayDone() {
    var videotest = document.getElementById("test");
    videoduration = videotest.duration;
    started = false;
    videotest.remove();
    // stop listening to pose detection events by removing the event listener
    poseNet.removeListener('pose', callback);
    console.log("ended");
    console.log(obj);
    put();
    getrightleg();
    getleftleg();
    analysis();
    poses = 0;
}

function modelReady() {
    console.log('model ready');
    started = true;
    video.play();
    // start listening to pose detection events
    poseNet.on('pose', callback);
}

function draw() {
    if (started) {
        image(video, 0, 0, 1280, 720);
        if (poses.length > 0) {
            drawSkeleton();
            drawKeypoints();
        }
        if (replaynose == true) {
            nose();
        } else if (replaynosewithleg == true) {
            nosewithleg();
        } else if (replaynosewithhip == true) {
            nosewithhip();
        }
    }
}

var leftlegperx = 0;
var leftlegpery = 0;
var rightlegperx = 0;
var rightlegpery = 0;
var leftElbowx = 0;
var leftElbowy = 0;
var rightElbowx = 0;
var rightElbowy = 0;
var leftWristx = 0;
var leftWristy = 0;
var rightWristx = 0;
var rightWristy = 0;
var leftHipx = 0;
var leftHipy = 0;
var rightHipx = 0;
var rightHipy = 0;
var leftShoulderx = 0;
var leftShouldery = 0;
var rightShoulderx = 0;
var rightShouldery = 0;

function drawKeypoints() {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.position.x < 1280 && keypoint.position.y < 720) {
                fill(255);
                stroke(20);
                strokeWeight(4);
                ellipse(round(keypoint.position.x), round(keypoint.position.y), 16);
                obj['pose'].push({ "part": keypoint.part, "x": keypoint.position.x, "y": keypoint.position.y });

            }
        }
    }
}

function put() {
    for (let j = 0; j < obj.pose.length; j++) {
        switch (obj.pose[j].part) {
            case "nose":
                objnose['pose'].push({ "x": obj.pose[j].x, "y": obj.pose[j].y });
                break;
            case "leftAnkle":
                if (Math.round(leftlegperx) == Math.round(obj.pose[j].x) && Math.round(leftlegpery) == Math.round(obj.pose[j].y)) {
                    leftlegperx = Math.round(obj.pose[j].x);
                    leftlegpery = Math.round(obj.pose[j].y);
                } else {
                    objleftleg['pose'].push({ "x": Math.round(obj.pose[j].x), "y": Math.round(obj.pose[j].y) });
                    leftlegperx = Math.round(obj.pose[j].x);
                    leftlegpery = Math.round(obj.pose[j].y);
                }
                break;
            case "rightAnkle":
                if (Math.round(rightlegperx) == Math.round(obj.pose[j].x) && Math.round(rightlegpery) == Math.round(obj.pose[j].y)) {
                    rightlegperx = Math.round(obj.pose[j].x);
                    rightlegpery = Math.round(obj.pose[j].y);
                } else {
                    objrightleg['pose'].push({ "x": Math.round(obj.pose[j].x), "y": Math.round(obj.pose[j].y) });
                    rightlegperx = Math.round(obj.pose[j].x);
                    rightlegpery = Math.round(obj.pose[j].y);
                }
                break;
            case "leftElbow":
                if (Math.round(leftElbowx) == Math.round(obj.pose[j].x) && Math.round(leftElbowy) == Math.round(obj.pose[j].y)) {
                    leftElbowx = Math.round(obj.pose[j].x);
                    leftElbowy = Math.round(obj.pose[j].y);
                } else {
                    objleftElbow['pose'].push({ "x": Math.round(obj.pose[j].x), "y": Math.round(obj.pose[j].y) });
                    leftElbowx = Math.round(obj.pose[j].x);
                    leftElbowy = Math.round(obj.pose[j].y);
                }
                break;
            case "rightElbow":
                if (Math.round(rightElbowx) == Math.round(obj.pose[j].x) && Math.round(rightElbowy) == Math.round(obj.pose[j].y)) {
                    rightElbowx = Math.round(obj.pose[j].x);
                    rightElbowy = Math.round(obj.pose[j].y);
                } else {
                    objrightElbow['pose'].push({ "x": Math.round(obj.pose[j].x), "y": Math.round(obj.pose[j].y) });
                    rightElbowx = Math.round(obj.pose[j].x);
                    rightElbowy = Math.round(obj.pose[j].y);
                }
                break;
            case "leftWrist":
                if (Math.round(leftWristx) == Math.round(obj.pose[j].x) && Math.round(leftWristy) == Math.round(obj.pose[j].y)) {
                    leftWristx = Math.round(obj.pose[j].x);
                    leftWristy = Math.round(obj.pose[j].y);
                } else {
                    objleftWrist['pose'].push({ "x": Math.round(obj.pose[j].x), "y": Math.round(obj.pose[j].y) });
                    leftWristx = Math.round(obj.pose[j].x);
                    leftWristy = Math.round(obj.pose[j].y);
                }
                break;
            case "rightWrist":
                if (Math.round(rightWristx) == Math.round(obj.pose[j].x) && Math.round(rightWristy) == Math.round(obj.pose[j].y)) {
                    rightWristx = Math.round(obj.pose[j].x);
                    rightWristy = Math.round(obj.pose[j].y);
                } else {
                    objrightWrist['pose'].push({ "x": Math.round(obj.pose[j].x), "y": Math.round(obj.pose[j].y) });
                    rightWristx = Math.round(obj.pose[j].x);
                    rightWristy = Math.round(obj.pose[j].y);
                }
                break;
            case "leftHip":
                if (Math.round(leftHipx) == Math.round(obj.pose[j].x) && Math.round(leftHipy) == Math.round(obj.pose[j].y)) {
                    leftHipx = Math.round(obj.pose[j].x);
                    leftHipy = Math.round(obj.pose[j].y);
                } else {
                    objleftHip['pose'].push({ "x": Math.round(obj.pose[j].x), "y": Math.round(obj.pose[j].y) });
                    leftHipx = Math.round(obj.pose[j].x);
                    leftHipy = Math.round(obj.pose[j].y);
                }
                break;
            case "rightHip":
                if (Math.round(rightHipx) == Math.round(obj.pose[j].x) && Math.round(rightHipy) == Math.round(obj.pose[j].y)) {
                    rightHipx = Math.round(obj.pose[j].x);
                    rightHipy = Math.round(obj.pose[j].y);
                } else {
                    objrightHip['pose'].push({ "x": Math.round(obj.pose[j].x), "y": Math.round(obj.pose[j].y) });
                    rightHipx = Math.round(obj.pose[j].x);
                    rightHipy = Math.round(obj.pose[j].y);
                }
            case "leftShoulder":
                if (Math.round(leftShoulderx) == Math.round(obj.pose[j].x) && Math.round(leftShouldery) == Math.round(obj.pose[j].y)) {
                    leftShoulderx = Math.round(obj.pose[j].x);
                    leftShouldery = Math.round(obj.pose[j].y);
                } else {
                    objleftShoulder['pose'].push({ "x": Math.round(obj.pose[j].x), "y": Math.round(obj.pose[j].y) });
                    leftShoulderx = Math.round(obj.pose[j].x);
                    leftShouldery = Math.round(obj.pose[j].y);
                }
            case "rightShoulder":
                if (Math.round(rightShoulderx) == Math.round(obj.pose[j].x) && Math.round(rightShouldery) == Math.round(obj.pose[j].y)) {
                    rightShoulderx = Math.round(obj.pose[j].x);
                    rightShouldery = Math.round(obj.pose[j].y);
                } else {
                    objrightShoulder['pose'].push({ "x": Math.round(obj.pose[j].x), "y": Math.round(obj.pose[j].y) });
                    rightShoulderx = Math.round(obj.pose[j].x);
                    rightShouldery = Math.round(obj.pose[j].y);
                }
                break;
            default:
                break;
        }
    }
}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255);
            strokeWeight(1);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}

var firebaseConfig = {
    apiKey: "AIzaSyC1F1-cFM8sF5UhaXMo9BvyitciNCqEBf8",
    authDomain: "coacheyesweb.firebaseapp.com",
    projectId: "coacheyesweb",
    storageBucket: "coacheyesweb.appspot.com",
    messagingSenderId: "395470429039",
    appId: "1:395470429039:web:89af61796c5166afc8e69a",
    measurementId: "G-PXJ8NPH1E6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

function register() {
    //get input value
    var email = document.getElementById("regemail").value;
    var name = document.getElementById("regname").value;
    var pw = document.getElementById("regpw").value;
    //see account exist
    //get collection
    var docRef = firestore.collection("users").doc(email);

    docRef.get().then(function (doc) {
        if (doc && doc.exists) {
            alert("account already exist")
        } else {
            //get collection
            var docRef = firestore.collection("users").doc(email);
            docRef.set({
                name: name,
                password: pw
            }).then(function () {
                alert("Registered");
                //redirect
                closeRegisterForm();

            }).catch(function (error) {
                alert("NO");
                console.log(error)
            });
        }
    });
}
var username;
//login
function login() {
    //get input value
    var email = document.getElementById("email").value;
    var pw = document.getElementById("pw").value;

    //get collection
    var docRef = firestore.collection("users").doc(email);

    docRef.get().then(function (doc) {
        if (doc && doc.exists) {
            const myData = doc.data();
            if (myData.password == pw) {
                alert("Logined");
                //redirect
                window.name = email;
                window.location.href = "userhome.html";
            } else {
                alert("password wrong");
            }
        } else {
            alert("no")
        }
    }).catch(function (error) {
        alert("no");
        console.log("Got an error", error);
    })
}

function logout() {
    //redirect
    username = "";
    window.location.href = "index.html";
}

window.onload = function () {
    //get elements
    var uploader = document.getElementById("uploader");
    var fileButton = document.getElementById("fileButton");

    fileButton.addEventListener('change', function (e) {
        //get file
        var file = e.target.files[0];

        //create storage reference
        var storageRef = firebase.storage().ref('test/' + file.name);

        //upload file
        var task = storageRef.put(file);

        //update progress bar
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploader.value = percentage;
            },
            function error(err) {
                alert("error");
            },
            function complete() {
                console.log("upload completed");
                task.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    videofile = downloadURL;
                    startSketch();
                });
            });
    });
    console.log("loaded firebase");
}

function uploadresult() {
    console.log("username: " + window.name);
    var d = new Date();
    var date = d.getFullYear() + "" + ((d.getMonth() > 9 ? '' : '0') + (d.getMonth() + 1) + "" + (d.getDate() > 9 ? '' : '0') + d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds());
    var docRef = firestore.collection("results").doc(window.name).collection("testresult").doc(date);
    docRef.set({
        videofile: videofile,
        headbounching: headbounching + " (" + headbounchinggrade + ")",
        cadences: cadences + " (" + cadencesgrade + ")",
        hipresult: hipresult,
        headlandfeet: headlandfeet2,
        headjson: objnose,
        leftlegjson: objleftleg,
        rightlegjson: objrightleg,
        rightlegmin2json: rightlegmin2,
        leftlegmin2json: leftlegmin2,
        objleftHipjson: objleftHip,
        totalgrade: totalgrade
    }).then(function () {
        alert("Uploaded result");
    }).catch(function (error) {
        alert("NO");
        console.log(error)
    });
}

function showresult() {
    //get collection
    var docRef = firestore.collection("results").doc("demo2");

    docRef.get().then(function (doc) {
        console.log(doc.data())
    })
}

//Get History
function gethistory() {
    var x = document.createElement("SELECT");
            x.setAttribute("id", "mySelect");
            x.setAttribute("onChange", "loadhistory()");
            document.getElementById("historyselect").appendChild(x);
    firestore.collection("results").doc(window.name).collection("testresult").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id);
            // var table = document.getElementById("historytable");
            // var row = table.insertRow(1);
            // var cell1 = row.insertCell(0);
            // cell1.innerHTML = doc.id;
            // row.setAttribute("type", "button");
            // row.setAttribute("id", doc.id);
            // row.setAttribute("class", "datebutton");
            // row.setAttribute("onclick", "loadhistory(this.id);");
            //row.onclick = function(){ loadhistory(this.id); };
            var z = document.createElement("option");
            z.setAttribute("value", doc.id);
            var t = document.createTextNode(doc.id);
            z.appendChild(t);
            document.getElementById("mySelect").appendChild(z);
        });
    });
}

function loadhistory() {
    var clicked_id = document.getElementById("mySelect").value;
    counter = 0;
    clear();
    background(204);
    //get collection
    var docRef = firestore.collection("results").doc(window.name).collection("testresult").doc(clicked_id);
    docRef.get().then(function (doc) {
        history = doc.data();
        //console.log("thing "+history.cadences);
        document.getElementById("r1").innerHTML = "headbounc: " + history.headbounching +"%";
        document.getElementById("r2").innerHTML = history.hipresult;
        document.getElementById("r3").innerHTML = history.headlandfeet;
        document.getElementById("r4").innerHTML = "cadences: " + history.cadences;
        document.getElementById("totalgrade").innerHTML = "totalgrade: " + history.totalgrade;
        objnose = history.headjson;
        objleftleg = history.leftlegjson;
        objrightleg = history.rightlegjson;
        leftlegmin2 = history.leftlegmin2json;
        rightlegmin2 = history.rightlegmin2json;
        objleftHip = history.objleftHipjson;
        videofile = history.videofile;
    });
}

function leftleg() {
    console.log(objleftleg);
    clear();
    background(205);
    for (i = 0; i < objleftleg.pose.length; i++) {
        fill('yellow');
        noStroke();
        ellipse(round(objleftleg.pose[i].x), round(objleftleg.pose[i].y), 8, 8);
    }
}

function rightleg() {
    history = obj;
    clear();
    background(205);
    for (i = 0; i < history.pose.length; i++) {
        if (history.pose[i].part == "rightAnkle") {
            fill('green');
            noStroke();
            ellipse(round(history.pose[i].x), round(history.pose[i].y), 8, 8);
        }
    }
}

function nose() {
    for (i = 0; i < objnose.pose.length; i++) {
        fill('red');
        noStroke();
        ellipse(round(objnose.pose[i].x), round(objnose.pose[i].y), 8, 8);
    }
}

function nosewithleg() {
    for (i = 0; i < objnose.pose.length; i++) {
        //head
        fill('red');
        noStroke();
        ellipse(round(objnose.pose[i].x), round(objnose.pose[i].y), 8, 8);
    }
    for (i = 0; i < objleftleg.pose.length; i++) {
        fill('yellow');
        noStroke();
        ellipse(round(objleftleg.pose[i].x), round(objleftleg.pose[i].y), 8, 8);
        for (l = 0; l < leftlegmin2.pose.length; l++) {
            if (objleftleg.pose[i].x == leftlegmin2.pose[l].x) {
                fill('yellow');
                stroke(50);
                ellipse(round(leftlegmin2.pose[l].x), round(leftlegmin2.pose[l].y), 8, 8);
            }
        }
    }
    for (i = 0; i < objrightleg.pose.length; i++) {
        fill('purple');
        noStroke();
        ellipse(round(objrightleg.pose[i].x), round(objrightleg.pose[i].y), 8, 8);
        for (m = 0; m < rightlegmin2.pose.length; m++) {
            if (objrightleg.pose[i].x == rightlegmin2.pose[m].x) {
                fill('purple');
                stroke(50);
                ellipse(round(rightlegmin2.pose[m].x), round(rightlegmin2.pose[m].y), 8, 8);
            }
        }
    }
}


function nosewithhip() {
    for (i = 0; i < objnose.pose.length; i++) {
        //head
        fill('red');
        noStroke();
        ellipse(round(objnose.pose[i].x), round(objnose.pose[i].y), 8, 8);
    }
    for (i = 0; i < objleftHip.pose.length; i++) {
        fill('green');
        noStroke();
        ellipse(round(objleftHip.pose[i].x), round(objleftHip.pose[i].y), 8, 8);
    }
}
var countertest;
countertest = 0;
var countertest2;
countertest2 = 0;
// function nosewithhip() {
//     setTimeout(function () {
//         //head
//         fill('red');
//         stroke(100);
//         ellipse(round(objnose.pose[countertest].x), round(objnose.pose[countertest].y), 8, 8);
//         countertest++;
//         if (countertest < objnose.pose.length) {
//             nosewithhip();
//         } else {
//             countertest = 0;
//         }
//     }, 4000)
// }

// function nosewithhip2() {
//     setTimeout(function () {
//         fill('green');
//         stroke(100);
//         ellipse(round(objleftHip.pose[countertest2].x), round(objleftHip.pose[countertest2].y), 8, 8);
//         countertest2++;
//         if (countertest2 < objleftHip.pose.length) {
//             nosewithhip();
//         } else {
//             countertest2 = 0;
//         }
//     }, 4000)
// }

var headmaxX;
var headmaxY;
var headmax;
var headminX;
var headminY;
var headmin;
var newnum = 0;
var oldnum = 0;
var headbounching = 0;
var vid;
var videoduration;
var cadences = 0;
var cadencesgrade;
var cadencesgradenum;
var headbounchinggrade;
var headbounchinggradenum;
var hipgrade;
var hipgradenum;
var headlandfeetgrade;
var headlandfeetgradenum;
var totalgrade;
var totalgradenum;
function analysis() {
    cadencesgrade = "";
    cadencesgradenum = 0;
    headbounchinggrade = "";
    headbounchinggradenum = 0;
    hipgrade = "";
    hipgradenum = 0;
    headlandfeetgrade = "";
    headlandfeetgradenum = 0;
    totalgrade = "";
    totalgradenum = 0;
    console.log("ANALYSIS START");
    //is head bouncing?
    getheadmax();
    getheadmin();
    newnum = headmaxY;
    oldnum = headminY;
    headbounching = ((newnum - oldnum) / oldnum) * 100;
    console.log("headbounc: " + Math.round(headbounching));
    //headpostion with landing, print nose with rightleg and leftleg
    getfootland();
    //arms
    //console.log();
    //hips
    gethippostion();
    //cadences footstep x time
    cadences = ((rightlegmin3.pose.length + leftlegmin3.pose.length) / Math.round(videoduration)) * 60;
    console.log("cadences: " + cadences);

    //grade
    if (headbounching < 25) {
        headbounchinggrade = "A";
        headbounchinggradenum = 3
    } else if (headbounching > 25 && headbounching < 50) {
        headbounchinggrade = "B"
        headbounchinggradenum = 2
    } else {
        headbounchinggrade = "C"
        headbounchinggradenum = 1
    }
    if (cadences > 180) {
        cadencesgrade = "A";
        cadencesgradenum = 3
    } else if (cadences < 180 && cadences > 160) {
        cadencesgrade = "B"
        cadencesgradenum = 2
    } else {
        cadencesgrade = "C"
        cadencesgradenum = 1
    }
    console.log("ANALYSIS END");
    document.getElementById("r1").innerHTML = "headbounc: " + Math.round(headbounching) + " (" + headbounchinggrade + ")" + "%";
    document.getElementById("r4").innerHTML = "cadences: " + cadences + " (" + cadencesgrade + ")";
    totalgradenum = cadencesgradenum + headbounchinggradenum + headlandfeetgradenum + hipgradenum;
    if (totalgradenum / 4 >= 2.5) { totalgrade = "A" } else if (totalgradenum / 4 > 2 && totalgradenum / 4 < 2.5) { totalgrade = "B" } else { totalgrade = "C" }
    console.log(totalgradenum);
    document.getElementById("totalgrade").innerHTML = "totalgrade: " + totalgrade;
    //uploadresult
    uploadresult();
}

var hipresult;
function gethippostion() {
    var hip = 0;
    for (i = 0; i < objleftHip.pose.length; i++) {
        if (objnose.pose[i].x - objleftHip.pose[i].x < 50 && objnose.pose[i].x - objleftHip.pose[i].x > -50) {
            hip++;
        }
    }
    if (objleftHip.pose.length - hip <= 5) {
        hipgrade = "A";
        hipgradenum = 3
    } else if (objleftHip.pose.length - hip > 5 && objleftHip.pose.length - hip < 100) {
        hipgrade = "B"
        hipgradenum = 2
    } else {
        hipgrade = "C"
        hipgradenum = 1
    }
    console.log("hip in best postion: " + hip + " / " + objleftHip.pose.length);
    document.getElementById("r2").innerHTML = "hip in best postion: " + hip + " / " + objleftHip.pose.length + " (" + hipgrade + ")";
    hipresult = "hip in best postion: " + hip + " / " + objleftHip.pose.length + " / " + objleftHip.pose.length + " (" + hipgrade + ")";
}
var headlandfeet2;
function getfootland() {
    var headlandfeet = 0;

    for (i = 0; i < objleftleg.pose.length; i++) {
        for (l = 0; l < leftlegmin2.pose.length; l++) {
            if (objleftleg.pose[i].x == leftlegmin2.pose[l].x) {
                if (objnose.pose[i].x - leftlegmin2.pose[l].x > -20 && objnose.pose[i].x - leftlegmin2.pose[l].x < 20) {
                    headlandfeet++;
                    break;
                }
            }
        }
    }
    for (i = 0; i < objrightleg.pose.length; i++) {
        for (m = 0; m < rightlegmin2.pose.length; m++) {
            if (objrightleg.pose[i].x == rightlegmin2.pose[m].x) {
                if (objnose.pose[i].x - rightlegmin2.pose[m].x > -20 && objnose.pose[i].x - rightlegmin2.pose[m].x < 20) {
                    headlandfeet++;
                    break;
                }
            }
        }
    }
    if ((leftlegmin2.pose.length + rightlegmin2.pose.length) - headlandfeet <= 5) {
        headlandfeetgrade = "A";
        headlandfeetgradenum = 3
    } else if ((leftlegmin2.pose.length + rightlegmin2.pose.length) - headlandfeet > 5 && (leftlegmin2.pose.length + rightlegmin2.pose.length) - headlandfeet < 100) {
        headlandfeetgrade = "B"
        headlandfeetgradenum = 2
    } else {
        headlandfeetgrade = "C"
        headlandfeetgradenum = 1
    }
    console.log("head land feet: " + headlandfeet + " / " + (leftlegmin2.pose.length + rightlegmin2.pose.length));
    headlandfeet2 = "head land feet: " + headlandfeet + " / " + (leftlegmin2.pose.length + rightlegmin2.pose.length) + " (" + headlandfeetgrade + ")";
    document.getElementById("r3").innerHTML = "head land feet: " + headlandfeet + " / " + (leftlegmin2.pose.length + rightlegmin2.pose.length) + " (" + headlandfeetgrade + ")";
}

function getheadmax() {
    history = objnose;
    //console.log(history);
    headmaxY = 0;
    for (i = 0; i < history.pose.length; i++) {
        if (history.pose[i].y > 1080) {
            continue;
        } else if (history.pose[i].y > headmaxY) {
            //headmax = history.pose[i];
            headmaxX = history.pose[i].x;
            headmaxY = history.pose[i].y;
        }
    }
    return headmaxY;
}

function getheadmin() {
    history = objnose;
    headminY = history.pose[0].y;
    for (i = 0; i < history.pose.length; i++) {
        if (history.pose[i].y < headminY) {
            headminY = history.pose[i].y;
            headminX = history.pose[i].x;
        }
    }
    //console.log("headminX: " + headminX + " headminY: " + headminY);
    return headminY;
}

var leftlegfirst;
var leftlegnow;
var leftlegnext;
var gg;
function getleftleg() {
    leftlegfirst = objleftleg.pose[0].y;
    leftlegnow = objleftleg.pose[1].y;
    leftlegnext = objleftleg.pose[2].y;

    for (i = 0; i < objleftleg.pose.length; i++) {
        gg = i + 2;
        if (gg < objleftleg.pose.length) {
            leftlegfirst = objleftleg.pose[i + 0].y;
            leftlegnow = objleftleg.pose[i + 1].y;
            leftlegnext = objleftleg.pose[i + 2].y;
            //console.log(objleftleg.pose[i + 1].y);
            if (leftlegfirst <= leftlegnow && leftlegnext <= leftlegnow) {
                leftlegmin['pose'].push({ "x": objleftleg.pose[i + 1].x, "y": objleftleg.pose[i + 1].y });
            }
        }
    }

    //doagain
    leftlegfirst = leftlegmin.pose[0].y;
    leftlegnow = leftlegmin.pose[1].y;
    leftlegnext = leftlegmin.pose[2].y;

    for (i = 0; i < leftlegmin.pose.length; i++) {
        gg = i + 2;
        if (gg < leftlegmin.pose.length) {
            leftlegfirst = leftlegmin.pose[i + 0].y;
            leftlegnow = leftlegmin.pose[i + 1].y;
            leftlegnext = leftlegmin.pose[i + 2].y;
            //console.log(objleftleg.pose[i + 1].y);
            if (leftlegfirst <= leftlegnow && leftlegnext <= leftlegnow) {
                leftlegmin2['pose'].push({ "x": leftlegmin.pose[i + 1].x, "y": leftlegmin.pose[i + 1].y });
            }
        }
    }

    //doagain
    leftlegfirst = leftlegmin2.pose[0].y;
    leftlegnow = leftlegmin2.pose[1].y;
    leftlegnext = leftlegmin2.pose[2].y;

    for (i = 0; i < leftlegmin2.pose.length; i++) {
        gg = i + 2;
        if (gg < leftlegmin2.pose.length) {
            leftlegfirst = leftlegmin2.pose[i + 0].y;
            leftlegnow = leftlegmin2.pose[i + 1].y;
            leftlegnext = leftlegmin2.pose[i + 2].y;
            //console.log(objleftleg.pose[i + 1].y);
            if (leftlegfirst <= leftlegnow && leftlegnext <= leftlegnow) {
                leftlegmin3['pose'].push({ "x": leftlegmin2.pose[i + 1].x, "y": leftlegmin2.pose[i + 1].y });
            }
        }
    }
}

//dorightleg
var rightlegfirst;
var rightlegnow;
var rightlegnext;
var gg;
function getrightleg() {
    rightlegfirst = objrightleg.pose[0].y;
    rightlegnow = objrightleg.pose[1].y;
    rightlegnext = objrightleg.pose[2].y;

    for (i = 0; i < objrightleg.pose.length; i++) {
        gg = i + 2;
        if (gg < objrightleg.pose.length) {
            rightlegfirst = objrightleg.pose[i + 0].y;
            rightlegnow = objrightleg.pose[i + 1].y;
            rightlegnext = objrightleg.pose[i + 2].y;
            //console.log(objrightleg.pose[i + 1].y);
            if (rightlegfirst <= rightlegnow && rightlegnext <= rightlegnow) {
                rightlegmin['pose'].push({ "x": objrightleg.pose[i + 1].x, "y": objrightleg.pose[i + 1].y });
            }
        }
    }

    //doagain
    rightlegfirst = rightlegmin.pose[0].y;
    rightlegnow = rightlegmin.pose[1].y;
    rightlegnext = rightlegmin.pose[2].y;

    for (i = 0; i < rightlegmin.pose.length; i++) {
        gg = i + 2;
        if (gg < rightlegmin.pose.length) {
            rightlegfirst = rightlegmin.pose[i + 0].y;
            rightlegnow = rightlegmin.pose[i + 1].y;
            rightlegnext = rightlegmin.pose[i + 2].y;
            //console.log(objrightleg.pose[i + 1].y);
            if (rightlegfirst <= rightlegnow && rightlegnext <= rightlegnow) {
                rightlegmin2['pose'].push({ "x": rightlegmin.pose[i + 1].x, "y": rightlegmin.pose[i + 1].y });
            }
        }
    }

    //doagain
    rightlegfirst = rightlegmin2.pose[0].y;
    rightlegnow = rightlegmin2.pose[1].y;
    rightlegnext = rightlegmin2.pose[2].y;

    for (i = 0; i < rightlegmin2.pose.length; i++) {
        gg = i + 2;
        if (gg < rightlegmin2.pose.length) {
            rightlegfirst = rightlegmin2.pose[i + 0].y;
            rightlegnow = rightlegmin2.pose[i + 1].y;
            rightlegnext = rightlegmin2.pose[i + 2].y;
            //console.log(objrightleg.pose[i + 1].y);
            if (rightlegfirst <= rightlegnow && rightlegnext <= rightlegnow) {
                rightlegmin3['pose'].push({ "x": rightlegmin2.pose[i + 1].x, "y": rightlegmin2.pose[i + 1].y });
            }
        }
    }
}

function printrightlegpoint1() {
    clear();
    console.log(rightlegmin);
    background(205);
    for (i = 0; i < rightlegmin.pose.length; i++) {
        fill('yellow');
        strokeWeight(4);
        stroke(51);
        ellipse(round(rightlegmin.pose[i].x), round(rightlegmin.pose[i].y), 8, 8);
    }
}

function printrightlegpoint2() {
    clear();
    console.log(rightlegmin2);
    background(205);
    for (i = 0; i < rightlegmin2.pose.length; i++) {
        fill('yellow');
        strokeWeight(4);
        stroke(51);
        ellipse(round(rightlegmin2.pose[i].x), round(rightlegmin2.pose[i].y), 8, 8);
    }
}

function printrightlegpoint3() {
    clear();
    console.log(rightlegmin3);
    background(205);
    for (i = 0; i < rightlegmin3.pose.length; i++) {
        fill('yellow');
        strokeWeight(4);
        stroke(51);
        ellipse(round(rightlegmin3.pose[i].x), round(rightlegmin3.pose[i].y), 8, 8);
    }
}

function printleftlegpoint1() {
    clear();
    console.log(leftlegmin);
    background(205);
    for (i = 0; i < leftlegmin.pose.length; i++) {
        fill('yellow');
        strokeWeight(4);
        stroke(51);
        ellipse(round(leftlegmin.pose[i].x), round(leftlegmin.pose[i].y), 8, 8);
    }
}

function printleftlegpoint2() {
    clear();
    console.log(leftlegmin);
    background(205);
    for (i = 0; i < leftlegmin2.pose.length; i++) {
        fill('yellow');
        strokeWeight(4);
        stroke(52);
        ellipse(round(leftlegmin2.pose[i].x), round(leftlegmin2.pose[i].y), 8, 8);
    }
}

function printleftlegpoint3() {
    clear();
    console.log(leftlegmin);
    background(205);
    for (i = 0; i < leftlegmin3.pose.length; i++) {
        fill('yellow');
        strokeWeight(4);
        stroke(53);
        ellipse(round(leftlegmin3.pose[i].x), round(leftlegmin3.pose[i].y), 8, 8);
    }
}

function setvideo() {
    video = createVideo(videofile);
    video.id("test2");
    video.size(1280, 720);
    video.speed(0.1);
    video.volume(0);
    video.hide();
    started = true;
    video.play();
}

function endedwithnosave() {
    started = false;
    replaynose = false;
    var videotest2 = document.getElementById("test2");
    videoduration2 = videotest2.duration;
    videotest2.remove();
}

function drawheadwithvideo() {
    setvideo();
    video.onended(endedwithnosave);
    replaynose = true;
}

function endedwithnosavenoseleg() {
    started = false;
    replaynosewithleg = false;
    var videotest2 = document.getElementById("test2");
    videoduration2 = videotest2.duration;
    videotest2.remove();
}

function drawheadwithlegvideo() {
    setvideo();
    video.onended(endedwithnosavenoseleg);
    replaynosewithleg = true;
}

function endedwithnosavehip() {
    started = false;
    replaynosewithhip = false;
    var videotest2 = document.getElementById("test2");
    videoduration2 = videotest2.duration;
    videotest2.remove();
}

function drawheadwithhipvideo() {
    setvideo();
    video.onended(endedwithnosavehip);
    replaynosewithhip = true;
    nosewithhip();
    nosewithhip2();
}