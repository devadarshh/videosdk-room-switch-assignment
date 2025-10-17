export const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI3YTQ3YTVhMS0wODczLTQ1NTQtODg4Ni01MDA2M2E4OTRhNGIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc2MDY3MjMzOSwiZXhwIjoxNzYxMjc3MTM5fQ.tTaB_5ucB5ieWO3drwxzr6z3zcew0gX7GSXlUUMgVcc";

export const createMeeting = async ({ token }) => {
  const response = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const { roomId } = await response.json();
  return roomId;
};
