'use client'

import { useMemo, useState } from 'react'
import {
  Crown, Flame, Gift, Grid2X2, Headphones, Home, Menu, Search, ShieldCheck,
  Sparkles, Trophy, UserRound, WalletCards, X, Zap, Volleyball, ChevronRight,
  CircleHelp, MessageCircle, Settings, LogOut, Heart, History, Star, RotateCw
} from 'lucide-react'

const games = [
  { name: 'Fortune Tiger', type: 'Slots', rating: '4.9', image: '/games/fortune-tiger.png' },
  { name: 'Fortune Rabbit', type: 'Slots', rating: '4.8', image: '/games/fortune-rabbit.png' },
  { name: 'Dragon Gold', type: 'Arcade', rating: '4.7', image: '/games/dragon-gold.png' },
  { name: 'Golden Fortune', type: 'Clássicos', rating: '4.9', image: '/games/golden-fortune.png' },
  { name: 'Mystic Gems', type: 'Puzzle', rating: '4.6', image: '/games/mystic-gems.png' },
  { name: 'Royal Spin', type: 'Cassino', rating: '4.8', image: '/games/royal-spin.png' },
  { name: 'Neon Roulette', type: 'Cassino', rating: '4.8', image: '/games/neon-roulette.png' },
  { name: 'Cosmic Crystals', type: 'Puzzle', rating: '4.7', image: '/games/cosmic-crystals.png' },
  { name: 'Cyber Cards', type: 'Cartas', rating: '4.6', image: '/games/cyber-cards.png' },
  { name: 'Treasure Chest', type: 'Aventura', rating: '4.9', image: '/games/treasure-chest.png' },
  { name: 'Lightning Dice', type: 'Arcade', rating: '4.8', image: '/games/lightning-dice.png' },
]

const categories = [
  { name: 'Popular', icon: Flame }, { name: 'Esportes', icon: Volleyball },
  { name: 'Jogos', icon: Grid2X2 }, { name: 'Slots', icon: Sparkles },
  { name: 'Promoções', icon: Gift }
]
const navItems = [
  { id: 'inicio', label: 'Início', icon: Home }, { id: 'promocoes', label: 'Promoções', icon: Gift },
  { id: 'jogos', label: 'Jogos', icon: Grid2X2 }, { id: 'suporte', label: 'Suporte', icon: Headphones },
  { id: 'perfil', label: 'Perfil', icon: UserRound }
]

type Game = typeof games[number]
type SpinRecord = { game: string; symbols: string[]; win: number; time: string }

const symbolSets: Record<string, string[]> = {
  'Fortune Tiger': ['🐯', '🧧', '🪙', '🏮', '🍊', '7️⃣'],
  'Fortune Rabbit': ['🐰', '🥕', '🧧', '🪙', '🌸', '7️⃣'],
  'Dragon Gold': ['🐉', '🪙', '💎', '🔥', '⭐', '7️⃣'],
  'Golden Fortune': ['👑', '🪙', '💎', '🏆', '⭐', '7️⃣'],
  'Mystic Gems': ['💎', '🔮', '🟣', '🔵', '🟢', '⭐'],
  'Royal Spin': ['👑', '💎', '🪙', '⭐', '🍀', '7️⃣'],
  'Neon Roulette': ['🔴', '⚫', '🟢', '7️⃣', '⭐', '💎'],
  'Cosmic Crystals': ['💎', '🌌', '⭐', '🪐', '🔮', '✨'],
  'Cyber Cards': ['🃏', '♠️', '♥️', '♦️', '♣️', '7️⃣'],
  'Treasure Chest': ['🎁', '💰', '💎', '👑', '🗝️', '⭐'],
  'Lightning Dice': ['🎲', '⚡', '7️⃣', '⭐', '💎', '🪙'],
}

function randomSymbol(set: string[]) {
  return set[Math.floor(Math.random() * set.length)]
}

function getWin(symbols: string[], bet: number) {
  if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) return bet * 8
  if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) return bet * 2
  return 0
}

function DemoGame({ game, onClose, onRecord }: { game: Game; onClose: () => void; onRecord: (r: SpinRecord) => void }) {
  const set = symbolSets[game.name] ?? ['⭐', '💎', '🪙', '7️⃣', '🍀', '👑']
  const [balance, setBalance] = useState(10000)
  const [bet, setBet] = useState(100)
  const [reels, setReels] = useState([set[0], set[1], set[2]])
  const [spinning, setSpinning] = useState(false)
  const [message, setMessage] = useState('Pronto para jogar')
  const [lastWin, setLastWin] = useState(0)

  const spin = () => {
    if (spinning || bet > balance) return
    setSpinning(true)
    setMessage('Girando...')
    setLastWin(0)
    const final = [randomSymbol(set), randomSymbol(set), randomSymbol(set)]
    setReels(final)
    window.setTimeout(() => {
      const win = getWin(final, bet)
      setBalance(v => v - bet + win)
      setLastWin(win)
      setMessage(win ? `Você ganhou ${win.toLocaleString('pt-BR')} créditos!` : 'Não foi dessa vez. Tente novamente.')
      onRecord({
        game: game.name, symbols: final, win,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      })
      setSpinning(false)
    }, 700)
  }

  return (
    <div className="game-overlay" role="dialog" aria-modal="true">
      <div className="demo-game">
        <div className="demo-game-head">
          <button className="icon-button" onClick={onClose} aria-label="Fechar jogo"><X /></button>
          <div><span className="section-kicker">JOGO DEMONSTRATIVO</span><h2>{game.name}</h2></div>
          <div className="virtual-balance"><small>Créditos virtuais</small><strong>{balance.toLocaleString('pt-BR')}</strong></div>
        </div>
        <div className="demo-art">
          <img src={game.image} alt="" />
          <div className="demo-art-shade" />
          <div className="demo-title">{game.name}</div>
        </div>
        <div className="slot-machine">
          <div className="reels">
            {reels.map((symbol, i) => <div className={`reel ${spinning ? 'reel-spinning' : ''}`} key={i}>{symbol}</div>)}
          </div>
          <p className={`game-message ${lastWin ? 'win-message' : ''}`}>{message}</p>
          <div className="bet-controls">
            <button onClick={() => setBet(v => Math.max(10, v - 10))}>−</button>
            <div><small>Valor da rodada</small><strong>{bet} créditos</strong></div>
            <button onClick={() => setBet(v => Math.min(1000, v + 10))}>+</button>
          </div>
          <button className="spin-button" onClick={spin} disabled={spinning || bet > balance}>
            <RotateCw className={spinning ? 'spin-icon' : ''} /> {spinning ? 'GIRANDO...' : 'GIRAR'}
          </button>
          <div className="paytable">
            <span>3 iguais = 8×</span><span>2 iguais = 2×</span><span>Sem aposta real</span>
          </div>
        </div>
        <p className="demo-warning"><ShieldCheck /> Esta é uma experiência de demonstração com créditos virtuais. Não há dinheiro real, depósitos ou saques.</p>
      </div>
    </div>
  )
}

function GameGrid({ items, onPlay }: { items: Game[]; onPlay: (g: Game) => void }) {
  return <div className="games-grid">{items.map((game, index) =>
    <article className="game-card" key={game.name} onClick={() => onPlay(game)}>
      <button className="game-art" aria-label={`Jogar ${game.name}`}>
        <img src={game.image} alt={`Capa ilustrativa de ${game.name}`} />
        <div className="game-index">0{index + 1}</div>
        <span className="play-pill">JOGAR DEMO</span>
      </button>
      <div className="game-info"><div><h3>{game.name}</h3><p>{game.type}</p></div><span className="rating">★ {game.rating}</span></div>
    </article>
  )}</div>
}

function Section({ eyebrow, title, items, onPlay }: { eyebrow: string; title: string; items: Game[]; onPlay: (g: Game) => void }) {
  return <section className="content-section"><div className="section-heading"><div><span className="section-kicker">{eyebrow}</span><h2>{title}</h2></div><button className="view-all" type="button">Ver todos <ChevronRight /></button></div><GameGrid items={items} onPlay={onPlay} /></section>
}
function PageHeader({ title, eyebrow }: { title: string; eyebrow: string }) {
  return <div className="internal-header"><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>Explore uma experiência demonstrativa feita para você.</p></div>
}

function HomePage({ go, onPlay }: { go: (id: string) => void; onPlay: (g: Game) => void }) {
  return <>
    <section id="inicio" className="hero-section"><div className="hero-copy"><div className="eyebrow"><Sparkles /> EXPERIÊNCIA ROYALBET</div><h1>Jogue com<br /><span>mais estilo.</span></h1><p>Uma seleção de jogos demonstrativos para você explorar no seu ritmo.</p><button className="primary-button" type="button" onClick={() => go('jogos')}>Explorar jogos <Zap /></button><div className="hero-note"><ShieldCheck /> Créditos virtuais · Sem apostas reais</div></div><div className="hero-pagination"><span className="selected" /><span /><span /></div></section>
    <section className="promo-grid" aria-label="Promoções demonstrativas">{[['NOVIDADE','Clube','Neon','promo-purple'],['DESTAQUE','Golden','Nights','promo-gold'],['EXCLUSIVO','Royal','Play','promo-blue']].map(([label, first, second, cls]) => <article className={`promo-card ${cls}`} key={label}><div><span className="promo-label">{label}</span><h2>{first}<br />{second}</h2><button type="button" onClick={() => go('promocoes')}>Conhecer <ChevronRight /></button></div><div className="promo-orb"><Sparkles /></div></article>)}</section>
    <section className="category-bar" aria-label="Categorias de jogos">{categories.map(({ name, icon: Icon }) => <button key={name} type="button" onClick={() => go(name === 'Promoções' ? 'promocoes' : 'jogos')}><Icon /> <span>{name}</span></button>)}</section>
    <Section eyebrow="SELEÇÃO ROYALBET" title="Popular" items={games.slice(0, 6)} onPlay={onPlay} />
    <div className="mid-promo"><div><span>EXPERIÊNCIA DEMO</span><strong>Escolha um jogo e comece a jogar</strong></div><Sparkles /></div>
    <Section eyebrow="ACABOU DE CHEGAR" title="Novidades" items={games.slice(6, 9)} onPlay={onPlay} />
    <section className="benefits-section"><div className="section-heading"><div><span className="section-kicker">POR QUE ROYALBET</span><h2>Feito para você</h2></div></div><div className="benefits-grid"><div className="benefit"><span className="benefit-icon"><Zap /></span><h3>Experiência fluida</h3><p>Navegação rápida e intuitiva em qualquer tela.</p></div><div className="benefit"><span className="benefit-icon blue"><Trophy /></span><h3>Jogos selecionados</h3><p>Curadoria de títulos para todos os estilos.</p></div><div className="benefit"><span className="benefit-icon purple"><ShieldCheck /></span><h3>Ambiente seguro</h3><p>Diversão responsável em um espaço demonstrativo.</p></div></div></section>
  </>
}

function PromotionsPage({ go, onPlay }: { go: (id: string) => void; onPlay: (g: Game) => void }) {
  return <div className="internal-page"><PageHeader eyebrow="ROYALBET CLUB" title="Promoções" /><div className="promo-hero"><div><span className="promo-label">EXPERIÊNCIA DEMO</span><h2>Mais estilo para<br /><b>cada descoberta.</b></h2><p>Benefícios fictícios para deixar sua jornada mais divertida.</p><button className="primary-button" onClick={() => go('jogos')}>Explorar jogos <Zap /></button></div><Gift /></div><div className="offer-grid">{[['Bônus de boas-vindas','Créditos virtuais para começar sua demonstração.','+1.000'],['Clube Royal','Conteúdos selecionados para membros demo.','VIP'],['Noite Neon','Cores, novidades e muita diversão.','NEON']].map(([title, text, tag]) => <article className="offer-card" key={title}><span>{tag}</span><h3>{title}</h3><p>{text}</p><button type="button" onClick={() => go('jogos')}>Conhecer promoção <ChevronRight /></button></article>)}</div><Section eyebrow="ESCOLHAS DA SEMANA" title="Destaques" items={games.slice(0, 3)} onPlay={onPlay} /></div>
}

function GamesPage({ onPlay }: { onPlay: (g: Game) => void }) {
  const [query, setQuery] = useState('')
  const filtered = games.filter(g => g.name.toLowerCase().includes(query.toLowerCase()))
  return <div className="internal-page"><PageHeader eyebrow="CATÁLOGO DEMO" title="Jogos" /><div className="search-box"><Search /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar jogo" aria-label="Buscar jogo" /></div><div className="catalog-tabs"><button className="active">Popular</button><button>Novidades</button><button>Mais jogados</button><button>Slots</button><button>Cassino</button><button>Jogos</button></div><Section eyebrow="TODOS OS TÍTULOS" title="Catálogo completo" items={filtered} onPlay={onPlay} /></div>
}

function SupportPage() {
  return <div className="internal-page"><PageHeader eyebrow="ESTAMOS AQUI" title="Central de ajuda" /><div className="support-cards"><article><CircleHelp /><h3>Perguntas frequentes</h3><p>Encontre respostas rápidas para as dúvidas mais comuns.</p><button type="button">Ver perguntas <ChevronRight /></button></article><article><MessageCircle /><h3>Fale conosco</h3><p>Orientações sobre a experiência demonstrativa.</p><button type="button">Iniciar conversa <ChevronRight /></button></article><article><ShieldCheck /><h3>Jogo responsável</h3><p>Informações claras sobre esta experiência virtual.</p><button type="button">Saiba mais <ChevronRight /></button></article></div><div className="faq-list"><span className="section-kicker">DÚVIDAS COMUNS</span>{['Como funciona o jogo demonstrativo?','Existe dinheiro real nesta versão?','Como escolho outro jogo?'].map(q => <button type="button" key={q}><span>{q}</span><ChevronRight /></button>)}</div></div>
}

function ProfilePage({ history }: { history: SpinRecord[] }) {
  return <div className="internal-page"><PageHeader eyebrow="MINHA ÁREA" title="Perfil" /><div className="profile-card"><div className="avatar"><UserRound /></div><div><h2>Alex Royal</h2><p>membro demonstrativo</p></div><span className="profile-level">NÍVEL 08</span></div><div className="profile-actions"><button><History /><span>Histórico<br /><small>{history.length} rodada(s)</small></span></button><button><Heart /><span>Favoritos<br /><small>6 jogos salvos</small></span></button><button><Settings /><span>Configurações<br /><small>Preferências</small></span></button></div><div className="history-card"><div className="section-heading"><div><span className="section-kicker">RECENTES</span><h2>Histórico demonstrativo</h2></div></div>{history.length ? history.slice(-6).reverse().map((item, i) => <div className="history-row" key={`${item.time}-${i}`}><span className="history-symbols">{item.symbols.join(' ')}</span><span><b>{item.game}</b><small>{item.time} · {item.win ? `+${item.win} créditos` : 'sem prêmio'}</small></span><Star /></div>) : <p className="empty-history">Jogue uma partida demo para aparecer aqui.</p>}</div><button className="logout-button" type="button"><LogOut /> Sair da demonstração</button></div>
}

export default function Page() {
  const [active, setActive] = useState('inicio')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [history, setHistory] = useState<SpinRecord[]>([])
  const current = useMemo(() => navItems.find(item => item.id === active) ?? navItems[0], [active])

  const go = (id: string) => {
    setActive(id); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const play = (game: Game) => {
    setSelectedGame(game)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const record = (item: SpinRecord) => setHistory(h => [...h, item])

  return <main className="min-h-screen overflow-x-hidden bg-[#070912] text-white">
    <div className="site-shell">
      <header className="topbar"><button className="brand brand-button" onClick={() => go('inicio')} aria-label="Ir para início"><span className="brand-mark"><Crown /></span><span>ROYAL<span>BET</span></span></button><nav className="desktop-nav" aria-label="Navegação principal">{navItems.slice(0, 4).map(item => <button className={active === item.id ? 'active' : ''} key={item.id} onClick={() => go(item.id)}>{item.label}</button>)}</nav><div className="header-actions"><div className="demo-balance"><WalletCards /><span><small>Saldo virtual</small><strong>10.000 créditos</strong></span></div><button className="login-button" type="button" onClick={() => go('perfil')}>Perfil</button><button className="menu-button" type="button" aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></header>
      {menuOpen && <aside className="side-panel"><div className="side-title"><span>MENU</span><X onClick={() => setMenuOpen(false)} /></div>{navItems.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => go(item.id)} className={active === item.id ? 'active' : ''}><Icon />{item.label}</button> })}</aside>}
      <div className="page-content">
        {active === 'inicio' && <HomePage go={go} onPlay={play} />}
        {active === 'promocoes' && <PromotionsPage go={go} onPlay={play} />}
        {active === 'jogos' && <GamesPage onPlay={play} />}
        {active === 'suporte' && <SupportPage />}
        {active === 'perfil' && <ProfilePage history={history} />}
      </div>
      <footer className="footer"><div className="brand"><span className="brand-mark"><Crown /></span><span>ROYAL<span>BET</span></span></div><p>Entretenimento premium, do seu jeito.</p><small>© 2026 ROYALBET · Interface demonstrativa com créditos virtuais.</small></footer>
    </div>
    <nav className="bottom-nav" aria-label="Navegação mobile">{navItems.map(item => { const Icon = item.icon; return <button className={active === item.id ? 'selected' : ''} key={item.id} onClick={() => go(item.id)}><Icon /><span>{item.label}</span></button> })}</nav>
    {selectedGame && <DemoGame game={selectedGame} onClose={() => setSelectedGame(null)} onRecord={record} />}
  </main>
}
