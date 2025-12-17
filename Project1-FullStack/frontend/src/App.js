import React, { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('Loading...');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/api/data`)
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(() => setMsg('Backend not connected'));
  }, [API_URL]);

  return (
    <div style={{textAlign: 'center', marginTop: '50px'}}>
      <h1>PROJECT 1: REACT & NODE</h1>
      <h2 style={{color: 'blue'}}>{msg}</h2>
    </div>
  );
}
export default App;