let socket;
// An additional flag is required to distinguish user events from the socket emitted events
let triggeredByUser = true;
let video;

const SERVER_URL = "https://vidparty.glitch.me";
const PLAY = "PLAY";
const SEEKED = "SEEKED";
const PAUSE = "PAUSE";

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

const initSocket = (room) => {
  socket = io(SERVER_URL, { query: { room } });
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
};

const updateUrl = (room) =>
  window.history.pushState(
    "",
    "",
    `${window.location.href.split("?")[0]}?room=${room}`
  );

const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get((result) => {
      result[key] === undefined ? reject() : resolve(result[key]);
    });
  });
};

const getRoom = async () => {
  // Check the room query param to see if the user is an invitee
  const urlParams = new URLSearchParams(window.location.search);
  let room = urlParams.get("room") ?? (await readLocalStorage("room"));

  if (!room) {
    const res = await fetch("https://random-data-api.com/api/v2/beers");
    ({ style: room } = await res.json());
    chrome.storage.local.set({ room });
  }
  return room;
};

window.onload = async () => {
  // Select the node that will be observed for mutations
  const targetNode = document.getElementById("myplayer");
  if (!targetNode) return;

  const room = await getRoom();
  initSocket(room);
  updateUrl(room);

  // Options for the observer (which mutations to observe)
  const config = { childList: true };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(videoTracking);
  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  videoTracking();
};
