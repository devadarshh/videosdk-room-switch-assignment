import { MeetingProvider } from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./Api";
import "./App.css";
import { useState } from "react";

function ParticipantView(props) {
  return null;
}

function Controls(props) {
  return null;
}

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState(null);
  const handleJoinMeeting = async () => {
    await getMeetingAndToken(meetingId);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={handleJoinMeeting}>Join</button>
      {"or"}
      <button onClick={handleJoinMeeting}>Create Meeting</button>
    </div>
  );
}

function MeetingView(props) {
  return null;
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
  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Adarsh Singh",
      }}
      token={authToken}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default App;
