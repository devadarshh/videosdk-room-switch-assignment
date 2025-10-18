export const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJjMmViNmNjOC0yZTk2LTRmZDItYTk4Mi0zZjhmMmIyMzVhZGQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc2MDcxNDg1OSwiZXhwIjoxNzYxMzE5NjU5fQ.DGSQteeeFKMTpHDEYuIvhL3-LGa3jVMfq4L99n8qpek";

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
