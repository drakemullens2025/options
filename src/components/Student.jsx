import { useState, useEffect, useCallback } from 'react';
import socket from '../socket';

function fmt(n) {
  if (Math.abs(n) >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return '$' + (n / 1_000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
  return '$' + n.toLocaleString();
}

function fmtPrice(n) {
  return '$' + Number(n).toFixed(2);
}

function Sparkline({ history, width = 80, height = 28 }) {
  if (!history || history.length < 2) return null;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const up = history[history.length - 1] >= history[0];
  return (
    <svg width={width} height={height} className="sparkline">
      <polyline points={pts} fill="none" stroke={up ? 'var(--color-success)' : 'var(--color-danger)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Timer({ endTime }) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (!endTime) { setRemaining(0); return; }
    const tick = () => setRemaining(Math.max(0, endTime - Date.now()));
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [endTime]);
  const secs = Math.ceil(remaining / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return (
    <div className={`timer ${secs <= 30 ? 'timer-urgent' : secs <= 60 ? 'timer-warm' : ''}`}>
      {m}:{s.toString().padStart(2, '0')}
    </div>
  );
}

function MetricsGrid({ metrics }) {
  if (!metrics?.length) return null;
  return (
    <div className="metrics-grid">
      {metrics.map((m, i) => (
        <div key={i} className="metric-item">
          <span className="metric-label">{m.label}</span>
          <span className="metric-value">{m.value}</span>
        </div>
      ))}
    </div>
  );
}

function VentureCard({ venture, phase, playerCash, playerOptions, playerEquity, onBuy, onUndo, roundActive }) {
  const [expanded, setExpanded] = useState(false);
  const [showOutlook, setShowOutlook] = useState(false);
  const [flash, setFlash] = useState(false);

  const position = playerOptions.find(o => o.ventureId === venture.id);
  const contracts = position?.contracts || 0;
  const avgCost = position?.premiumPerContract || 0;
  const undoable = position?.thisRoundQty || 0;

  const equityPos = playerEquity.find(e => e.ventureId === venture.id);
  const equityShares = equityPos?.shares || 0;
  const equityInvested = equityPos?.amount || 0;
  const equityValue = equityShares * venture.sharePrice;

  const posValue = contracts * venture.premium;
  const posCost = contracts * avgCost;
  const posPnl = posValue - posCost;

  const isUp = venture.priceChange >= 0;
  const isItm = venture.sharePrice > venture.strikePrice;

  const buyContracts = [1, 5, 10, 25];

  const handleBuy = (n) => {
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
    onBuy(venture.id, n);
  };

  return (
    <div className={`venture-card ${flash ? 'venture-flash' : ''}`}>
      <div className="venture-header" onClick={() => setExpanded(!expanded)}>
        <div>
          <h3 className="venture-name">{venture.name}</h3>
          <p className="venture-tagline">{venture.tagline}</p>
        </div>
        <div className="venture-pricing">
          <span className="share-price">{fmtPrice(venture.sharePrice)}</span>
          {venture.priceHistory.length > 1 && (
            <span className={`val-change ${isUp ? 'up' : 'down'}`}>
              {isUp ? '+' : ''}{venture.priceChange}%
            </span>
          )}
          <Sparkline history={venture.priceHistory} />
        </div>
      </div>

      {expanded && (
        <div className="venture-expanded">
          <p className="venture-pitch">{venture.pitch}</p>
          <button className="btn-text" onClick={(e) => { e.stopPropagation(); setShowOutlook(!showOutlook); }}>
            {showOutlook ? 'Hide' : 'Show'} Industry Outlook
          </button>
          {showOutlook && <p className="venture-outlook">{venture.industryOutlook}</p>}
        </div>
      )}

      {venture.roundNarrative && (
        <div className="round-narrative">
          <p>{venture.roundNarrative}</p>
        </div>
      )}

      <MetricsGrid metrics={venture.metrics} />

      {roundActive && (
        <div className="venture-trading">
          <div className="option-info">
            <div className="option-info-row">
              <span className="option-label">Option Premium</span>
              <span className="option-premium">{fmt(venture.premium)}<span className="per-contract"> / contract</span></span>
            </div>
            <div className="option-info-row">
              <span className="option-detail">Strike: {fmtPrice(venture.strikePrice)}</span>
              <span className={`option-detail ${isItm ? 'itm' : 'otm'}`}>
                {isItm ? 'In the Money' : 'Out of the Money'}
              </span>
            </div>
            <div className="option-info-row">
              <span className="option-detail">1 contract = 100 shares at strike</span>
            </div>
          </div>

          <div className="buy-section">
            <span className="section-label">Buy Options</span>
            <div className="buy-buttons">
              {buyContracts.map(n => (
                <button key={n} className="btn-buy" disabled={venture.premium * n > playerCash}
                  onClick={() => handleBuy(n)}>
                  {n}x <span className="buy-cost">{fmt(venture.premium * n)}</span>
                </button>
              ))}
            </div>
          </div>

          {phase === 2 && (
            <div className="buy-section equity-section">
              <span className="section-label">Buy Equity</span>
              <div className="buy-buttons">
                {[2000, 5000, 10000, 25000].map(a => (
                  <button key={a} className="btn-buy btn-buy-equity" disabled={a > playerCash}
                    onClick={() => {
                      setFlash(true);
                      setTimeout(() => setFlash(false), 500);
                      socket.emit('buy-equity', { ventureId: venture.id, amount: a }, (r) => r?.error && console.warn(r.error));
                    }}>
                    {fmt(a)} <span className="buy-cost">{(a / venture.sharePrice).toFixed(0)} shares</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(contracts > 0 || equityShares > 0) && (
        <div className="positions">
          {contracts > 0 && (
            <div className="position-row">
              <div className="position-info">
                <span className="position-label">Options: {contracts} contracts</span>
                <span className="position-detail">
                  Avg Cost: {fmt(avgCost)} | Value: {fmt(posValue)}
                </span>
                <span className={`position-pnl ${posPnl >= 0 ? 'up' : 'down'}`}>
                  P&L: {posPnl >= 0 ? '+' : ''}{fmt(posPnl)} ({posCost > 0 ? (posPnl / posCost * 100).toFixed(0) : 0}%)
                </span>
              </div>
              {roundActive && undoable > 0 && (
                <div className="sell-buttons">
                  <button className="btn-undo" onClick={() => onUndo(venture.id)}>
                    Undo ({undoable} this round)
                  </button>
                </div>
              )}
            </div>
          )}
          {equityShares > 0 && (
            <div className="position-row equity-pos">
              <div className="position-info">
                <span className="position-label">Equity: {equityShares.toFixed(1)} shares</span>
                <span className="position-detail">
                  Invested: {fmt(equityInvested)} | Value: {fmt(Math.round(equityValue))}
                </span>
                <span className={`position-pnl ${equityValue >= equityInvested ? 'up' : 'down'}`}>
                  P&L: {equityValue >= equityInvested ? '+' : ''}{fmt(Math.round(equityValue - equityInvested))}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RoundResults({ results, onDismiss }) {
  if (!results) return null;
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Round {results.round} Results</h2>
        <div className="results-ventures">
          {results.ventures.map(v => (
            <div key={v.ventureId} className="result-item">
              <div className="result-header">
                <span className="result-venture-name">{v.name}</span>
                <span className={`result-change ${v.change >= 0 ? 'up' : 'down'}`}>
                  {v.change >= 0 ? '+' : ''}{v.change}%
                </span>
              </div>
              <div className="result-prices">
                {fmtPrice(v.oldPrice)} &rarr; {fmtPrice(v.newPrice)}
              </div>
              <p className="result-narrative">{v.narrative}</p>
              <MetricsGrid metrics={v.metrics} />
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={onDismiss}>Continue</button>
      </div>
    </div>
  );
}

function DebriefView({ data, playerName }) {
  if (!data) return null;
  const myResults = data.phaseResults?.[playerName];

  return (
    <div className="debrief-student">
      <h2>Phase {data.phase} Results</h2>

      {myResults && (
        <div className="debrief-section debrief-personal">
          <h3>Your Settlement</h3>
          {myResults.details?.length > 0 && (
            <div className="settlement-list">
              {myResults.details.map((d, i) => (
                <div key={i} className={`settlement-item ${d.action}`}>
                  <span className="settlement-name">{d.name}</span>
                  <span className="settlement-detail">{d.contracts} contracts</span>
                  <span className="settlement-action">{d.action === 'exercised' ? 'Exercised' : 'Expired Worthless'}</span>
                  <span className={`settlement-pnl ${d.payout > d.cost ? 'up' : 'down'}`}>
                    Cost: {fmt(d.cost)} &rarr; Payout: {fmt(d.payout)}
                  </span>
                </div>
              ))}
            </div>
          )}
          {myResults.equityDetails?.length > 0 && (
            <div className="settlement-list">
              <h4>Equity Positions</h4>
              {myResults.equityDetails.map((d, i) => (
                <div key={i} className="settlement-item">
                  <span className="settlement-name">{d.name}</span>
                  <span className="settlement-detail">{d.shares.toFixed(1)} shares</span>
                  <span className={`settlement-pnl ${d.value >= d.invested ? 'up' : 'down'}`}>
                    Invested: {fmt(d.invested)} &rarr; Value: {fmt(d.value)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="settlement-total">
            Final Cash: <strong>{fmt(myResults.finalCash)}</strong>
          </div>
        </div>
      )}

      <div className="debrief-section">
        <h3>Venture Outcomes</h3>
        {data.ventures.map(v => (
          <div key={v.id} className="debrief-venture">
            <div className="debrief-venture-header">
              <span className="venture-name">{v.name}</span>
              <span className={`val-change ${v.totalReturn >= 0 ? 'up' : 'down'}`}>
                {v.totalReturn >= 0 ? '+' : ''}{v.totalReturn}%
              </span>
            </div>
            <div className="debrief-venture-vals">
              {fmtPrice(v.startPrice)} &rarr; {fmtPrice(v.endPrice)}
            </div>
            <Sparkline history={v.history} width={120} height={32} />
            <MetricsGrid metrics={v.metrics} />
          </div>
        ))}
      </div>

      <div className="debrief-section">
        <h3>Leaderboard</h3>
        <div className="leaderboard">
          {data.leaderboard.map((e, i) => (
            <div key={i} className={`lb-entry ${i < 3 ? 'lb-top' : ''} ${e.name === playerName ? 'lb-you' : ''}`}>
              <span className="lb-rank">{i + 1}</span>
              <span className="lb-name">{e.name}{e.name === playerName ? ' (you)' : ''}</span>
              <span className="lb-value">{fmt(e.portfolioValue)}</span>
            </div>
          ))}
        </div>
      </div>

      {data.phase === 1 && (
        <div className="debrief-section debrief-theory">
          <h3>What Just Happened</h3>
          <p>Every decision you just made was a <strong>real option</strong>. When you paid a premium to stay in a venture, you bought optionality &mdash; the right to participate in the upside, with your downside capped at the premium. That's it. You paid a small amount now to keep a bigger opportunity alive for later.</p>
          <p>Think about dating. A first date is a real option. You're investing a couple hours and the cost of dinner to find out if this person is worth a second date. You're not proposing marriage. You're buying information.</p>

          <h4>The Five Real Options You Exercised</h4>
          <div className="theory-options">
            <div className="theory-option"><strong>Defer</strong><span>You saw a venture and thought "I don't know enough yet." You waited. Sometimes the smartest move is not moving.</span></div>
            <div className="theory-option"><strong>Abandon</strong><span>You let a position go. That's not quitting. That's exercising your right to walk away after paying a bounded cost to learn.</span></div>
            <div className="theory-option"><strong>Expand</strong><span>The signals were strong. You bought more. You scaled into conviction as information justified it.</span></div>
            <div className="theory-option"><strong>Stage</strong><span>You didn't commit $100K on day one. You made small bets, got information, decided again. Each round was a checkpoint.</span></div>
            <div className="theory-option"><strong>Switch</strong><span>You moved capital between ventures. When the information changed, you changed. That's the one most people are worst at.</span></div>
          </div>

          <h4>Volatility Is Not Risk</h4>
          <p>If you own equity and it's volatile, you should be nervous. But if you hold an option? Volatility is your friend. Your downside is capped. Your upside expands with every swing upward. <strong>When your downside is fixed and your upside is open, you want variance. That's not reckless. That's math.</strong></p>

          <h4>The Tomato Garden</h4>
          <p>Timothy Luehrman: managing options is like tending a garden. Some tomatoes are ripe &mdash; pick them. Some are rotten &mdash; stop watering. Some are green &mdash; these test your patience. The premium is the water. The question is whether this tomato, given more time, might ripen into something worth picking.</p>
        </div>
      )}
    </div>
  );
}

export default function Student({ state, playerName, roundResults, debriefData, clearRoundResults }) {
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (roundResults) setShowResults(true);
  }, [roundResults]);

  const handleBuy = useCallback((ventureId, contracts) => {
    socket.emit('buy-option', { ventureId, contracts }, (r) => r?.error && console.warn(r.error));
  }, []);

  const handleUndo = useCallback((ventureId) => {
    socket.emit('undo-option', { ventureId }, (r) => r?.error && console.warn(r.error));
  }, []);

  const dismiss = useCallback(() => {
    setShowResults(false);
    clearRoundResults();
  }, [clearRoundResults]);

  if (!state) return null;
  const { player, ventures, phase, round, status, roundEndTime } = state;

  if (status === 'lobby' || status === 'phase2_lobby') {
    return (
      <div className="student-view">
        <div className="lobby-wait">
          <h2>{status === 'phase2_lobby' ? 'Phase 2' : 'Welcome'}, {player.name}</h2>
          <p className="subtitle">Waiting for instructor to begin{status === 'phase2_lobby' ? ' Phase 2' : ''}...</p>
          <div className="lobby-cash">Your capital: <strong>{fmt(player.cash)}</strong></div>
          <div className="lobby-players">{state.playerCount} player{state.playerCount !== 1 ? 's' : ''} connected</div>
        </div>
      </div>
    );
  }

  if (status === 'debrief' || status === 'finished') {
    return (
      <div className="student-view">
        <DebriefView data={debriefData} playerName={playerName} />
      </div>
    );
  }

  return (
    <div className="student-view">
      <div className="student-topbar">
        <div className="topbar-cash">
          <span className="cash-label">Cash</span>
          <span className="cash-value">{fmt(player.cash)}</span>
        </div>
        <div className="topbar-center">
          <span className="round-badge">
            {status === 'between_rounds' ? 'Between Rounds' : `P${phase} \u00B7 R${round}`}
          </span>
        </div>
        {status === 'playing' ? <Timer endTime={roundEndTime} /> : <div className="timer-placeholder" />}
      </div>

      <div className="topbar-portfolio">
        Portfolio: <strong>{fmt(player.portfolioValue)}</strong>
      </div>

      {status === 'between_rounds' && (
        <div className="between-rounds-banner">Waiting for instructor to advance...</div>
      )}

      <div className="ventures-list">
        {ventures.map(v => (
          <VentureCard key={v.id} venture={v} phase={phase}
            playerCash={player.cash} playerOptions={player.options} playerEquity={player.equity}
            onBuy={handleBuy} onUndo={handleUndo} roundActive={status === 'playing'} />
        ))}
      </div>

      {showResults && <RoundResults results={roundResults} onDismiss={dismiss} />}
    </div>
  );
}
