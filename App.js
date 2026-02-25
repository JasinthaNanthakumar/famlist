import { useState, useEffect } from "react";

// ─── Icons (inline SVG components) ───────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", fill = "none", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  shopping: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  trip: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  wish: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  entertainment: "M23 7l-7 5 7 5V7zM1 5h15a2 2 0 012 2v10a2 2 0 01-2 2H1V5z",
  tasks: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  plus: "M12 5v14M5 12h14",
  check: "M20 6L9 17l-5-5",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  film: "M19.82 2H4.18A2.18 2.18 0 002 4.18v15.64A2.18 2.18 0 004.18 22h15.64A2.18 2.18 0 0022 19.82V4.18A2.18 2.18 0 0019.82 2zM7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  close: "M18 6L6 18M6 6l12 12",
  bag: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18",
  plane: "M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2v0A1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  tv: "M33 7h-2M14 7h-2M21 2v5M21 17v5M3 7h18v10H3z",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  assign: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  calendar: "M3 9h18M16 2v4M8 2v4M3 4h18a1 1 0 011 1v15a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z",
  repeat: "M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3",
};

// ─── Initial Data ─────────────────────────────────────────────────────────────
const initialData = {
  shoppingLists: [
    {
      id: 1, name: "Vegetables & Fruits", color: "#22c55e", icon: "🥦",
      items: [
        { id: 1, name: "Tomatoes", qty: "1 kg", purchased: false, addedBy: "Me" },
        { id: 2, name: "Spinach", qty: "500g", purchased: true, addedBy: "Me" },
        { id: 3, name: "Bananas", qty: "6 pcs", purchased: false, addedBy: "Husband" },
      ]
    },
    {
      id: 2, name: "Groceries", color: "#f59e0b", icon: "🛒",
      items: [
        { id: 1, name: "Rice", qty: "5 kg", purchased: false, addedBy: "Me" },
        { id: 2, name: "Cooking Oil", qty: "1 L", purchased: false, addedBy: "Me" },
      ]
    }
  ],
  trips: [
    {
      id: 1, name: "Beach Holiday", destination: "Galle", date: "2026-03-15",
      items: [
        { id: 1, name: "Sunscreen", type: "bring", done: false, assignedTo: "Me" },
        { id: 2, name: "Swimwear", type: "bring", done: true, assignedTo: "Me" },
        { id: 3, name: "Snacks", type: "buy", done: false, assignedTo: "Husband" },
        { id: 4, name: "Water Bottles", type: "buy", done: false, assignedTo: "Husband" },
      ]
    }
  ],
  wishlist: [
    { id: 1, title: "Gold Earrings", category: "Jewellery", cost: "LKR 8,000", priority: "Dream", completed: false, emoji: "💎" },
    { id: 2, title: "New Handbag", category: "Fashion", cost: "LKR 5,000", priority: "Medium", completed: false, emoji: "👜" },
    { id: 3, title: "Dinner at Shangri-La", category: "Experience", cost: "LKR 12,000", priority: "Low", completed: true, emoji: "🍽️" },
  ],
  entertainment: [
    { id: 1, title: "Oppenheimer", type: "movie", status: "watched", rating: 5, emoji: "🎬" },
    { id: 2, title: "The Bear", type: "series", status: "watching", rating: null, emoji: "📺" },
    { id: 3, title: "Mirzapur", type: "series", status: "want", rating: null, emoji: "📺" },
    { id: 4, title: "Kumkum Bhagya", type: "serial", status: "watching", rating: null, emoji: "📺" },
    { id: 5, title: "Interstellar", type: "movie", status: "want", rating: null, emoji: "🎬" },
  ],
  tasks: [
    { id: 1, title: "Morning Yoga", category: "routine", dueDate: null, isRecurring: true, completed: false, assignedTo: "Me", reminder: "07:00 AM" },
    { id: 2, title: "Submit Assignment - Data Structures", category: "exam", dueDate: "2026-02-28", isRecurring: false, completed: false, assignedTo: "Me", reminder: null },
    { id: 3, title: "Pay Electricity Bill", category: "work", dueDate: "2026-03-01", isRecurring: false, completed: false, assignedTo: "Husband", reminder: null },
    { id: 4, title: "Weekly Grocery Run", category: "routine", dueDate: null, isRecurring: true, completed: true, assignedTo: "Husband", reminder: "Saturday 10:00 AM" },
  ]
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #f0f4ff; }
  :root {
    --shopping: #22c55e; --trip: #3b82f6; --wish: #a855f7;
    --entertainment: #ef4444; --tasks: #f59e0b;
    --bg: #f0f4ff; --card: #fff; --text: #1e293b; --muted: #94a3b8;
    --radius: 16px; --shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; background: var(--bg); position: relative; overflow: hidden; }
  .header { padding: 52px 20px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; position: relative; overflow: hidden; }
  .header::before { content:''; position:absolute; top:-40px; right:-40px; width:150px; height:150px; border-radius:50%; background:rgba(255,255,255,0.1); }
  .header::after { content:''; position:absolute; bottom:-30px; left:-20px; width:100px; height:100px; border-radius:50%; background:rgba(255,255,255,0.08); }
  .header-top { display:flex; justify-content:space-between; align-items:center; position:relative; z-index:1; }
  .header h1 { font-family:'Playfair Display', serif; font-size:26px; }
  .header p { font-size:13px; opacity:0.85; margin-top:4px; }
  .greeting-badge { background:rgba(255,255,255,0.2); border-radius:20px; padding:6px 12px; font-size:12px; font-weight:700; }
  .content { padding: 16px; padding-bottom: 100px; }
  .section-title { font-size:13px; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin:20px 0 10px; }
  
  /* Stats row */
  .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:4px; }
  .stat-card { background:white; border-radius:14px; padding:14px 10px; text-align:center; box-shadow:var(--shadow); }
  .stat-num { font-size:22px; font-weight:900; }
  .stat-label { font-size:10px; color:var(--muted); font-weight:700; margin-top:2px; }
  
  /* Nav */
  .bottom-nav { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:430px; background:white; display:flex; padding:8px 0 20px; border-top:1px solid #e2e8f0; z-index:100; box-shadow:0 -4px 20px rgba(0,0,0,0.08); }
  .nav-item { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; padding:4px 0; transition:all 0.2s; }
  .nav-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; font-size:18px; }
  .nav-item.active .nav-icon { transform:scale(1.1); }
  .nav-label { font-size:9px; font-weight:800; color:var(--muted); }
  .nav-item.active .nav-label { color:var(--text); }

  /* Cards */
  .card { background:white; border-radius:var(--radius); padding:16px; margin-bottom:12px; box-shadow:var(--shadow); }
  .card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
  .card-title { font-size:15px; font-weight:800; color:var(--text); }
  .card-subtitle { font-size:12px; color:var(--muted); margin-top:2px; }
  .badge { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }
  
  /* Items */
  .item-row { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid #f1f5f9; }
  .item-row:last-child { border-bottom:none; }
  .checkbox { width:22px; height:22px; border-radius:8px; border:2px solid #e2e8f0; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:all 0.2s; }
  .checkbox.checked { background:#22c55e; border-color:#22c55e; }
  .item-name { flex:1; font-size:14px; font-weight:600; }
  .item-name.done { text-decoration:line-through; color:var(--muted); }
  .item-meta { font-size:11px; color:var(--muted); }
  .item-actions { display:flex; gap:6px; }
  .icon-btn { background:none; border:none; cursor:pointer; padding:4px; border-radius:8px; color:var(--muted); transition:all 0.2s; }
  .icon-btn:hover { background:#f1f5f9; color:var(--text); }
  .icon-btn.danger:hover { background:#fee2e2; color:#ef4444; }

  /* Buttons */
  .btn { padding:10px 18px; border-radius:12px; border:none; font-family:'Nunito',sans-serif; font-weight:800; font-size:14px; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
  .btn-primary { background:linear-gradient(135deg,#667eea,#764ba2); color:white; }
  .btn-sm { padding:6px 12px; font-size:12px; border-radius:10px; }
  .btn-outline { background:transparent; border:2px solid #e2e8f0; color:var(--text); }
  .fab { position:fixed; bottom:88px; right:calc(50% - 215px + 16px); width:54px; height:54px; border-radius:50%; background:linear-gradient(135deg,#667eea,#764ba2); border:none; color:white; font-size:26px; cursor:pointer; box-shadow:0 4px 20px rgba(102,126,234,0.5); display:flex; align-items:center; justify-content:center; z-index:99; transition:all 0.2s; }
  .fab:hover { transform:scale(1.1); }
  
  /* Modal */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:200; display:flex; align-items:flex-end; justify-content:center; animation:fadeIn 0.2s; }
  .modal { background:white; border-radius:24px 24px 0 0; padding:24px; width:100%; max-width:430px; animation:slideUp 0.3s ease; }
  .modal h3 { font-size:18px; font-weight:900; margin-bottom:16px; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{transform:translateY(100px);opacity:0} to{transform:translateY(0);opacity:1} }
  
  /* Form */
  input, select, textarea { width:100%; padding:12px 14px; border:2px solid #e2e8f0; border-radius:12px; font-family:'Nunito',sans-serif; font-size:14px; font-weight:600; outline:none; transition:border 0.2s; margin-bottom:10px; }
  input:focus, select:focus, textarea:focus { border-color:#667eea; }
  label { font-size:12px; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px; }
  
  /* Tags */
  .tag-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
  .tag { padding:5px 12px; border-radius:20px; font-size:12px; font-weight:700; cursor:pointer; border:2px solid transparent; transition:all 0.2s; }
  .tag.active { border-color:currentColor; }
  
  /* Progress bar */
  .progress-bar { height:6px; background:#f1f5f9; border-radius:3px; overflow:hidden; margin-top:8px; }
  .progress-fill { height:100%; border-radius:3px; transition:width 0.5s; }
  
  /* Priority badges */
  .priority-dream { background:#fdf4ff; color:#a855f7; }
  .priority-medium { background:#fff7ed; color:#f59e0b; }
  .priority-low { background:#f0fdf4; color:#22c55e; }
  
  /* Entertainment tabs */
  .tabs { display:flex; background:#f1f5f9; border-radius:12px; padding:4px; margin-bottom:16px; }
  .tab { flex:1; padding:8px; text-align:center; border-radius:10px; font-size:12px; font-weight:800; cursor:pointer; transition:all 0.2s; color:var(--muted); }
  .tab.active { background:white; color:var(--text); box-shadow:0 2px 8px rgba(0,0,0,0.1); }
  
  /* Status badges */
  .status-want { background:#f1f5f9; color:var(--muted); }
  .status-watching { background:#dbeafe; color:#3b82f6; }
  .status-watched { background:#dcfce7; color:#22c55e; }
  
  /* Task category */
  .cat-routine { background:#fef9c3; color:#ca8a04; }
  .cat-exam { background:#fee2e2; color:#ef4444; }
  .cat-work { background:#dbeafe; color:#3b82f6; }
  .cat-personal { background:#f3e8ff; color:#a855f7; }
  
  /* Assigned badge */
  .assigned-me { background:#667eea22; color:#667eea; }
  .assigned-husband { background:#f59e0b22; color:#d97706; }
  
  /* Empty state */
  .empty { text-align:center; padding:40px 20px; color:var(--muted); }
  .empty-icon { font-size:48px; margin-bottom:12px; }
  
  /* Home quick actions */
  .quick-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
  .quick-card { border-radius:16px; padding:16px; color:white; cursor:pointer; position:relative; overflow:hidden; transition:transform 0.2s; }
  .quick-card:hover { transform:scale(0.98); }
  .quick-card .bg-circle { position:absolute; right:-20px; bottom:-20px; width:80px; height:80px; border-radius:50%; background:rgba(255,255,255,0.15); }
  .quick-card .label { font-size:13px; font-weight:800; }
  .quick-card .count { font-size:26px; font-weight:900; }
  
  /* Notification dot */
  .notif-dot { width:8px; height:8px; background:#ef4444; border-radius:50%; position:absolute; top:8px; right:8px; }

  /* Scroll */
  .scroll-x { display:flex; gap:10px; overflow-x:auto; padding-bottom:8px; scrollbar-width:none; }
  .scroll-x::-webkit-scrollbar { display:none; }
  
  /* List selector */
  .list-pill { padding:8px 16px; border-radius:20px; font-size:13px; font-weight:700; white-space:nowrap; cursor:pointer; border:2px solid transparent; transition:all 0.2s; background:white; color:var(--muted); box-shadow:0 2px 8px rgba(0,0,0,0.06); }
  .list-pill.active { color:white; border-color:transparent; }

  /* Star rating */
  .stars { display:flex; gap:2px; }
  .star { font-size:14px; cursor:pointer; }
`;

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function FamListApp() {
  const [tab, setTab] = useState("home");
  const [data, setData] = useState(initialData);
  const [modal, setModal] = useState(null);
  const [activeList, setActiveList] = useState(0);
  const [entTab, setEntTab] = useState("all");
  const [taskFilter, setTaskFilter] = useState("all");

  // ── helpers ──
  const updateData = (key, val) => setData(d => ({ ...d, [key]: val }));
  const closeModal = () => setModal(null);

  // ── Stats ──
  const pendingTasks = data.tasks.filter(t => !t.completed).length;
  const pendingShopping = data.shoppingLists.reduce((a, l) => a + l.items.filter(i => !i.purchased).length, 0);
  const upcomingTrips = data.trips.length;

  // ── TABS ──────────────────────────────────────────────────────────────────
  const navItems = [
    { id: "home", label: "Home", icon: "🏠", color: "#667eea" },
    { id: "shopping", label: "Shopping", icon: "🛒", color: "#22c55e" },
    { id: "trips", label: "Trips", icon: "✈️", color: "#3b82f6" },
    { id: "wishlist", label: "Wishlist", icon: "⭐", color: "#a855f7" },
    { id: "tasks", label: "Tasks", icon: "✅", color: "#f59e0b" },
  ];

  // ── HOME ──────────────────────────────────────────────────────────────────
  const HomeTab = () => (
    <div>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-num" style={{ color: "#22c55e" }}>{pendingShopping}</div>
          <div className="stat-label">To Buy</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "#f59e0b" }}>{pendingTasks}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "#3b82f6" }}>{upcomingTrips}</div>
          <div className="stat-label">Trips</div>
        </div>
      </div>

      <div className="section-title">Quick Access</div>
      <div className="quick-grid">
        {[
          { label: "Shopping Lists", count: data.shoppingLists.length, bg: "linear-gradient(135deg,#22c55e,#16a34a)", tab: "shopping", icon: "🛒" },
          { label: "Upcoming Trips", count: data.trips.length, bg: "linear-gradient(135deg,#3b82f6,#2563eb)", tab: "trips", icon: "✈️" },
          { label: "My Wishes", count: data.wishlist.filter(w => !w.completed).length, bg: "linear-gradient(135deg,#a855f7,#7c3aed)", tab: "wishlist", icon: "⭐" },
          { label: "Pending Tasks", count: pendingTasks, bg: "linear-gradient(135deg,#f59e0b,#d97706)", tab: "tasks", icon: "✅" },
        ].map(q => (
          <div key={q.tab} className="quick-card" style={{ background: q.bg }} onClick={() => setTab(q.tab)}>
            <div className="bg-circle" />
            <div style={{ fontSize: 28, marginBottom: 8 }}>{q.icon}</div>
            <div className="count">{q.count}</div>
            <div className="label">{q.label}</div>
          </div>
        ))}
      </div>

      <div className="section-title">Today's Reminders</div>
      {data.tasks.filter(t => !t.completed && t.reminder).map(t => (
        <div key={t.id} className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
          <div style={{ fontSize: 24 }}>{t.category === "routine" ? "🔔" : t.category === "exam" ? "📚" : "💼"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.reminder} · {t.assignedTo}</div>
          </div>
          <span className={`badge ${t.assignedTo === "Me" ? "assigned-me" : "assigned-husband"}`}>{t.assignedTo}</span>
        </div>
      ))}

      <div className="section-title">Entertainment Queue</div>
      <div className="scroll-x">
        {data.entertainment.filter(e => e.status !== "watched").map(e => (
          <div key={e.id} className="card" style={{ minWidth: 130, padding: 14, cursor: "pointer" }} onClick={() => setTab("entertainment")}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{e.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{e.title}</div>
            <div style={{ marginTop: 4 }}>
              <span className={`badge status-${e.status}`} style={{ fontSize: 10 }}>
                {e.status === "want" ? "Watch Next" : e.status === "watching" ? "Watching" : "Watched"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── SHOPPING ──────────────────────────────────────────────────────────────
  const ShoppingTab = () => {
    const list = data.shoppingLists[activeList];
    const done = list.items.filter(i => i.purchased).length;
    const pct = list.items.length ? Math.round((done / list.items.length) * 100) : 0;

    const toggleItem = (itemId) => {
      const updated = data.shoppingLists.map((l, idx) =>
        idx === activeList ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, purchased: !i.purchased } : i) } : l
      );
      updateData("shoppingLists", updated);
    };

    const deleteItem = (itemId) => {
      const updated = data.shoppingLists.map((l, idx) =>
        idx === activeList ? { ...l, items: l.items.filter(i => i.id !== itemId) } : l
      );
      updateData("shoppingLists", updated);
    };

    const clearPurchased = () => {
      const updated = data.shoppingLists.map((l, idx) =>
        idx === activeList ? { ...l, items: l.items.filter(i => !i.purchased) } : l
      );
      updateData("shoppingLists", updated);
    };

    return (
      <div>
        <div className="scroll-x" style={{ marginBottom: 16 }}>
          {data.shoppingLists.map((l, idx) => (
            <div key={l.id} className={`list-pill ${activeList === idx ? "active" : ""}`}
              style={activeList === idx ? { background: l.color } : {}}
              onClick={() => setActiveList(idx)}>
              {l.icon} {l.name}
            </div>
          ))}
          <div className="list-pill" onClick={() => setModal("newList")} style={{ color: "#667eea" }}>+ New List</div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{list.icon} {list.name}</div>
              <div className="card-subtitle">{done}/{list.items.length} items purchased</div>
            </div>
            {done > 0 && <button className="btn btn-sm btn-outline" onClick={clearPurchased} style={{ fontSize: 11 }}>Clear done</button>}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%`, background: list.color }} />
          </div>
        </div>

        {list.items.length === 0 && (
          <div className="empty"><div className="empty-icon">🛒</div><div>No items yet. Add some!</div></div>
        )}

        {list.items.map(item => (
          <div key={item.id} className="card" style={{ padding: "12px 16px" }}>
            <div className="item-row" style={{ padding: 0, border: "none" }}>
              <div className={`checkbox ${item.purchased ? "checked" : ""}`} onClick={() => toggleItem(item.id)}>
                {item.purchased && <Icon d={Icons.check} size={13} color="white" />}
              </div>
              <div style={{ flex: 1 }}>
                <div className={`item-name ${item.purchased ? "done" : ""}`}>{item.name}</div>
                <div className="item-meta">{item.qty} · Added by {item.addedBy}</div>
              </div>
              <button className="icon-btn danger" onClick={() => deleteItem(item.id)}>
                <Icon d={Icons.trash} size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ── TRIPS ─────────────────────────────────────────────────────────────────
  const TripsTab = () => {
    const [activeTripIdx, setActiveTripIdx] = useState(0);
    const trip = data.trips[activeTripIdx];

    const toggleTripItem = (itemId) => {
      const updated = data.trips.map((t, idx) =>
        idx === activeTripIdx ? { ...t, items: t.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i) } : t
      );
      updateData("trips", updated);
    };

    const toBring = trip.items.filter(i => i.type === "bring");
    const toBuy = trip.items.filter(i => i.type === "buy");

    return (
      <div>
        <div className="scroll-x" style={{ marginBottom: 16 }}>
          {data.trips.map((t, idx) => (
            <div key={t.id} className={`list-pill ${activeTripIdx === idx ? "active" : ""}`}
              style={activeTripIdx === idx ? { background: "#3b82f6" } : {}}
              onClick={() => setActiveTripIdx(idx)}>
              ✈️ {t.name}
            </div>
          ))}
          <div className="list-pill" onClick={() => setModal("newTrip")} style={{ color: "#3b82f6" }}>+ New Trip</div>
        </div>

        <div className="card" style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "white" }}>
          <div style={{ fontSize: 13, opacity: 0.85 }}>✈️ Trip to</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{trip.destination}</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>📅 {trip.date}</div>
          <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 700 }}>
              {toBring.filter(i => i.done).length}/{toBring.length} packed
            </div>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 700 }}>
              {toBuy.filter(i => i.done).length}/{toBuy.length} bought
            </div>
          </div>
        </div>

        {[{ label: "🎒 Items to Bring", items: toBring, type: "bring" }, { label: "🛍️ Items to Buy", items: toBuy, type: "buy" }].map(section => (
          <div key={section.type}>
            <div className="section-title">{section.label}</div>
            {section.items.map(item => (
              <div key={item.id} className="card" style={{ padding: "12px 16px" }}>
                <div className="item-row" style={{ padding: 0, border: "none" }}>
                  <div className={`checkbox ${item.done ? "checked" : ""}`}
                    style={{ ...(item.done ? {} : { borderColor: "#3b82f6" }) }}
                    onClick={() => toggleTripItem(item.id)}>
                    {item.done && <Icon d={Icons.check} size={13} color="white" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={`item-name ${item.done ? "done" : ""}`}>{item.name}</div>
                    <div className="item-meta">Assigned to {item.assignedTo}</div>
                  </div>
                  <span className={`badge ${item.assignedTo === "Me" ? "assigned-me" : "assigned-husband"}`} style={{ fontSize: 11 }}>
                    {item.assignedTo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // ── WISHLIST ──────────────────────────────────────────────────────────────
  const WishlistTab = () => {
    const toggleWish = (id) => {
      updateData("wishlist", data.wishlist.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
    };
    const deleteWish = (id) => updateData("wishlist", data.wishlist.filter(w => w.id !== id));
    const pending = data.wishlist.filter(w => !w.completed);
    const done = data.wishlist.filter(w => w.completed);

    return (
      <div>
        <div className="card" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "white", marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⭐</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{pending.length} Wishes</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Keep dreaming, keep achieving!</div>
          <div style={{ marginTop: 10, background: "rgba(255,255,255,0.2)", borderRadius: 20, height: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "white", width: `${data.wishlist.length ? (done.length / data.wishlist.length * 100) : 0}%`, borderRadius: 20, transition: "width 0.5s" }} />
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>{done.length} of {data.wishlist.length} wishes fulfilled</div>
        </div>

        {pending.length === 0 && <div className="empty"><div className="empty-icon">🌟</div><div>All wishes fulfilled! Add more!</div></div>}

        {pending.map(w => (
          <div key={w.id} className="card">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ fontSize: 32 }}>{w.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{w.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{w.category} · {w.cost}</div>
                <span className={`badge priority-${w.priority.toLowerCase()} ${`priority-${w.priority.toLowerCase()}`}`} style={{ marginTop: 6, display: "inline-block" }}>{w.priority}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button className="btn btn-sm" style={{ background: "#dcfce7", color: "#16a34a" }} onClick={() => toggleWish(w.id)}>✓ Done</button>
                <button className="icon-btn danger" onClick={() => deleteWish(w.id)}><Icon d={Icons.trash} size={15} /></button>
              </div>
            </div>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <div className="section-title">✅ Fulfilled Wishes</div>
            {done.map(w => (
              <div key={w.id} className="card" style={{ opacity: 0.7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 28 }}>{w.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, textDecoration: "line-through", color: "var(--muted)" }}>{w.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{w.category}</div>
                  </div>
                  <button className="icon-btn danger" onClick={() => deleteWish(w.id)}><Icon d={Icons.trash} size={15} /></button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  // ── ENTERTAINMENT (shown as part of home / separate mini-tab) ─────────────
  const EntertainmentTab = () => {
    const [filter, setFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const types = ["all", "movie", "series", "serial"];
    const statuses = ["all", "want", "watching", "watched"];

    const filtered = data.entertainment.filter(e =>
      (filter === "all" || e.type === filter) &&
      (statusFilter === "all" || e.status === statusFilter)
    );

    const setStatus = (id, status) => {
      updateData("entertainment", data.entertainment.map(e => e.id === id ? { ...e, status } : e));
    };
    const setRating = (id, rating) => {
      updateData("entertainment", data.entertainment.map(e => e.id === id ? { ...e, rating } : e));
    };
    const deleteEnt = (id) => updateData("entertainment", data.entertainment.filter(e => e.id !== id));

    return (
      <div>
        <div className="tabs">
          {types.map(t => <div key={t} className={`tab ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>)}
        </div>
        <div className="tabs" style={{ marginBottom: 16 }}>
          {statuses.map(s => <div key={s} className={`tab ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>
            {s === "want" ? "Watch Next" : s === "watching" ? "Watching" : s === "watched" ? "Watched" : "All"}
          </div>)}
        </div>

        {filtered.length === 0 && <div className="empty"><div className="empty-icon">🎬</div><div>Nothing here yet!</div></div>}

        {filtered.map(e => (
          <div key={e.id} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 32 }}>{e.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{e.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, textTransform: "capitalize" }}>{e.type}</div>
                {e.status === "watched" && (
                  <div className="stars" style={{ marginTop: 4 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <span key={n} className="star" onClick={() => setRating(e.id, n)} style={{ color: n <= (e.rating || 0) ? "#f59e0b" : "#e2e8f0" }}>★</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                <select value={e.status} onChange={ev => setStatus(e.id, ev.target.value)}
                  style={{ width: "auto", padding: "4px 8px", fontSize: 11, marginBottom: 0 }}>
                  <option value="want">Watch Next</option>
                  <option value="watching">Watching</option>
                  <option value="watched">Watched</option>
                </select>
                <button className="icon-btn danger" onClick={() => deleteEnt(e.id)}><Icon d={Icons.trash} size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ── TASKS ─────────────────────────────────────────────────────────────────
  const TasksTab = () => {
    const cats = ["all", "routine", "exam", "work", "personal"];
    const filtered = data.tasks.filter(t => taskFilter === "all" || t.category === taskFilter);
    const pending = filtered.filter(t => !t.completed);
    const done = filtered.filter(t => t.completed);

    const toggleTask = (id) => updateData("tasks", data.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const deleteTask = (id) => updateData("tasks", data.tasks.filter(t => t.id !== id));

    const catEmoji = { routine: "🔄", exam: "📚", work: "💼", personal: "💜" };
    const catColors = { routine: "#ca8a04", exam: "#ef4444", work: "#3b82f6", personal: "#a855f7" };

    return (
      <div>
        <div className="scroll-x" style={{ marginBottom: 16 }}>
          {cats.map(c => (
            <div key={c} className={`list-pill ${taskFilter === c ? "active" : ""}`}
              style={taskFilter === c ? { background: c === "all" ? "#667eea" : catColors[c] } : {}}
              onClick={() => setTaskFilter(c)}>
              {c === "all" ? "📋 All" : `${catEmoji[c]} ${c.charAt(0).toUpperCase() + c.slice(1)}`}
            </div>
          ))}
        </div>

        {pending.length === 0 && done.length === 0 && <div className="empty"><div className="empty-icon">✅</div><div>No tasks here!</div></div>}

        {pending.map(t => (
          <div key={t.id} className="card">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div className="checkbox" style={{ marginTop: 2 }} onClick={() => toggleTask(t.id)}>
                {t.completed && <Icon d={Icons.check} size={13} color="white" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{t.title}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                  <span className={`badge cat-${t.category}`} style={{ fontSize: 10 }}>{catEmoji[t.category]} {t.category}</span>
                  <span className={`badge ${t.assignedTo === "Me" ? "assigned-me" : "assigned-husband"}`} style={{ fontSize: 10 }}>
                    👤 {t.assignedTo}
                  </span>
                  {t.dueDate && <span className="badge" style={{ background: "#fee2e2", color: "#ef4444", fontSize: 10 }}>📅 {t.dueDate}</span>}
                  {t.reminder && <span className="badge" style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 10 }}>🔔 {t.reminder}</span>}
                  {t.isRecurring && <span className="badge" style={{ background: "#f1f5f9", color: "#64748b", fontSize: 10 }}>🔄 Recurring</span>}
                </div>
              </div>
              <button className="icon-btn danger" onClick={() => deleteTask(t.id)}><Icon d={Icons.trash} size={15} /></button>
            </div>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <div className="section-title">✅ Completed</div>
            {done.map(t => (
              <div key={t.id} className="card" style={{ opacity: 0.6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="checkbox checked" onClick={() => toggleTask(t.id)}>
                    <Icon d={Icons.check} size={13} color="white" />
                  </div>
                  <div style={{ flex: 1, fontWeight: 700, fontSize: 14, textDecoration: "line-through", color: "var(--muted)" }}>{t.title}</div>
                  <button className="icon-btn danger" onClick={() => deleteTask(t.id)}><Icon d={Icons.trash} size={15} /></button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  // ── MODALS ────────────────────────────────────────────────────────────────
  const [form, setForm] = useState({});
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openModal = (type) => { setForm({}); setModal(type); };

  const handleAddShoppingItem = () => {
    if (!form.name) return;
    const updated = data.shoppingLists.map((l, idx) =>
      idx === activeList ? {
        ...l, items: [...l.items, { id: Date.now(), name: form.name, qty: form.qty || "1", purchased: false, addedBy: "Me" }]
      } : l
    );
    updateData("shoppingLists", updated);
    closeModal();
  };

  const handleAddTask = () => {
    if (!form.title) return;
    updateData("tasks", [...data.tasks, {
      id: Date.now(), title: form.title, category: form.category || "personal",
      dueDate: form.dueDate || null, isRecurring: form.recurring === "yes",
      completed: false, assignedTo: form.assignedTo || "Me", reminder: form.reminder || null
    }]);
    closeModal();
  };

  const handleAddWish = () => {
    if (!form.title) return;
    const emojis = { Jewellery: "💎", Fashion: "👗", Experience: "🌟", Tech: "📱", Food: "🍽️", Other: "✨" };
    updateData("wishlist", [...data.wishlist, {
      id: Date.now(), title: form.title, category: form.category || "Other",
      cost: form.cost || "?", priority: form.priority || "Low",
      completed: false, emoji: emojis[form.category] || "✨"
    }]);
    closeModal();
  };

  const handleAddEntertainment = () => {
    if (!form.title) return;
    updateData("entertainment", [...data.entertainment, {
      id: Date.now(), title: form.title, type: form.type || "movie",
      status: "want", rating: null, emoji: form.type === "movie" ? "🎬" : "📺"
    }]);
    closeModal();
  };

  const handleAddTripItem = () => {
    if (!form.name) return;
    const updated = data.trips.map((t, idx) =>
      idx === 0 ? {
        ...t, items: [...t.items, { id: Date.now(), name: form.name, type: form.type || "bring", done: false, assignedTo: form.assignedTo || "Me" }]
      } : t
    );
    updateData("trips", updated);
    closeModal();
  };

  const getFabAction = () => {
    switch (tab) {
      case "shopping": return () => openModal("addShoppingItem");
      case "trips": return () => openModal("addTripItem");
      case "wishlist": return () => openModal("addWish");
      case "entertainment": return () => openModal("addEntertainment");
      case "tasks": return () => openModal("addTask");
      default: return null;
    }
  };

  const fabAction = getFabAction();

  const tabHeaders = {
    home: { title: "FamList", sub: "Good morning! 👋" },
    shopping: { title: "Shopping", sub: "Track your purchases" },
    trips: { title: "Trip Planner", sub: "Pack smart, travel happy" },
    wishlist: { title: "My Wishlist", sub: "Dreams & future plans" },
    entertainment: { title: "Watch List", sub: "Movies, shows & serials" },
    tasks: { title: "Tasks", sub: "Stay on top of things" },
  };

  const currentHeader = tabHeaders[tab] || tabHeaders.home;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Header */}
        <div className="header">
          <div className="header-top">
            <div>
              <h1>{currentHeader.title}</h1>
              <p>{currentHeader.sub}</p>
            </div>
            <div className="greeting-badge">👨‍👩‍👧 Family</div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {tab === "home" && <HomeTab />}
          {tab === "shopping" && <ShoppingTab />}
          {tab === "trips" && <TripsTab />}
          {tab === "wishlist" && <WishlistTab />}
          {tab === "entertainment" && <EntertainmentTab />}
          {tab === "tasks" && <TasksTab />}
        </div>

        {/* FAB */}
        {fabAction && (
          <button className="fab" onClick={fabAction}>+</button>
        )}

        {/* Bottom Nav */}
        <div className="bottom-nav">
          {navItems.map(n => (
            <div key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
              <div className="nav-icon" style={tab === n.id ? { background: `${n.color}22` } : {}}>
                <span style={{ fontSize: 20 }}>{n.icon}</span>
              </div>
              <div className="nav-label" style={tab === n.id ? { color: n.color } : {}}>{n.label}</div>
            </div>
          ))}
          <div className={`nav-item ${tab === "entertainment" ? "active" : ""}`} onClick={() => setTab("entertainment")}>
            <div className="nav-icon" style={tab === "entertainment" ? { background: "#ef444422" } : {}}>
              <span style={{ fontSize: 20 }}>🎬</span>
            </div>
            <div className="nav-label" style={tab === "entertainment" ? { color: "#ef4444" } : {}}>Watch</div>
          </div>
        </div>

        {/* ── MODALS ── */}
        {modal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="modal">
              {/* Add Shopping Item */}
              {modal === "addShoppingItem" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3>🛒 Add Item</h3>
                    <button className="icon-btn" onClick={closeModal}><Icon d={Icons.close} size={20} /></button>
                  </div>
                  <label>Item Name</label>
                  <input placeholder="e.g. Tomatoes" value={form.name || ""} onChange={e => setF("name", e.target.value)} />
                  <label>Quantity</label>
                  <input placeholder="e.g. 1 kg" value={form.qty || ""} onChange={e => setF("qty", e.target.value)} />
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleAddShoppingItem}>Add Item</button>
                </>
              )}

              {/* Add Task */}
              {modal === "addTask" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3>✅ Add Task</h3>
                    <button className="icon-btn" onClick={closeModal}><Icon d={Icons.close} size={20} /></button>
                  </div>
                  <label>Task Name</label>
                  <input placeholder="e.g. Buy groceries" value={form.title || ""} onChange={e => setF("title", e.target.value)} />
                  <label>Category</label>
                  <select value={form.category || "personal"} onChange={e => setF("category", e.target.value)}>
                    <option value="routine">🔄 Daily Routine</option>
                    <option value="exam">📚 Exam / Assignment</option>
                    <option value="work">💼 Work</option>
                    <option value="personal">💜 Personal</option>
                  </select>
                  <label>Assign To</label>
                  <select value={form.assignedTo || "Me"} onChange={e => setF("assignedTo", e.target.value)}>
                    <option value="Me">👩 Me</option>
                    <option value="Husband">👨 Husband</option>
                  </select>
                  <label>Due Date (optional)</label>
                  <input type="date" value={form.dueDate || ""} onChange={e => setF("dueDate", e.target.value)} />
                  <label>Reminder Time (optional)</label>
                  <input placeholder="e.g. 08:00 AM" value={form.reminder || ""} onChange={e => setF("reminder", e.target.value)} />
                  <label>Recurring?</label>
                  <select value={form.recurring || "no"} onChange={e => setF("recurring", e.target.value)}>
                    <option value="no">No</option>
                    <option value="yes">Yes (Daily)</option>
                  </select>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleAddTask}>Add Task</button>
                </>
              )}

              {/* Add Wish */}
              {modal === "addWish" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3>⭐ Add Wish</h3>
                    <button className="icon-btn" onClick={closeModal}><Icon d={Icons.close} size={20} /></button>
                  </div>
                  <label>Wish / Plan</label>
                  <input placeholder="e.g. Gold Earrings" value={form.title || ""} onChange={e => setF("title", e.target.value)} />
                  <label>Category</label>
                  <select value={form.category || "Other"} onChange={e => setF("category", e.target.value)}>
                    <option value="Jewellery">💎 Jewellery</option>
                    <option value="Fashion">👗 Fashion</option>
                    <option value="Experience">🌟 Experience</option>
                    <option value="Tech">📱 Tech</option>
                    <option value="Food">🍽️ Food & Dining</option>
                    <option value="Other">✨ Other</option>
                  </select>
                  <label>Estimated Cost</label>
                  <input placeholder="e.g. LKR 5,000" value={form.cost || ""} onChange={e => setF("cost", e.target.value)} />
                  <label>Priority</label>
                  <select value={form.priority || "Low"} onChange={e => setF("priority", e.target.value)}>
                    <option value="Dream">💜 Dream</option>
                    <option value="Medium">🔥 Medium</option>
                    <option value="Low">🌱 Low</option>
                  </select>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleAddWish}>Add Wish</button>
                </>
              )}

              {/* Add Entertainment */}
              {modal === "addEntertainment" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3>🎬 Add to Watch List</h3>
                    <button className="icon-btn" onClick={closeModal}><Icon d={Icons.close} size={20} /></button>
                  </div>
                  <label>Title</label>
                  <input placeholder="e.g. Oppenheimer" value={form.title || ""} onChange={e => setF("title", e.target.value)} />
                  <label>Type</label>
                  <select value={form.type || "movie"} onChange={e => setF("type", e.target.value)}>
                    <option value="movie">🎬 Movie</option>
                    <option value="series">📺 Web Series</option>
                    <option value="serial">📺 Serial / Daily Show</option>
                  </select>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleAddEntertainment}>Add to List</button>
                </>
              )}

              {/* Add Trip Item */}
              {modal === "addTripItem" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3>✈️ Add Trip Item</h3>
                    <button className="icon-btn" onClick={closeModal}><Icon d={Icons.close} size={20} /></button>
                  </div>
                  <label>Item Name</label>
                  <input placeholder="e.g. Sunscreen" value={form.name || ""} onChange={e => setF("name", e.target.value)} />
                  <label>Type</label>
                  <select value={form.type || "bring"} onChange={e => setF("type", e.target.value)}>
                    <option value="bring">🎒 Need to Bring</option>
                    <option value="buy">🛍️ Need to Buy</option>
                  </select>
                  <label>Assign To</label>
                  <select value={form.assignedTo || "Me"} onChange={e => setF("assignedTo", e.target.value)}>
                    <option value="Me">👩 Me</option>
                    <option value="Husband">👨 Husband</option>
                  </select>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleAddTripItem}>Add Item</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
