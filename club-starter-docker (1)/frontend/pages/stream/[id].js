import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socket;

export default function StreamPage(){
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef();

  useEffect(()=> {
    socket = io(process.env.NEXT_PUBLIC_API || 'http://localhost:4000'.replace('/api',''));
    const roomId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'room';

    socket.on('connect', ()=> {
      socket.emit('join-room', { roomId, userId: socket.id });
    });

    socket.on('signal', async ({ from, data })=>{
      if(!pcRef.current) await createPeerConnection();
      if(data.sdp){
        await pcRef.current.setRemoteDescription(data.sdp);
        if(data.sdp.type === 'offer'){
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          socket.emit('signal', { toSocketId: from, data: { sdp: pcRef.current.localDescription }});
        }
      } else if(data.candidate){
        try { await pcRef.current.addIceCandidate(data.candidate); } catch(e) {}
      }
    });

    async function createPeerConnection(){
      pcRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      pcRef.current.onicecandidate = (e) => {
        if(e.candidate) socket.emit('signal', { toSocketId: null, data: { candidate: e.candidate }});
      };
      pcRef.current.ontrack = (e) => {
        if(remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
      };
      const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
      if(localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));
    }

    window.startCall = async () => {
      await createPeerConnection();
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socket.emit('signal', { toSocketId: null, data: { sdp: pcRef.current.localDescription }});
    };

    return ()=> socket.disconnect();
  },[]);

  return (
    <div style={{padding:20}}>
      <h2>Stream room</h2>
      <div style={{display:'flex',gap:12}}>
        <video ref={localVideoRef} autoPlay muted playsInline style={{width:'50%',background:'#000'}} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{width:'50%',background:'#000'}} />
      </div>
      <div style={{marginTop:12}}>
        <button onClick={()=> window.startCall()}>Start / Publish</button>
      </div>
    </div>
  );
}
