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
                alert("Register");
                //redirect

            }).catch(function (error) {
                alert("NO");
                console.log(error)
            });
        }
    });
}



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
                alert("Yes");
                //redirect
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
    window.location.href = "index.html";
}

function uploadfile() {
    //get elements
    var uploader = document.getElementById("uploader");
    var fileButton = document.getElementById("fileButton");

    //get file
    var file = fileButton.files[0];

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
            alert("completed");
        });
}
