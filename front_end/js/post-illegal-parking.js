var postId = 1;
var postQueue = [];
document.getElementById("edit-button").addEventListener("click", clickEditButton);
document.getElementById("post-button").addEventListener("click", clickPostButton);
document.getElementById("cancel-button").addEventListener("click", clickCancelButton);
document.getElementById("upload-background").addEventListener("click", clickUploadBackground);

function clickEditButton(event) {
    document.getElementById("use-camera").click();
    getLocation();
}

function clickCancelButton(event) {
    event.preventDefault();
    stopTracks();
    setPostSectionDisplay("none");
    setWebPageDisplay("block");
    setFixedButton("inline-block");
    clearValue();
}

function clickPostButton(event) {
    event.preventDefault();
    if (mediaStreamTrack) {
        mediaStreamTrack.stop();
    }
    postQueue.push(postId);
    // uploadImage(imageBlob);
    transfromImage(imageBlob);
    setPostSpinnerDisplay("inline");
    setPostSectionDisplay("none");
}

function clickUploadBackground(event) {
    setPostSpinnerDisplay("none");
    setWebPageDisplay("block");
    setFixedButton("inline-block");
    clearValue();
    postId++;
}

function setPostSpinnerDisplay(state) {
    document.getElementById("post-spinner").style.display = state;
}

function setPostSectionDisplay(state) {
    var section = document.getElementById("post-illegal-parking");
    if ($(window).width() < 800) {
        section.style.top = "10vh";
    }
    section.style.display = state;
    document.getElementById("loading-text").style.display = state;
    document.getElementById("loader").style.display = state;
}

function setWebPageDisplay(state) {
    document.getElementById("rank").style.display = state;
    document.getElementById("illegal-parking").style.display = state;
    document.getElementById("intro").style.display = state;
    document.getElementById("alternative-section").style.display = state;
    document.getElementsByTagName("footer")[0].style.display = state;
    document.getElementsByTagName("nav")[0].style.display = state;
}

function setFixedButton(state) {
    document.getElementById("edit-button").style.display = state;
    document.getElementById("publish-button").style.display = state;
}

function postSuccess(result) {
    if (postId == postQueue[0]) {
        setPostSpinnerDisplay("none");
        setWebPageDisplay("block");
        setFixedButton("inline-block");
        clearValue();
    }
    console.log("post success: ", result);
    window.alert("You have successfully posted.");
    postQueue.shift();
}

function postError(error) {
    if (postId == postQueue[0]) {
        setPostSpinnerDisplay("none");
        setWebPageDisplay("block");
        setFixedButton("inline-block");
        clearValue();
    }
    window.alert("You have unsuccessfully posted. Please retry it.");
    onError("post error: ", error);
    postQueue.shift();
}

function sendPost(imageData) {
    var location = getLonAndLat();
    $.ajax(
        {
            method: "POST",
            url: "/report_illegal",
            data: {
                location: parseToWord($("#upload-location").val()),
                name: $("#account-name").val(),
                picture: imageData,
                car_num: $("#upload-car-num").val(),
                longitude: location[0],
                latitude: location[1]
            },
            success: postSuccess,
            error: postError
        }
    );
}

function clearValue() {
    document.querySelector("#camera-video").src = "";
    document.querySelector("#upload-car-num").value = "";
    document.querySelector("#upload-picture-img").src = "";
}

function onError(error) {
    console.log(error);
    window.alert(error);
}