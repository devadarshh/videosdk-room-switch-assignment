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
    <div>
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <VideoPlayer
          participantId={participantId}
          type="video"
          containerStyle={{ height: "300px", width: "300px" }}
          className="h-full"
          classNameVideo="h-full"
        />
      )}
    </div>
  );
}

function Controls({ newMeetingId, newMeetingToken, onRoomSwitched }) {
  const { leave, toggleMic, toggleWebcam, switchTo } = useMeeting();

  const handleSwitchRoom = async () => {
    console.log("🌀 Attempting to switch to new room...");
    console.log("➡️ New Meeting ID:", newMeetingId);
    console.log("🔑 Token Provided:", newMeetingToken ? "Yes" : "No");

    try {
      switchTo({
        meetingId: newMeetingId,
        token: newMeetingToken,
      });
      console.log("✅ Successfully switched to meeting:", newMeetingId);
      onRoomSwitched(newMeetingId);
    } catch (error) {
      console.error("❌ Error while switching to new meeting:", error);
    }
  };

  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      <button onClick={() => toggleMic()}>Toggle Mic</button>
      <button onClick={() => toggleWebcam()}>Toggle Webcam</button>
      <button onClick={handleSwitchRoom}>Switch Room</button>
    </div>
  );
}

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState(null);

  const handleJoinMeeting = async () => {
    console.log(
      "🟢 Joining or creating meeting with ID:",
      meetingId || "(new)"
    );
    await getMeetingAndToken(meetingId);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => setMeetingId(e.target.value)}
      />
      <button onClick={handleJoinMeeting}>Join</button>
      {" or "}
      <button onClick={handleJoinMeeting}>Create Meeting</button>
    </div>
  );
}

function MeetingView({ meetingId, onMeetingLeave, onRoomSwitched }) {
  const [joined, setJoined] = useState(null);

  const { join, participants, localParticipant } = useMeeting({
    onMeetingJoined: () => {
      console.log("✅ Successfully joined meeting:", meetingId);
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      console.log("👋 Left meeting:", meetingId);
      onMeetingLeave();
    },
  });

  useEffect(() => {
    setJoined("JOINING");
    join();
  }, []);

  const ROOM_B_ID = "5hpm-sohx-dlwe";
  const ROOM_B_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI3YTQ3YTVhMS0wODczLTQ1NTQtODg4Ni01MDA2M2E4OTRhNGIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc2MDY3MjMzOSwiZXhwIjoxNzYxMjc3MTM5fQ.tTaB_5ucB5ieWO3drwxzr6z3zcew0gX7GSXlUUMgVcc";

  const remoteParticipants = [...participants.keys()].filter(
    (participantId) => {
      return participantId !== localParticipant.id;
    }
  );

  return (
    <div className="container">
      <h3>Meeting Id: {meetingId}</h3>
      {joined === "JOINED" ? (
        <div>
          <Controls
            newMeetingId={ROOM_B_ID}
            newMeetingToken={ROOM_B_TOKEN}
            onRoomSwitched={onRoomSwitched}
          />

          <ParticipantView
            participantId={localParticipant.id}
            key={localParticipant.id}
          />

          {remoteParticipants.map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : (
        <p>Joining the meeting...</p>
      )}
    </div>
  );
}

function App() {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  const handleRoomSwitch = (newMeetingId) => {
    setMeetingId(newMeetingId);
  };

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
