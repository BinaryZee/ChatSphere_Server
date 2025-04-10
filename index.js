import { WebSocketServer } from "ws";

const port = 8080
const wss = new WebSocketServer({ port });
const rooms = [

]

wss.on("connection", function connection(ws) {
    
    ws.on("error", console.error);
    ws.on("message", function message(data) {
        let d = data.toString();
        const dobj = JSON.parse(d);
        if(dobj.purpose === "create_room"){
            let roomCode = dobj.roomCode;
            let roomIndex = rooms.findIndex(room => room.code === roomCode);
            if(roomIndex === -1){
                rooms.push({code:roomCode,clients:[ws],pass:dobj.pass});
                ws.send(JSON.stringify({Response:"your room is created"}))
            }
            else{
                ws.send(JSON.stringify({Response:"try a new code!!"}))
            }
        }
        if(dobj.purpose === "join_room"){
            let roomCode = dobj.roomCode;
            let roomIndex = rooms.findIndex(room => room.code === roomCode);
            if(roomIndex === -1){
                ws.send(JSON.stringify({Response:"room does not exist"}))
            }
            else{
                let room = rooms[roomIndex]
                if(room.pass === dobj.pass){
                    room.clients.push(ws)
                    ws.send(JSON.stringify({Response:"your joined a room"}))
                }
                else{
                    ws.send(JSON.stringify({Response:"wrong password"}))
                }
                
                
            }
        }
        if(dobj.purpose === "chat"){
            let roomCode = dobj.roomCode;
            let clientName = dobj.cn
            let message = dobj.message
            let roomIndex = rooms.findIndex(room => room.code === roomCode);
            let clients = rooms[roomIndex].clients;
            clients.forEach(client => {
                if(client != ws){
                    client.send(JSON.stringify({Response:"chat",message:message,by:clientName}))
                }
            });
        }
        
    });
});

