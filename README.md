# Vidparty

A chrome extension that mimics Teleparty to watch the online video together

## Demo

![Sep-18-2023 23-08-37](https://github.com/rubychi/vidparty/assets/18576075/58a71b24-1921-4b7c-923c-a2848ef49a4a)

## Features

- Synchronize play
- Synchronize pause
- Synchronize seek

### Currently support platforms:
- [DramasQ](https://dramasq.one/)

## Getting Started

Follow the instructions below to set up the environment and run this project on your local machine

### Prerequisites

* Chrome browser
* Node.js

### Installing

1. Download ZIP or clone this repo
```
> git clone https://github.com/rubychi/vidparty.git
```

2. Open Chrome and browse `chrome://extensions`

3. Switch on the developer mode

4. Click `Load unpacked` and select `/chrome extension` to load `Vidparty`

### Running the app

1. Install dependencies in `/server`
```
> npm install
```

2. Start the server
```
> npm start
```

3. Select a video from `https://dramasq.one`

4. Copy & paste the link in another tab
   
5. Watch videos play/pause/seek synchronously

## Built With

### Frontend

* socket.io

### Backend

* express
* node-fetch
* socket.io
* uuid
