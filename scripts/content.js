let room;
let socket;
let triggeredByUser = true;
let video;

const SERVER_URL = "https://vidparty.glitch.me";
const PLAY = "PLAY";
const SEEKED = "SEEKED";
const PAUSE = "PAUSE";

(async () => {
  socket = io(SERVER_URL);
  socket.on(PLAY, () => {
    triggeredByUser = false;
    video.play();
  });
  socket.on(SEEKED, (time) => {
    triggeredByUser = false;
    video.currentTime = time;
  });
  socket.on(PAUSE, () => {
    triggeredByUser = false;
    video.pause();
  });
})();

// Callback function to execute when mutations are observed
const videoTracking = () => {
  video =
    document.getElementsByClassName("dplayer-video dplayer-video-current")[0] ??
    {};
  video.onplay = () => {
    triggeredByUser && socket?.emit(PLAY);
    triggeredByUser = true;
  };
  video.onseeked = () => {
    triggeredByUser && socket?.emit(SEEKED, video.currentTime);
    triggeredByUser = true;
  };
  video.onpause = () => {
    triggeredByUser && socket?.emit(PAUSE);
    triggeredByUser = true;
  };
};

window.addEventListener("load", async function () {
  // Select the node that will be observed for mutations
  const targetNode = document.getElementById("myplayer");
  // Options for the observer (which mutations to observe)
  const config = { childList: true };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(videoTracking);
  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  videoTracking();
});
