import { useState } from 'react';
import socket from '../socket';

export default function Join({ onJoined }) {
  const [mode, setMode] = useState(null); // null | 'student' | 'instructor'
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createRoom = () => {
    setLoading(true);
    setError('');
    socket.emit('create-room', null, (res) => {
      setLoading(false);
      if (res?.code) {
        onJoined('instructor');
      } else {
        setError('Failed to create room');
      }
    });
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setError('Enter a room code and your name');
      return;
    }
    setLoading(true);
    setError('');
    socket.emit('join-room', { code: code.trim().toUpperCase(), name: name.trim() }, (res) => {
      setLoading(false);
      if (res?.error) {
        setError(res.error);
      } else {
        onJoined('student', name.trim());
      }
    });
  };

  if (!mode) {
    return (
      <div className="join-screen">
        <div className="join-hero">
          <h1>Real Options</h1>
          <p className="subtitle">A venture investment game</p>
        </div>
        <div className="join-choices">
          <button className="join-choice" onClick={() => setMode('instructor')}>
            <span className="choice-label">Create Game</span>
            <span className="choice-desc">Start a new session as instructor</span>
          </button>
          <button className="join-choice" onClick={() => setMode('student')}>
            <span className="choice-label">Join Game</span>
            <span className="choice-desc">Enter a room code to play</span>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'instructor') {
    return (
      <div className="join-screen">
        <div className="join-hero">
          <h1>Real Options</h1>
          <p className="subtitle">Instructor Setup</p>
        </div>
        <div className="join-form-wrap">
          <button className="btn-primary btn-lg" onClick={createRoom} disabled={loading}>
            {loading ? 'Creating...' : 'Create Room'}
          </button>
          {error && <p className="error-text">{error}</p>}
          <button className="btn-ghost" onClick={() => { setMode(null); setError(''); }}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="join-screen">
      <div className="join-hero">
        <h1>Real Options</h1>
        <p className="subtitle">Join a game</p>
      </div>
      <form className="join-form-wrap" onSubmit={joinRoom}>
        <input
          className="input-field code-input"
          type="text"
          placeholder="Room Code"
          maxLength={4}
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          autoFocus
        />
        <input
          className="input-field"
          type="text"
          placeholder="Your Name"
          maxLength={20}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button className="btn-primary btn-lg" type="submit" disabled={loading}>
          {loading ? 'Joining...' : 'Join'}
        </button>
        {error && <p className="error-text">{error}</p>}
        <button className="btn-ghost" type="button" onClick={() => { setMode(null); setError(''); }}>Back</button>
      </form>
    </div>
  );
}
