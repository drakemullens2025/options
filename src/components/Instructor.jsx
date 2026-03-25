import { useState, useEffect } from 'react';
import socket from '../socket';

function fmt(n) {
  if (Math.abs(n) >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return '$' + (n / 1_000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
  return '$' + n.toLocaleString();
}
function fmtPrice(n) { return '$' + Number(n).toFixed(2); }

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
  return (
    <div className={`timer timer-lg ${secs <= 30 ? 'timer-urgent' : secs <= 60 ? 'timer-warm' : ''}`}>
      {Math.floor(secs / 60)}:{(secs % 60).toString().padStart(2, '0')}
    </div>
  );
}

function Sparkline({ history, width = 100, height = 32 }) {
  if (!history || history.length < 2) return null;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const pts = history.map((v, i) =>
    `${(i / (history.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`
  ).join(' ');
  return (
    <svg width={width} height={height} className="sparkline">
      <polyline points={pts} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        stroke={history[history.length - 1] >= history[0] ? 'var(--color-success)' : 'var(--color-danger)'} />
    </svg>
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

const THEORY_SLIDES = {
  1: [
    { title: 'What Just Happened', body: 'Every decision you made in the last four rounds was a real option.\n\nWhen you paid a premium to stay in a venture for one round, you bought optionality. Not equity. Not ownership. Just the right to participate in the upside, with your downside capped at whatever you paid to get in.\n\nThat\'s it. That\'s the whole move. You paid a small amount now to keep a bigger opportunity alive for later.\n\nThink about dating. A first date is a real option. You\'re investing a couple hours and the cost of dinner to find out if this person is worth a second date. You\'re not proposing marriage. You\'re not signing a lease together. You\'re buying information. If the date is terrible, you\'re out $40 and an evening. If it\'s great, you\'ve unlocked the option to go deeper.\n\nEvery round of this game worked the same way. You paid a premium. You got information. You decided whether to renew or walk. That\'s real options reasoning, and you\'ve been doing it without anyone telling you what it was called.' },
    { title: 'Real Options \u2260 Financial Options', body: 'Real options are not a Wall Street thing.\n\nA financial option is a contract on a stock. It has a ticker symbol and a settlement date and a clearing house. That\'s not what we\'re talking about.\n\nA real option is a way of thinking about any decision where the future is uncertain and you can spend a little now to learn more before committing a lot. That\'s it.\n\nShould I quit my job to start this company? That\'s a binary, all-or-nothing decision. That\'s also a potentially terrible way to frame it.\n\nShould I spend my evenings building a prototype while keeping my job, and revisit the question in three months once I know whether anyone actually wants this thing? That\'s a real option. You paid a small cost (your evenings) to preserve a bigger opportunity (the company) without blowing up your life.\n\nYou already think this way, though you may not have used the same vocabulary.' },
    { title: 'Falling Forward', body: 'Here\'s the thing few discuss in entrepreneurship circles: failure is not the opposite of good strategy. Failure is often the product of good strategy.\n\nRita McGrath wrote a paper called "Falling Forward" that reframed how we think about entrepreneurial failure. Her argument: if you structure your investments as a series of small, staged bets, then "failure" just means you paid for information and acted on it. You let the option lapse. You didn\'t pour more money into something that wasn\'t working. That\'s discipline, not failure.\n\nThe students who let their option expire after a downturn didn\'t fail. They watched the valuation drop, assessed the renewal cost, and decided their capital was better deployed elsewhere. That\'s exactly right.\n\nThe mistake isn\'t abandoning a losing position. The mistake is never getting in at all because you were afraid of losing the premium, or staying in too long because you couldn\'t stomach "wasting" what you already spent. Sunk cost bias is the enemy of real options reasoning.\n\nBack to dating. You went on three dates. The conversation is mid. The chemistry is off. Do you keep going because you already invested three evenings? No. You learned what you needed to learn. You walk. That\'s not failure. That\'s falling forward.' },
    { title: 'The Five Real Options', body: 'There are five moves in the real options playbook. You made all of them in the last four rounds, whether you realized it or not.', items: [
      { label: 'Defer', desc: 'You saw a venture in Round 1 and thought "I don\'t know enough yet." So you waited. You watched. You let other students buy in while you gathered information. Sometimes the smartest move is not moving.' },
      { label: 'Abandon', desc: 'Your option was underwater. You looked at the new premium, looked at the trajectory, and said "I\'m out." That\'s not quitting. That\'s exercising your right to walk away. You capped your loss at the premium you already paid.' },
      { label: 'Expand', desc: 'The signals were strong. You were already in, and you bought more. You doubled your position because the information justified it. You don\'t have to decide everything upfront. You can start small and scale into conviction.' },
      { label: 'Stage', desc: 'This is the structure of the entire game. You didn\'t commit $100K on day one. You made small bets, got information, and decided again. And again. Each round was a stage. Each stage was a checkpoint. That\'s the beating heart of real options thinking.' },
      { label: 'Switch', desc: 'You moved capital from one venture to another between rounds. You didn\'t marry your initial thesis. When the information changed, you changed. That\'s the option to switch, and it\'s the one most people are worst at.' },
    ]},
    { title: 'Volatility Is Not (Always) Risk', body: 'This is the one that breaks people\'s brains a little.\n\nIn everyday language, "volatile" and "risky" mean the same thing. In real options reasoning, they absolutely do not.\n\nIf you own equity in a company and it\'s volatile, you should be nervous. The price swings both ways and you\'re exposed to all of it. Every dip hits your portfolio. That\'s risk.\n\nBut if you hold an option on that same company? Volatility is your friend. Your downside is capped at the premium you paid. You literally cannot lose more than that. But your upside? It expands with every swing upward. The wider the range of outcomes, the more valuable your option becomes, because you only participate in the good outcomes.\n\nThink about the students who only optioned Maren Apparel because it felt "safe." They were right that Maren was less volatile. They were wrong that this made it the better option. The option on Maren was cheap, sure, but the upside was capped by the same low volatility that made it feel comfortable.\n\nThe lesson: when your downside is fixed and your upside is open, you want variance. That\'s not reckless. That\'s math.' },
    { title: 'The Tomato Garden', body: 'Timothy Luehrman gave us the best metaphor in all of strategy.\n\nManaging a portfolio of real options is like tending a garden full of tomatoes. You planted a bunch of them. Some are ripe right now. Pick them. Exercise the option. Take the return.\n\nSome are rotten. They\'re not coming back. Stop watering them. Let the option lapse. Redirect your water (capital) to the tomatoes that still have a chance.\n\nAnd some are green. Not ripe yet. Not rotten. Just... not ready. These are the ones that test your patience. Do you keep watering? Do you rip them out to make room for something else? The premium you\'re paying is the water. The question is whether this tomato, given more time, might ripen into something worth picking.\n\nThat\'s the art. Not the math. The math tells you what the option is worth today. The art is looking at a green tomato and deciding whether it\'s worth another round of water.\n\nIn four rounds, you tended your garden. You picked some tomatoes. You let some rot. You watered some that never ripened. The goal was never to pick every tomato. The goal was to tend the garden well.' },
  ],
  2: [
    { title: 'Options vs. Equity', body: 'In Phase 2, you had a choice: buy options or buy equity.\n\nEquity gives direct ownership but full downside exposure. If the venture drops 30%, your equity drops 30%.\n\nOptions cap your downside at the premium. If the venture drops 30%, you lose the premium \u2014 period.\n\nThe trade-off: equity is cheaper per dollar of exposure but carries more risk. Options cost more but preserve flexibility.' },
    { title: 'The Commitment Trap', body: 'Equity feels decisive. Options feel like hedging.\n\nBut under genuine uncertainty, the ability to change your mind has real, quantifiable value. That\'s the option premium.\n\nThe students who performed best likely used options for uncertain ventures and equity only when they had high conviction after observing multiple rounds of data. That\'s Discovery-Driven Planning in action.' },
    { title: 'Discovery-Driven Planning', body: 'McGrath & MacMillan: planning under uncertainty means tying funding to milestones and learning \u2014 not upfront commitment.\n\nEach round was a checkpoint. New information arrived: financial metrics, narrative developments, market shifts.\n\nThe rational response was to update beliefs and reallocate \u2014 not to double down on initial thesis. Students who adjusted outperformed those who stayed the course regardless of evidence.' },
  ],
};

function DebriefSlides({ phase, idx }) {
  const slides = THEORY_SLIDES[phase] || [];
  const slide = slides[idx] || slides[0];
  return (
    <div className="debrief-slide">
      <h1 className="slide-title">{slide.title}</h1>
      {slide.body && <div className="slide-body">{slide.body.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}</div>}
      {slide.items && (
        <div className="slide-items">
          {slide.items.map((it, i) => (
            <div key={i} className="slide-item">
              <span className="slide-item-label">{it.label}</span>
              <span className="slide-item-desc">{it.desc}</span>
            </div>
          ))}
        </div>
      )}
      <div className="slide-progress">
        {slides.map((_, i) => <span key={i} className={`slide-dot ${i === idx ? 'active' : ''}`} />)}
      </div>
    </div>
  );
}

export default function Instructor({ state, roundResults, debriefData }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [showSlides, setShowSlides] = useState(false);

  if (!state) return null;
  const { code, phase, round, status, ventures, players, playerCount, roundEndTime, leaderboard, maxRounds: mr } = state;
  const maxSlides = (THEORY_SLIDES[phase] || []).length;

  // LOBBY
  if (status === 'lobby' || status === 'phase2_lobby') {
    return (
      <div className="instructor-view">
        <div className="inst-lobby">
          <h1>{status === 'phase2_lobby' ? 'Phase 2' : 'Game Lobby'}</h1>
          <div className="room-code-display">
            <span className="room-code-label">Room Code</span>
            <span className="room-code">{code}</span>
          </div>
          <div className="inst-players">
            <h3>{playerCount} Player{playerCount !== 1 ? 's' : ''}</h3>
            <div className="player-list">
              {players.map((p, i) => <span key={i} className="player-chip">{p.name}</span>)}
            </div>
          </div>
          <button className="btn-primary btn-lg" onClick={() => socket.emit('start-round')} disabled={playerCount === 0}>
            Start {status === 'phase2_lobby' ? 'Phase 2, ' : ''}Round 1
          </button>
        </div>
      </div>
    );
  }

  // DEBRIEF / FINISHED
  if (status === 'debrief' || status === 'finished') {
    return (
      <div className="instructor-view">
        {showSlides ? (
          <div className="inst-debrief-slides">
            <DebriefSlides phase={phase} idx={slideIdx} />
            <div className="slide-controls">
              <button className="btn-ghost" disabled={slideIdx <= 0} onClick={() => setSlideIdx(i => i - 1)}>Previous</button>
              <span className="slide-counter">{slideIdx + 1} / {maxSlides}</span>
              {slideIdx < maxSlides - 1
                ? <button className="btn-primary" onClick={() => setSlideIdx(i => i + 1)}>Next</button>
                : <button className="btn-primary" onClick={() => setShowSlides(false)}>Show Results</button>
              }
            </div>
          </div>
        ) : (
          <div className="inst-debrief-results">
            <h1>Phase {phase} Results</h1>
            {debriefData && (
              <>
                <div className="debrief-section">
                  <h3>Venture Outcomes</h3>
                  <div className="inst-ventures-grid">
                    {debriefData.ventures.map(v => (
                      <div key={v.id} className="inst-venture-result">
                        <h4>{v.name}</h4>
                        <div className={`val-change big ${v.totalReturn >= 0 ? 'up' : 'down'}`}>
                          {v.totalReturn >= 0 ? '+' : ''}{v.totalReturn}%
                        </div>
                        <div className="debrief-venture-vals">{fmtPrice(v.startPrice)} &rarr; {fmtPrice(v.endPrice)}</div>
                        <Sparkline history={v.history} width={120} height={40} />
                        <MetricsGrid metrics={v.metrics} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="debrief-section">
                  <h3>Leaderboard</h3>
                  <div className="leaderboard leaderboard-lg">
                    {debriefData.leaderboard.map((e, i) => (
                      <div key={i} className={`lb-entry ${i < 3 ? 'lb-top' : ''}`}>
                        <span className="lb-rank">{i + 1}</span>
                        <span className="lb-name">{e.name}</span>
                        <span className="lb-value">{fmt(e.portfolioValue)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="debrief-section">
                  <h3>Class Activity</h3>
                  <div className="stat-grid">
                    <div className="stat-card"><span className="stat-value">{debriefData.aggregateStats.totalBuys}</span><span className="stat-label">Options Bought</span></div>
                    <div className="stat-card"><span className="stat-value">{debriefData.aggregateStats.totalSells}</span><span className="stat-label">Options Sold</span></div>
                    <div className="stat-card"><span className="stat-value">{debriefData.aggregateStats.totalEquity}</span><span className="stat-label">Equity Purchases</span></div>
                  </div>
                </div>
              </>
            )}
            <div className="inst-debrief-actions">
              <button className="btn-ghost" onClick={() => { setShowSlides(true); setSlideIdx(0); }}>Show Theory Slides</button>
              {status === 'debrief' && phase === 1 && (
                <button className="btn-primary btn-lg" onClick={() => socket.emit('start-phase2')}>Start Phase 2</button>
              )}
              {status === 'debrief' && phase === 2 && (
                <button className="btn-primary btn-lg" onClick={() => socket.emit('finish-game')}>Final Results</button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // PLAYING / BETWEEN ROUNDS
  return (
    <div className="instructor-view">
      <div className="inst-topbar">
        <div className="inst-topbar-left">
          <span className="room-code-small">{code}</span>
          <span className="round-badge">Phase {phase} &middot; Round {round}</span>
        </div>
        {status === 'playing' && <Timer endTime={roundEndTime} />}
        <span className="player-count">{playerCount} players</span>
      </div>

      <div className="inst-ventures-grid">
        {ventures.map(v => (
          <div key={v.id} className="inst-venture-card">
            <h3>{v.name}</h3>
            <div className="inst-venture-val">
              <span>{fmtPrice(v.sharePrice)}</span>
              {v.priceHistory.length > 1 && (
                <span className={`val-change ${v.priceChange >= 0 ? 'up' : 'down'}`}>
                  {v.priceChange >= 0 ? '+' : ''}{v.priceChange}%
                </span>
              )}
            </div>
            <Sparkline history={v.priceHistory} width={120} height={36} />
            <div className="inst-venture-rate">Premium: {fmt(v.premium)}/contract</div>
            {v.roundNarrative && <p className="result-narrative-sm">{v.roundNarrative}</p>}
            <MetricsGrid metrics={v.metrics} />
          </div>
        ))}
      </div>

      {roundResults && status === 'between_rounds' && (
        <div className="inst-round-results">
          <h3>Round {roundResults.round} Outcomes</h3>
          {roundResults.ventures.map(v => (
            <div key={v.ventureId} className="inst-result-row">
              <span>{v.name}</span>
              <span className={`val-change ${v.change >= 0 ? 'up' : 'down'}`}>
                {v.change >= 0 ? '+' : ''}{v.change}%
              </span>
              <span className="result-prices-sm">{fmtPrice(v.oldPrice)} &rarr; {fmtPrice(v.newPrice)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="inst-leaderboard-mini">
        <h3>Portfolio Rankings</h3>
        {leaderboard?.slice(0, 8).map((e, i) => (
          <div key={i} className="lb-entry lb-mini">
            <span className="lb-rank">{i + 1}</span>
            <span className="lb-name">{e.name}</span>
            <span className="lb-value">{fmt(e.portfolioValue)}</span>
          </div>
        ))}
        {leaderboard?.length > 8 && <div className="lb-more">+{leaderboard.length - 8} more</div>}
      </div>

      <div className="inst-controls">
        {status === 'playing' && (
          <button className="btn-danger btn-lg" onClick={() => socket.emit('end-round')}>End Round</button>
        )}
        {status === 'between_rounds' && round < (mr || 4) && (
          <button className="btn-primary btn-lg" onClick={() => socket.emit('start-round')}>Start Round {round + 1}</button>
        )}
        {status === 'between_rounds' && round >= (mr || 4) && (
          <button className="btn-primary btn-lg" onClick={() => socket.emit('start-debrief')}>Begin Debrief</button>
        )}
      </div>
    </div>
  );
}
