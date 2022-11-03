
// get all elements
let s1 = document.getElementById('s1');
const s2 = document.getElementById('s2');
const mic_toggle = document.getElementById('mic-toggle');
const camera_toggle = document.getElementById('camera-toggle');
const create_offer = document.getElementById('create-offer');
const offer_sdp = document.getElementById('offer-sdp');
const answer_sdp = document.getElementById('answer-sdp');
const acreate_answer = document.getElementById('create-answer');
const add_answer_sdp = document.getElementById('add-answer-sdp');
const add_answer = document.getElementById('add-answer');




let peerConnection;
let localStream;
let remoteStream;


// iceServer sturn
let servers = {
        iceServers : [
            {
                urls : [ 'stun:stun1.1.google.com:19302','stun:stun2.1.google.com:19302']
            }

    ]


}

// create local stream
const localStreaminit = async () => {

    localStream = await navigator.mediaDevices.getUserMedia({ video : true, audio : true});
    s2.srcObject = localStream;

}

/// create offer
const createOffer = async () => {

    peerConnection = new RTCPeerConnection(servers);

    // get remote stream
    remoteStream = new MediaStream();
    s1.srcObject = remoteStream;
    localStream.getTracks().forEach( track => {

        peerConnection.addTrack( track, localStream)
        
    });


    peerConnection.ontrack = async ( event) => {

        event.streams[0].getTracks().forEach( track => {
            remoteStream.addTrack( track );
        })
    }


    // check ice candidate
    peerConnection.onicecandidate = async (event) => {

        if( event.candidate ){
            offer_sdp.value = JSON.stringify(peerConnection.localDescription);
        }

    }

    // create a offer
    let offer = await peerConnection.createOffer();
    offer_sdp.value = JSON.stringify(offer);
    await  peerConnection.setLocalDescription(offer)
}

// create answer
const createAnswer = async () => {

    peerConnection = new RTCPeerConnection(servers);

    // get remote stream
    remoteStream = new MediaStream();
    s1.srcObject = remoteStream;

    localStream.getTracks().forEach( track => {

        peerConnection.addTrack( track, localStream)
        
    });


    peerConnection.ontrack = async ( event) => {

        event.streams[0].getTracks().forEach( track => {
            remoteStream.addTrack( track );
        })
    }


    // check ice candidate
    peerConnection.onicecandidate = async (event) => {

        if( event.candidate ){
            offer_sdp.value = JSON.stringify(peerConnection.localDescription);
        }

    }


    // rechive offer
    let offer = offer_sdp.value;
    offer = JSON.parse(offer)
    await  peerConnection.setRemoteDescription(offer)


    // create a answer
    let answer = await peerConnection.createAnswer();
    answer_sdp.value = JSON.stringify(answer);
    await peerConnection.setLocalDescription(answer)
}

// add Answer
const addAnswer = async () => {

    let answer = add_answer_sdp.value;
    answer = JSON.parse(answer);
    await peerConnection.setRemoteDescription(answer)

}

localStreaminit()

// offer create button
acreate_answer.onclick = () => {
    createAnswer()
}
// offer create button
create_offer.onclick = () => {
    createOffer()
}
// offer create button
add_answer.onclick = () => {
    addAnswer()
}





    

// camera toggle
let cameraStatus = true;
camera_toggle.onclick = () => {
    cameraStatus = !cameraStatus;
    localStream.getVideoTracks()[0].enabled = cameraStatus;
    camera_toggle.classList.toggle('active')
}

// audio toggle
let audioStatus = false;
mic_toggle.onclick = () => {
    audioStatus = !audioStatus;
    localStream.getAudioTracks()[0].enabled = audioStatus;
    mic_toggle.classList.toggle('active')
}