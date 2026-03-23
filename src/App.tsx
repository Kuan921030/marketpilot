import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import type { MarketPhase } from './types';
import { useWatchlist } from './hooks/useWatchlist';
import './index.css';

function App() {
  const [selectedTicker, setSelectedTicker] = useState<string | null>('NVDA');
  const [marketPhase, setMarketPhase] = useState<MarketPhase>('PRE_MARKET');
  const { groups, createGroup, deleteGroup, addTicker, removeTicker } = useWatchlist();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <Sidebar
          groups={groups}
          selectedTicker={selectedTicker}
          onSelectTicker={setSelectedTicker}
          onAddTicker={addTicker}
          onRemoveTicker={removeTicker}
          onCreateGroup={createGroup}
          onDeleteGroup={deleteGroup}
        />
      </aside>

      <main className="main-content">
        <Dashboard
          selectedTicker={selectedTicker}
          phase={marketPhase}
          onPhaseChange={setMarketPhase}
        />
      </main>
    </div>
  );
}

export default App;
