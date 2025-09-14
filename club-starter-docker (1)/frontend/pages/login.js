import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  async function doLogin(e){
    e.preventDefault();
    try {
      const r = await axios.post(`${process.env.NEXT_PUBLIC_API || 'http://localhost:4000'}/api/auth/login`, { email, password });
      localStorage.setItem('token', r.data.token);
      Router.push('/');
    } catch(e){
      alert('Login failed');
    }
  }
  return (
    <div style={{maxWidth:420, margin:'40px auto'}}>
      <h2>Login</h2>
      <form onSubmit={doLogin}>
        <div style={{marginBottom:8}}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div style={{marginBottom:8}}>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
