//server
import {Server} from "socket.io"
const io = new Server(process.env.PORT || 8888)
const room = []
const msg = []
io.on("connection",(socket) => {
  console.log("new user connected.")
  socket.on("join",(roomid,data) =>{

  })
  socket.on("create",(roomName,data)=>{
    room.push(roomName)
    socket.join(roomName)
    console.log(data.username + " create "+roomName)
    socket.emit("start",roomName)
  })
  socket.on("send",(input,data,roomid)=>{
    console.log("received msg from "+data.username+" on "+roomid)
    msg.push({
      msg:""+data.username+" > "+input,
      room: roomid,
    })
    io.to(roomid).emit("received",""+data.username+" > "+input)
  })
  socket.on("getsession",(roomid,userData)=>{
    let data = msg.filter(e => e.room == roomid)
    if(data.length != 0){
      socket.join(roomid)
      socket.emit("writeSession",data)
      //console.log(data)
    }else{
      let cek = room.find(e => e == roomid)
      if(!cek){
        socket.emit("error","rooom id not found")
      }else{
        //console.log("user "+data.username+" join to "+cek)
        socket.join(cek)
        socket.emit("start",cek)
      }
    }
  })
})
