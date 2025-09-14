import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home(){
  const [streams, setStreams] = useState([]);
  useEffect(()=>{
    axios.get(`${process.env.NEXT_PUBLIC_API || 'http://localhost:4000'}/api/content/streams`)
      .then(r=>setStreams(r.data)).catch(()=>{});
  },[]);
  return (
   <div style={{maxWidth:800, margin:'0 auto', padding:20}}>
     <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
       <h1 style={{fontSize:24,fontWeight:700}}>Club — Live</h1>
       <Link href="/login"><a>Login</a></Link>
     </header>

     <section style={{marginTop:20}}>
      {streams.map(s=>(
        <article key={s._id} style={{border:'1px solid #eee',padding:12,borderRadius:8,marginBottom:8}}>
          <h2 style={{fontSize:16,fontWeight:600}}>{s.title}</h2>
          <p>Performer: {s.performer?.username}</p>
          <Link href={`/stream/${s._id}`}><a style={{color:'#2563eb'}}>Join</a></Link>
        </article>
      ))}
     </section>
   </div>
  );
}
