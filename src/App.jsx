import { useState, useEffect, useCallback } from 'react';
import socket from './socket';
import Join from './components/Join';
import Student from './components/Student';
import Instructor from './components/Instructor';

export default function App() {
  const [view, setView] = useState('join'); // join | student | instructor
  const [gameState, setGameState] = useState(null);
  const [roundResults, setRoundResults] = useState(null);
  const [debriefData, setDebriefData] = useState(null);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    socket.connect();

    socket.on('game-state', (state) => {
      setGameState(state);
    });

    socket.on('round-results', (results) => {
      setRoundResults(results);
    });

    socket.on('premium-update', (data) => {
      setGameState(prev => {
        if (!prev) return prev;
        const ventures = prev.ventures.map(v => {
          const update = data.ventures.find(u => u.id === v.id);
          return update ? { ...v, premium: update.premium } : v;
        });
        return { ...prev, ventures };
      });
    });

    socket.on('debrief', (data) => {
      setDebriefData(data);
    });

    return () => {
      socket.off('game-state');
      socket.off('round-results');
      socket.off('premium-update');
      socket.off('debrief');
    };
  }, []);

  const handleJoined = useCallback((role, name) => {
    setView(role);
    if (name) setPlayerName(name);
  }, []);

  const clearRoundResults = useCallback(() => setRoundResults(null), []);
  const clearDebrief = useCallback(() => setDebriefData(null), []);

  if (view === 'join' || !gameState) {
    return <Join onJoined={handleJoined} />;
  }

  if (view === 'instructor') {
    return (
      <Instructor
        state={gameState}
        roundResults={roundResults}
        debriefData={debriefData}
        clearRoundResults={clearRoundResults}
      />
    );
  }

  return (
    <Student
      state={gameState}
      playerName={playerName}
      roundResults={roundResults}
      debriefData={debriefData}
      clearRoundResults={clearRoundResults}
    />
  );
}
