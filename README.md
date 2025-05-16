# steps

1. add tanstack router
2. create a room with id on server when user submits initial form
3. config room with logic to only allow 2 participants
4. user A is one participant, should be added on room creation
5. metadata (owner username, owner socket id, owner language, partner language) should be store **somewhere**
6. return the room id to user a client and present a url via url in a modal or something
7. user b can scan this qr code, which will bring him to localhost:5173/join-room?roomId=<roomId from socket>