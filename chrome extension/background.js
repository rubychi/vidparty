let room;

// Create a room for the user
(async () => {
  const res = await fetch("https://random-data-api.com/api/v2/beers");
  ({ style: room } = await res.json());
})();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // If the user is an invitee, use the assigned room instead
  if (message.room) {
    room = message.room;
  }
  sendResponse(room);
});
