const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 10000 });
const rooms = new Map();
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const clean = (s, n=20) => String(s ?? '').replace(/[<>\r\n]/g,'').trim().slice(0,n);
const spawn = () => ({x:0,y:0,z:9,rot:0});
const codeGen = () => {let s; do {s=String(Math.floor(100000+Math.random()*900000));} while(rooms.has(s)); return s;};
app.get('/',(_,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/health',(_,res)=>res.json({ok:true,rooms:rooms.size}));
io.on('connection',socket=>{
  let code = null;
  const reply = (event,data)=>socket.emit(event,data);
  function join(roomCode,name){
    const room=rooms.get(roomCode);
    if(!room) return reply('errorMessage','방을 찾을 수 없습니다.');
    if(room.players.size>=8) return reply('errorMessage','방이 가득 찼습니다.');
    if(code) leave();
    code=roomCode; socket.join(code);
    const p={id:socket.id,name:clean(name,16)||'PRISONER',...spawn(),hp:100,downUntil:0,color:room.players.size%8};
    room.players.set(socket.id,p);
    reply('joined',{code,id:socket.id,players:[...room.players.values()]});
    socket.to(code).emit('playerJoined',p);
  }
  function leave(){
    if(!code)return;
    const old=code; const room=rooms.get(old);
    if(room){room.players.delete(socket.id);socket.to(old).emit('playerLeft',socket.id);if(room.players.size===0)rooms.delete(old);}
    socket.leave(old);code=null;
  }
  socket.on('createRoom',({name}={})=>{const c=codeGen();rooms.set(c,{players:new Map()});join(c,name);});
  socket.on('joinRoom',({code:requested,name}={})=>join(clean(requested,6),name));
  socket.on('move',state=>{
    const p=rooms.get(code)?.players.get(socket.id);if(!p||!state)return;
    const x=Number(state.x),y=Number(state.y),z=Number(state.z),rot=Number(state.rot);
    if(![x,y,z,rot].every(Number.isFinite))return;
    // Prototype bounds and speed checks; future stages use server-authoritative movement.
    if(Math.abs(x)>60||Math.abs(z)>60||y<-.1||y>8)return;
    const dx=x-p.x,dz=z-p.z;
    if(Math.hypot(dx,dz)>2.4)return;
    Object.assign(p,{x,y,z,rot});
    socket.to(code).emit('playerMoved',{id:socket.id,x,y,z,rot});
  });
  socket.on('punch',()=>{
    const room=rooms.get(code),attacker=room?.players.get(socket.id);if(!attacker)return;
    const now=Date.now();if(attacker.lastPunch&&now-attacker.lastPunch<450)return;
    attacker.lastPunch=now;
    let hit=null,dist=2.3;
    for(const target of room.players.values()){
      if(target.id===socket.id)continue;
      const dx=target.x-attacker.x,dz=target.z-attacker.z,d=Math.hypot(dx,dz);
      const facing=-dx*Math.sin(attacker.rot)-dz*Math.cos(attacker.rot);
      if(d<dist&&facing>0.15){dist=d;hit=target;}
    }
    if(hit){hit.hp=Math.max(0,hit.hp-20);hit.downUntil=now+1100;io.to(code).emit('hit',{id:hit.id,hp:hit.hp,until:hit.downUntil});if(hit.hp===0){hit.hp=100;setTimeout(()=>{if(room.players.has(hit.id)){Object.assign(hit,spawn());io.to(code).emit('respawn',{id:hit.id,...spawn(),hp:100});}},1200);}}
    io.to(code).emit('punchEffect',{id:socket.id});
  });
  socket.on('chat',message=>{const p=rooms.get(code)?.players.get(socket.id);if(!p)return;const msg=clean(message,140);if(msg)io.to(code).emit('chat',{name:p.name,message:msg});});
  socket.on('disconnect',leave);
});
server.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('IDIOT ESCAPE server ready'));
