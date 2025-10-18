import {
  MeetingConsumer,
  MeetingProvider,
  useMeeting,
  useParticipant,
  VideoPlayer,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./Api";
import "./App.css";
import { useEffect, useRef, useState } from "react";

function ParticipantView({ participantId }) {
  const micRef = useRef(null);
  const { micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("audioElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="participant-card">
      <p className="participant-name">
        {displayName}{" "}
        <span className="participant-type">
          {isLocal ? "(You)" : "(Remote)"}
        </span>
      </p>
      <div className="participant-status">
        <span>Webcam {webcamOn ? "ON" : "OFF"}</span>
        <span>Mic {micOn ? "ON" : "OFF"}</span>
      </div>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <div className="video-container">
          <VideoPlayer
            participantId={participantId}
            type="video"
            containerStyle={{ height: "240px", width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}

function Controls({
  targetMeetingId,
  targetMeetingToken,
  onRoomSwitched,
  relayActive,
  setRelayActive,
}) {
  const {
    leave,
    toggleMic,
    toggleWebcam,
    switchTo,
    requestMediaRelay,
    stopMediaRelay,
  } = useMeeting();

  const handleRelayRequest = () => {
    requestMediaRelay({
      destinationMeetingId: targetMeetingId,
      token: targetMeetingToken,
      kinds: ["audio", "video"],
    });
  };

  const handleStopRelay = () => {
    stopMediaRelay({ destinationMeetingId: targetMeetingId });
    setRelayActive(false);
  };

  const handleSwitchRoom = async () => {
    try {
      switchTo({
        meetingId: targetMeetingId,
        token: targetMeetingToken,
      });
      onRoomSwitched(targetMeetingId);
    } catch (error) {
      console.error("Error while switching:", error);
    }
  };

  return (
    <div className="controls">
      <button className="btn btn-red" onClick={() => leave()}>
        Leave
      </button>
      <button className="btn btn-blue" onClick={() => toggleMic()}>
        Toggle Mic
      </button>
      <button className="btn btn-blue" onClick={() => toggleWebcam()}>
        Toggle Webcam
      </button>
      <button className="btn btn-indigo" onClick={handleSwitchRoom}>
        Switch Room
      </button>
      <button
        className={`btn ${relayActive ? "btn-green-disabled" : "btn-green"}`}
        onClick={handleRelayRequest}
        disabled={relayActive}
      >
        {relayActive ? "Relay Active" : "Start Media Relay"}
      </button>
      {relayActive && (
        <button className="btn btn-gray" onClick={handleStopRelay}>
          Stop Relay
        </button>
      )}
    </div>
  );
}

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState("");

  const handleJoinMeeting = async () => {
    await getMeetingAndToken(meetingId);
  };

  return (
    <div className="join-screen">
      <div className="join-card">
        <h1>VideoSDK Meeting</h1>
        <input
          type="text"
          placeholder="Enter Meeting ID (optional)"
          onChange={(e) => setMeetingId(e.target.value)}
        />
        <div className="join-buttons">
          <button className="btn btn-indigo" onClick={handleJoinMeeting}>
            Join Meeting
          </button>
          <button className="btn btn-green" onClick={handleJoinMeeting}>
            Create Meeting
          </button>
        </div>
      </div>
    </div>
  );
}

function MeetingView({ meetingId, onMeetingLeave, onRoomSwitched }) {
  const [joined, setJoined] = useState(null);
  const [relayActive, setRelayActive] = useState(false);

  const ROOM_B_ID = "gutr-1vfk-opd4";
  const ROOM_B_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
  const { join, participants, localParticipant } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => onMeetingLeave(),
    onMediaRelayRequestReceived: ({ accept }) => {
      accept();
      setRelayActive(true);
    },
    onMediaRelayRequestResponse: ({ decision }) => {
      if (decision === "accepted") setRelayActive(true);
    },
    onMediaRelayStopped: () => setRelayActive(false),
  });

  useEffect(() => {
    setJoined("JOINING");
    join();
  }, []);

  const remoteParticipants = [...participants.keys()].filter(
    (id) => id !== localParticipant.id
  );

  return (
    <div className="meeting-container">
      <h2>
        Meeting ID: <span className="meeting-id">{meetingId}</span>
      </h2>
      {joined === "JOINED" ? (
        <>
          <Controls
            targetMeetingId={ROOM_B_ID}
            targetMeetingToken={ROOM_B_TOKEN}
            onRoomSwitched={onRoomSwitched}
            relayActive={relayActive}
            setRelayActive={setRelayActive}
          />
          <div className="participants-grid">
            <ParticipantView
              participantId={localParticipant.id}
              key={localParticipant.id}
            />
            {remoteParticipants.map((id) => (
              <ParticipantView key={id} participantId={id} />
            ))}
          </div>
        </>
      ) : (
        <p className="joining-text">Joining the meeting...</p>
      )}
    </div>
  );
}

function App() {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async (id) => {
    const meeting = id ? id : await createMeeting({ token: authToken });
    setMeetingId(meeting);
  };

  const onMeetingLeave = () => setMeetingId(null);
  const handleRoomSwitch = (newMeetingId) => setMeetingId(newMeetingId);

  return authToken && meetingId ? (
    <MeetingProvider
      key={meetingId}
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Adarsh Singh",
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <MeetingView
            meetingId={meetingId}
            onMeetingLeave={onMeetingLeave}
            onRoomSwitched={handleRoomSwitch}
          />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default App;
