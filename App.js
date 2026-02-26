import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, SafeAreaView, StatusBar, FlatList, Alert
} from 'react-native';

const COLORS = {
  primary: '#6c63ff', primary2: '#a855f7',
  shopping: '#22c55e', trip: '#3b82f6', wish: '#a855f7',
  ent: '#ef4444', tasks: '#f59e0b',
  bg: '#f0f4ff', card: '#fff', text: '#1e293b', muted: '#94a3b8',
};

const SEED = {
  shoppingLists: [
    { id: 1, name: 'Vegetables', icon: '🥦', color: '#22c55e', items: [
      { id: 1, name: 'Tomatoes', qty: '1 kg', purchased: false, by: 'Me' },
      { id: 2, name: 'Spinach', qty: '500g', purchased: true, by: 'Me' },
      { id: 3, name: 'Bananas', qty: '6 pcs', purchased: false, by: 'Husband' },
    ]},
    { id: 2, name: 'Groceries', icon: '🛒', color: '#f59e0b', items: [
      { id: 1, name: 'Rice', qty: '5 kg', purchased: false, by: 'Me' },
      { id: 2, name: 'Cooking Oil', qty: '1 L', purchased: false, by: 'Me' },
    ]},
  ],
  trips: [
    { id: 1, name: 'Beach Holiday', destination: 'Galle', date: '2026-03-15', items: [
      { id: 1, name: 'Sunscreen', type: 'bring', done: false, to: 'Me' },
      { id: 2, name: 'Swimwear', type: 'bring', done: true, to: 'Me' },
      { id: 3, name: 'Snacks', type: 'buy', done: false, to: 'Husband' },
    ]},
  ],
  wishlist: [
    { id: 1, title: 'Gold Earrings', cat: 'Jewellery', cost: 'LKR 8,000', priority: 'Dream', done: false, emoji: '💎' },
    { id: 2, title: 'New Handbag', cat: 'Fashion', cost: 'LKR 5,000', priority: 'Medium', done: false, emoji: '👜' },
    { id: 3, title: 'Dinner at Shangri-La', cat: 'Experience', cost: 'LKR 12,000', priority: 'Low', done: true, emoji: '🍽️' },
  ],
  entertainment: [
    { id: 1, title: 'Oppenheimer', type: 'movie', status: 'watched', rating: 5, emoji: '🎬' },
    { id: 2, title: 'The Bear', type: 'series', status: 'watching', rating: null, emoji: '📺' },
    { id: 3, title: 'Mirzapur', type: 'series', status: 'want', rating: null, emoji: '📺' },
    { id: 4, title: 'Kumkum Bhagya', type: 'serial', status: 'watching', rating: null, emoji: '📺' },
  ],
  tasks: [
    { id: 1, title: 'Morning Yoga', cat: 'routine', due: null, recurring: true, done: false, to: 'Me', reminder: '07:00 AM' },
    { id: 2, title: 'Submit Assignment', cat: 'exam', due: '2026-02-28', recurring: false, done: false, to: 'Me', reminder: null },
    { id: 3, title: 'Pay Electricity Bill', cat: 'work', due: '2026-03-01', recurring: false, done: false, to: 'Husband', reminder: null },
    { id: 4, title: 'Weekly Grocery Run', cat: 'routine', due: null, recurring: true, done: true, to: 'Husband', reminder: 'Sat 10AM' },
  ],
};

// ── Small reusable components ──────────────────────────────────────────────
const Card = ({ children, style }) => (
  <View style={[s.card, style]}>{children}</View>
);

const Btn = ({ label, onPress, color = COLORS.primary, textColor = '#fff', style }) => (
  <TouchableOpacity onPress={onPress} style={[s.btn, { backgroundColor: color }, style]}>
    <Text style={[s.btnText, { color: textColor }]}>{label}</Text>
  </TouchableOpacity>
);

const Badge = ({ label, bg, color }) => (
  <View style={[s.badge, { backgroundColor: bg }]}>
    <Text style={[s.badgeText, { color }]}>{label}</Text>
  </View>
);

const Checkbox = ({ checked, onPress, color = COLORS.shopping }) => (
  <TouchableOpacity onPress={onPress}
    style={[s.cb, checked && { backgroundColor: color, borderColor: color }]}>
    {checked && <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900' }}>✓</Text>}
  </TouchableOpacity>
);

const SectionTitle = ({ title }) => (
  <Text style={s.sectionTitle}>{title}</Text>
);

// ── Add Item Modal ─────────────────────────────────────────────────────────
function AddModal({ visible, onClose, onAdd, type }) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [cat, setCat] = useState('personal');
  const [to, setTo] = useState('Me');
  const [priority, setPriority] = useState('Low');
  const [itemType, setItemType] = useState('bring');
  const [entType, setEntType] = useState('movie');
  const [due, setDue] = useState('');
  const [reminder, setReminder] = useState('');
  const [cost, setCost] = useState('');

  const reset = () => { setName(''); setQty(''); setCat('personal'); setTo('Me'); setPriority('Low'); setItemType('bring'); setEntType('movie'); setDue(''); setReminder(''); setCost(''); };

  const handle = () => {
    if (!name.trim()) { Alert.alert('Please enter a name'); return; }
    onAdd({ name, qty, cat, to, priority, type: itemType, entType, due, reminder, cost });
    reset();
    onClose();
  };

  const titles = { shop: '🛒 Add Item', task: '✅ Add Task', wish: '⭐ Add Wish', ent: '🎬 Add to Watch List', trip: '✈️ Add Trip Item' };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={s.modalBox}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{titles[type] || 'Add'}</Text>
            <TouchableOpacity onPress={onClose}><Text style={{ fontSize: 20, color: COLORS.muted }}>✕</Text></TouchableOpacity>
          </View>

          <Text style={s.label}>Name *</Text>
          <TextInput style={s.input} placeholder="Enter name..." value={name} onChangeText={setName} />

          {type === 'shop' && <>
            <Text style={s.label}>Quantity</Text>
            <TextInput style={s.input} placeholder="e.g. 1 kg" value={qty} onChangeText={setQty} />
          </>}

          {type === 'task' && <>
            <Text style={s.label}>Category</Text>
            <View style={s.optRow}>
              {['routine','exam','work','personal'].map(c => (
                <TouchableOpacity key={c} onPress={() => setCat(c)}
                  style={[s.optBtn, cat === c && { backgroundColor: COLORS.primary }]}>
                  <Text style={[s.optText, cat === c && { color: '#fff' }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.label}>Assign To</Text>
            <View style={s.optRow}>
              {['Me','Husband'].map(p => (
                <TouchableOpacity key={p} onPress={() => setTo(p)}
                  style={[s.optBtn, to === p && { backgroundColor: COLORS.primary }]}>
                  <Text style={[s.optText, to === p && { color: '#fff' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.label}>Due Date (optional)</Text>
            <TextInput style={s.input} placeholder="e.g. 2026-03-01" value={due} onChangeText={setDue} />
            <Text style={s.label}>Reminder (optional)</Text>
            <TextInput style={s.input} placeholder="e.g. 08:00 AM" value={reminder} onChangeText={setReminder} />
          </>}

          {type === 'wish' && <>
            <Text style={s.label}>Estimated Cost</Text>
            <TextInput style={s.input} placeholder="e.g. LKR 5,000" value={cost} onChangeText={setCost} />
            <Text style={s.label}>Priority</Text>
            <View style={s.optRow}>
              {['Dream','Medium','Low'].map(p => (
                <TouchableOpacity key={p} onPress={() => setPriority(p)}
                  style={[s.optBtn, priority === p && { backgroundColor: COLORS.primary }]}>
                  <Text style={[s.optText, priority === p && { color: '#fff' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>}

          {type === 'ent' && <>
            <Text style={s.label}>Type</Text>
            <View style={s.optRow}>
              {['movie','series','serial'].map(t => (
                <TouchableOpacity key={t} onPress={() => setEntType(t)}
                  style={[s.optBtn, entType === t && { backgroundColor: COLORS.primary }]}>
                  <Text style={[s.optText, entType === t && { color: '#fff' }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>}

          {type === 'trip' && <>
            <Text style={s.label}>Type</Text>
            <View style={s.optRow}>
              {['bring','buy'].map(t => (
                <TouchableOpacity key={t} onPress={() => setItemType(t)}
                  style={[s.optBtn, itemType === t && { backgroundColor: COLORS.primary }]}>
                  <Text style={[s.optText, itemType === t && { color: '#fff' }]}>
                    {t === 'bring' ? '🎒 Bring' : '🛍️ Buy'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.label}>Assign To</Text>
            <View style={s.optRow}>
              {['Me','Husband'].map(p => (
                <TouchableOpacity key={p} onPress={() => setTo(p)}
                  style={[s.optBtn, to === p && { backgroundColor: COLORS.primary }]}>
                  <Text style={[s.optText, to === p && { color: '#fff' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>}

          <Btn label="Add ✓" onPress={handle} style={{ marginTop: 8 }} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ── HOME TAB ───────────────────────────────────────────────────────────────
function HomeTab({ data, setTab }) {
  const pendingShop = data.shoppingLists.reduce((a, l) => a + l.items.filter(i => !i.purchased).length, 0);
  const pendingTask = data.tasks.filter(t => !t.done).length;
  const wishes = data.wishlist.filter(w => !w.done).length;

  const quickCards = [
    { label: 'Shopping', count: pendingShop, bg: '#22c55e', t: 'shopping', icon: '🛒' },
    { label: 'Trips', count: data.trips.length, bg: '#3b82f6', t: 'trips', icon: '✈️' },
    { label: 'Wishlist', count: wishes, bg: '#a855f7', t: 'wishlist', icon: '⭐' },
    { label: 'Tasks', count: pendingTask, bg: '#f59e0b', t: 'tasks', icon: '✅' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Stats */}
      <View style={s.statsRow}>
        {[{num: pendingShop, lbl: 'To Buy', color: '#22c55e'}, {num: pendingTask, lbl: 'Pending', color: '#f59e0b'}, {num: wishes, lbl: 'Wishes', color: '#a855f7'}].map(st => (
          <Card key={st.lbl} style={s.statCard}>
            <Text style={[s.statNum, { color: st.color }]}>{st.num}</Text>
            <Text style={s.statLbl}>{st.lbl}</Text>
          </Card>
        ))}
      </View>

      <SectionTitle title="Quick Access" />
      <View style={s.quickGrid}>
        {quickCards.map(q => (
          <TouchableOpacity key={q.t} onPress={() => setTab(q.t)}
            style={[s.qCard, { backgroundColor: q.bg }]}>
            <Text style={{ fontSize: 28, marginBottom: 6 }}>{q.icon}</Text>
            <Text style={s.qNum}>{q.count}</Text>
            <Text style={s.qLbl}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle title="🔔 Reminders" />
      {data.tasks.filter(t => !t.done && t.reminder).map(t => (
        <Card key={t.id} style={s.reminderCard}>
          <Text style={{ fontSize: 22 }}>{t.cat === 'routine' ? '🔄' : t.cat === 'exam' ? '📚' : '💼'}</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.reminderTitle}>{t.title}</Text>
            <Text style={s.reminderSub}>{t.reminder} · {t.to}</Text>
          </View>
          <Badge label={t.to} bg={t.to === 'Me' ? '#ede9fe' : '#fef9c3'} color={t.to === 'Me' ? '#6c63ff' : '#ca8a04'} />
        </Card>
      ))}

      <SectionTitle title="🎬 Watch Queue" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.entertainment.filter(e => e.status !== 'watched').map(e => (
          <TouchableOpacity key={e.id} onPress={() => setTab('entertainment')} style={s.hCard}>
            <Text style={{ fontSize: 30, marginBottom: 6 }}>{e.emoji}</Text>
            <Text style={s.hCardTitle}>{e.title}</Text>
            <Badge label={e.status === 'watching' ? 'Watching' : 'Watch Next'}
              bg={e.status === 'watching' ? '#dbeafe' : '#f1f5f9'}
              color={e.status === 'watching' ? '#2563eb' : '#64748b'} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ── SHOPPING TAB ───────────────────────────────────────────────────────────
function ShoppingTab({ data, upd }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [modal, setModal] = useState(false);
  const list = data.shoppingLists[activeIdx] || data.shoppingLists[0];
  const done = list.items.filter(i => i.purchased).length;
  const pct = list.items.length ? done / list.items.length : 0;

  const toggle = (iid) => upd('shoppingLists', data.shoppingLists.map((l, li) =>
    li === activeIdx ? { ...l, items: l.items.map(i => i.id === iid ? { ...i, purchased: !i.purchased } : i) } : l));

  const del = (iid) => upd('shoppingLists', data.shoppingLists.map((l, li) =>
    li === activeIdx ? { ...l, items: l.items.filter(i => i.id !== iid) } : l));

  const addItem = (f) => upd('shoppingLists', data.shoppingLists.map((l, li) =>
    li === activeIdx ? { ...l, items: [...l.items, { id: Date.now(), name: f.name, qty: f.qty || '1', purchased: false, by: 'Me' }] } : l));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillRow}>
        {data.shoppingLists.map((l, li) => (
          <TouchableOpacity key={l.id} onPress={() => setActiveIdx(li)}
            style={[s.pill, activeIdx === li && { backgroundColor: l.color }]}>
            <Text style={[s.pillText, activeIdx === li && { color: '#fff' }]}>{l.icon} {l.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Card style={{ marginHorizontal: 14, marginBottom: 10 }}>
        <View style={s.row}>
          <View>
            <Text style={s.cardTitle}>{list.icon} {list.name}</Text>
            <Text style={s.cardSub}>{done}/{list.items.length} purchased</Text>
          </View>
          {done > 0 && <Btn label="Clear done" onPress={() => upd('shoppingLists', data.shoppingLists.map((l, li) => li === activeIdx ? { ...l, items: l.items.filter(i => !i.purchased) } : l))} color="#f1f5f9" textColor={COLORS.text} style={s.btnSm} />}
        </View>
        <View style={s.progBar}>
          <View style={[s.progFill, { width: `${pct * 100}%`, backgroundColor: list.color }]} />
        </View>
      </Card>

      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 14 }}>
        {list.items.length === 0 && <View style={s.empty}><Text style={s.emptyIcon}>🛒</Text><Text style={s.emptyText}>No items yet. Tap + to add!</Text></View>}
        {list.items.map(item => (
          <Card key={item.id} style={{ padding: 12, marginBottom: 8 }}>
            <View style={s.row}>
              <Checkbox checked={item.purchased} onPress={() => toggle(item.id)} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[s.iName, item.purchased && s.done]}>{item.name}</Text>
                <Text style={s.iMeta}>{item.qty} · {item.by}</Text>
              </View>
              <TouchableOpacity onPress={() => del(item.id)}><Text style={s.delBtn}>🗑️</Text></TouchableOpacity>
            </View>
          </Card>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      <AddModal visible={modal} onClose={() => setModal(false)} onAdd={addItem} type="shop" />
      <TouchableOpacity style={s.fab} onPress={() => setModal(true)}><Text style={s.fabText}>+</Text></TouchableOpacity>
    </View>
  );
}

// ── TRIPS TAB ──────────────────────────────────────────────────────────────
function TripsTab({ data, upd }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [modal, setModal] = useState(false);
  const trip = data.trips[activeIdx];

  if (!trip) return (
    <View style={s.empty}><Text style={s.emptyIcon}>✈️</Text><Text style={s.emptyText}>No trips yet!</Text></View>
  );

  const bring = trip.items.filter(i => i.type === 'bring');
  const buy = trip.items.filter(i => i.type === 'buy');

  const toggle = (iid) => upd('trips', data.trips.map((t, ti) =>
    ti === activeIdx ? { ...t, items: t.items.map(i => i.id === iid ? { ...i, done: !i.done } : i) } : t));

  const del = (iid) => upd('trips', data.trips.map((t, ti) =>
    ti === activeIdx ? { ...t, items: t.items.filter(i => i.id !== iid) } : t));

  const addItem = (f) => upd('trips', data.trips.map((t, ti) =>
    ti === activeIdx ? { ...t, items: [...t.items, { id: Date.now(), name: f.name, type: f.type, done: false, to: f.to }] } : t));

  const TripItems = ({ items, color }) => items.map(item => (
    <Card key={item.id} style={{ padding: 12, marginBottom: 8 }}>
      <View style={s.row}>
        <Checkbox checked={item.done} onPress={() => toggle(item.id)} color={color} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[s.iName, item.done && s.done]}>{item.name}</Text>
          <Text style={s.iMeta}>→ {item.to}</Text>
        </View>
        <Badge label={item.to} bg={item.to === 'Me' ? '#ede9fe' : '#fef9c3'} color={item.to === 'Me' ? '#6c63ff' : '#ca8a04'} />
        <TouchableOpacity onPress={() => del(item.id)} style={{ marginLeft: 8 }}><Text style={s.delBtn}>🗑️</Text></TouchableOpacity>
      </View>
    </Card>
  ));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillRow}>
        {data.trips.map((t, ti) => (
          <TouchableOpacity key={t.id} onPress={() => setActiveIdx(ti)}
            style={[s.pill, activeIdx === ti && { backgroundColor: COLORS.trip }]}>
            <Text style={[s.pillText, activeIdx === ti && { color: '#fff' }]}>✈️ {t.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 14 }}>
        <View style={[s.hero, { backgroundColor: COLORS.trip }]}>
          <Text style={s.heroSub}>✈️ Destination</Text>
          <Text style={s.heroTitle}>{trip.destination}</Text>
          <Text style={s.heroSub}>📅 {trip.date}</Text>
          <View style={s.row}>
            <View style={s.heroBadge}><Text style={s.heroBadgeText}>{bring.filter(i => i.done).length}/{bring.length} packed</Text></View>
            <View style={[s.heroBadge, { marginLeft: 8 }]}><Text style={s.heroBadgeText}>{buy.filter(i => i.done).length}/{buy.length} bought</Text></View>
          </View>
        </View>

        <SectionTitle title="🎒 Items to Bring" />
        <TripItems items={bring} color={COLORS.trip} />

        <SectionTitle title="🛍️ Items to Buy" />
        <TripItems items={buy} color={COLORS.trip} />
        <View style={{ height: 80 }} />
      </ScrollView>

      <AddModal visible={modal} onClose={() => setModal(false)} onAdd={addItem} type="trip" />
      <TouchableOpacity style={[s.fab, { backgroundColor: COLORS.trip }]} onPress={() => setModal(true)}><Text style={s.fabText}>+</Text></TouchableOpacity>
    </View>
  );
}

// ── WISHLIST TAB ───────────────────────────────────────────────────────────
function WishlistTab({ data, upd }) {
  const [modal, setModal] = useState(false);
  const pending = data.wishlist.filter(w => !w.done);
  const done = data.wishlist.filter(w => w.done);
  const pct = data.wishlist.length ? done.length / data.wishlist.length : 0;

  const priColors = { Dream: { bg: '#fdf4ff', color: '#a855f7' }, Medium: { bg: '#fff7ed', color: '#f59e0b' }, Low: { bg: '#f0fdf4', color: '#22c55e' } };
  const emap = { Jewellery: '💎', Fashion: '👗', Experience: '🌟', Tech: '📱', Food: '🍽️', Other: '✨' };

  const toggle = (id) => upd('wishlist', data.wishlist.map(w => w.id === id ? { ...w, done: !w.done } : w));
  const del = (id) => upd('wishlist', data.wishlist.filter(w => w.id !== id));
  const addWish = (f) => upd('wishlist', [...data.wishlist, { id: Date.now(), title: f.name, cat: f.cat || 'Other', cost: f.cost || '?', priority: f.priority || 'Low', done: false, emoji: emap[f.cat] || '✨' }]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 14 }}>
        <View style={[s.hero, { backgroundColor: COLORS.wish }]}>
          <Text style={{ fontSize: 28, marginBottom: 6 }}>⭐</Text>
          <Text style={s.heroTitle}>{pending.length} Wishes Pending</Text>
          <Text style={s.heroSub}>{done.length} of {data.wishlist.length} fulfilled</Text>
          <View style={[s.progBar, { marginTop: 10, backgroundColor: 'rgba(255,255,255,0.3)' }]}>
            <View style={[s.progFill, { width: `${pct * 100}%`, backgroundColor: '#fff' }]} />
          </View>
        </View>

        {pending.length === 0 && <View style={s.empty}><Text style={s.emptyIcon}>🌟</Text><Text style={s.emptyText}>All wishes fulfilled!</Text></View>}

        {pending.map(w => (
          <Card key={w.id} style={{ marginBottom: 10 }}>
            <View style={s.row}>
              <Text style={{ fontSize: 32 }}>{w.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.cardTitle}>{w.title}</Text>
                <Text style={s.cardSub}>{w.cat} · {w.cost}</Text>
                <Badge label={w.priority} bg={priColors[w.priority]?.bg} color={priColors[w.priority]?.color} />
              </View>
              <View>
                <Btn label="✓ Done" onPress={() => toggle(w.id)} color="#dcfce7" textColor="#16a34a" style={[s.btnSm, { marginBottom: 6 }]} />
                <TouchableOpacity onPress={() => del(w.id)} style={{ alignItems: 'center' }}><Text style={s.delBtn}>🗑️</Text></TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}

        {done.length > 0 && <>
          <SectionTitle title="✅ Fulfilled Wishes" />
          {done.map(w => (
            <Card key={w.id} style={{ marginBottom: 8, opacity: 0.6 }}>
              <View style={s.row}>
                <Text style={{ fontSize: 26 }}>{w.emoji}</Text>
                <Text style={[s.iName, s.done, { flex: 1, marginLeft: 12 }]}>{w.title}</Text>
                <TouchableOpacity onPress={() => del(w.id)}><Text style={s.delBtn}>🗑️</Text></TouchableOpacity>
              </View>
            </Card>
          ))}
        </>}
        <View style={{ height: 80 }} />
      </ScrollView>

      <AddModal visible={modal} onClose={() => setModal(false)} onAdd={addWish} type="wish" />
      <TouchableOpacity style={[s.fab, { backgroundColor: COLORS.wish }]} onPress={() => setModal(true)}><Text style={s.fabText}>+</Text></TouchableOpacity>
    </View>
  );
}

// ── ENTERTAINMENT TAB ──────────────────────────────────────────────────────
function EntertainmentTab({ data, upd }) {
  const [typeF, setTypeF] = useState('all');
  const [statF, setStatF] = useState('all');
  const [modal, setModal] = useState(false);

  const filtered = data.entertainment.filter(e =>
    (typeF === 'all' || e.type === typeF) && (statF === 'all' || e.status === statF));

  const setStatus = (id, status) => upd('entertainment', data.entertainment.map(e => e.id === id ? { ...e, status } : e));
  const setRating = (id, r) => upd('entertainment', data.entertainment.map(e => e.id === id ? { ...e, rating: r } : e));
  const del = (id) => upd('entertainment', data.entertainment.filter(e => e.id !== id));
  const addEnt = (f) => upd('entertainment', [...data.entertainment, { id: Date.now(), title: f.name, type: f.entType || 'movie', status: 'want', rating: null, emoji: f.entType === 'movie' ? '🎬' : '📺' }]);

  const statusColors = { want: { bg: '#f1f5f9', color: '#64748b' }, watching: { bg: '#dbeafe', color: '#2563eb' }, watched: { bg: '#dcfce7', color: '#16a34a' } };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 14 }}>
        <View style={s.tabs}>
          {['all','movie','series','serial'].map(t => (
            <TouchableOpacity key={t} onPress={() => setTypeF(t)} style={[s.tab, typeF === t && s.tabOn]}>
              <Text style={[s.tabText, typeF === t && s.tabTextOn]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={s.tabs}>
          {[['all','All'],['want','Next'],['watching','Watching'],['watched','Watched']].map(([k, l]) => (
            <TouchableOpacity key={k} onPress={() => setStatF(k)} style={[s.tab, statF === k && s.tabOn]}>
              <Text style={[s.tabText, statF === k && s.tabTextOn]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 14 }}>
        {filtered.length === 0 && <View style={s.empty}><Text style={s.emptyIcon}>🎬</Text><Text style={s.emptyText}>Nothing here yet!</Text></View>}
        {filtered.map(e => (
          <Card key={e.id} style={{ marginBottom: 10 }}>
            <View style={s.row}>
              <Text style={{ fontSize: 32 }}>{e.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.cardTitle}>{e.title}</Text>
                <Text style={s.cardSub}>{e.type}</Text>
                {e.status === 'watched' && (
                  <View style={s.row}>
                    {[1,2,3,4,5].map(n => (
                      <TouchableOpacity key={n} onPress={() => setRating(e.id, n)}>
                        <Text style={{ fontSize: 16, color: n <= (e.rating || 0) ? '#f59e0b' : '#e2e8f0' }}>★</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <Badge label={e.status === 'want' ? 'Watch Next' : e.status === 'watching' ? 'Watching' : 'Watched ✓'}
                  bg={statusColors[e.status]?.bg} color={statusColors[e.status]?.color} />
                <View style={s.row}>
                  {['want','watching','watched'].map(st => (
                    <TouchableOpacity key={st} onPress={() => setStatus(e.id, st)}
                      style={[s.microBtn, e.status === st && { backgroundColor: COLORS.primary }]}>
                      <Text style={[{ fontSize: 9, fontWeight: '700' }, e.status === st && { color: '#fff' }]}>
                        {st === 'want' ? 'Next' : st === 'watching' ? 'Now' : 'Done'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity onPress={() => del(e.id)}><Text style={s.delBtn}>🗑️</Text></TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      <AddModal visible={modal} onClose={() => setModal(false)} onAdd={addEnt} type="ent" />
      <TouchableOpacity style={[s.fab, { backgroundColor: COLORS.ent }]} onPress={() => setModal(true)}><Text style={s.fabText}>+</Text></TouchableOpacity>
    </View>
  );
}

// ── TASKS TAB ──────────────────────────────────────────────────────────────
function TasksTab({ data, upd }) {
  const [catF, setCatF] = useState('all');
  const [modal, setModal] = useState(false);
  const catEmoji = { routine: '🔄', exam: '📚', work: '💼', personal: '💜' };
  const catColors = { routine: '#ca8a04', exam: '#ef4444', work: '#3b82f6', personal: '#a855f7' };
  const catBg = { routine: '#fef9c3', exam: '#fee2e2', work: '#dbeafe', personal: '#f3e8ff' };

  const filtered = data.tasks.filter(t => catF === 'all' || t.cat === catF);
  const pending = filtered.filter(t => !t.done);
  const done = filtered.filter(t => t.done);

  const toggle = (id) => upd('tasks', data.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const del = (id) => upd('tasks', data.tasks.filter(t => t.id !== id));
  const addTask = (f) => upd('tasks', [...data.tasks, { id: Date.now(), title: f.name, cat: f.cat || 'personal', due: f.due || null, recurring: false, done: false, to: f.to || 'Me', reminder: f.reminder || null }]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillRow}>
        {['all','routine','exam','work','personal'].map(c => (
          <TouchableOpacity key={c} onPress={() => setCatF(c)}
            style={[s.pill, catF === c && { backgroundColor: c === 'all' ? COLORS.primary : catColors[c] }]}>
            <Text style={[s.pillText, catF === c && { color: '#fff' }]}>
              {c === 'all' ? '📋 All' : `${catEmoji[c]} ${c.charAt(0).toUpperCase() + c.slice(1)}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 14 }}>
        {pending.length === 0 && done.length === 0 && <View style={s.empty}><Text style={s.emptyIcon}>✅</Text><Text style={s.emptyText}>No tasks here!</Text></View>}

        {pending.map(t => (
          <Card key={t.id} style={{ marginBottom: 10 }}>
            <View style={s.row}>
              <Checkbox checked={false} onPress={() => toggle(t.id)} color={COLORS.tasks} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={s.cardTitle}>{t.title}</Text>
                <View style={[s.row, { flexWrap: 'wrap', gap: 4, marginTop: 6 }]}>
                  <Badge label={`${catEmoji[t.cat]} ${t.cat}`} bg={catBg[t.cat]} color={catColors[t.cat]} />
                  <Badge label={`👤 ${t.to}`} bg={t.to === 'Me' ? '#ede9fe' : '#fef9c3'} color={t.to === 'Me' ? '#6c63ff' : '#ca8a04'} />
                  {t.due && <Badge label={`📅 ${t.due}`} bg="#fee2e2" color="#ef4444" />}
                  {t.reminder && <Badge label={`🔔 ${t.reminder}`} bg="#dcfce7" color="#16a34a" />}
                  {t.recurring && <Badge label="🔄 Recurring" bg="#f1f5f9" color="#64748b" />}
                </View>
              </View>
              <TouchableOpacity onPress={() => del(t.id)}><Text style={s.delBtn}>🗑️</Text></TouchableOpacity>
            </View>
          </Card>
        ))}

        {done.length > 0 && <>
          <SectionTitle title="✅ Completed" />
          {done.map(t => (
            <Card key={t.id} style={{ marginBottom: 8, opacity: 0.6 }}>
              <View style={s.row}>
                <Checkbox checked={true} onPress={() => toggle(t.id)} color={COLORS.tasks} />
                <Text style={[s.iName, s.done, { flex: 1, marginLeft: 10 }]}>{t.title}</Text>
                <TouchableOpacity onPress={() => del(t.id)}><Text style={s.delBtn}>🗑️</Text></TouchableOpacity>
              </View>
            </Card>
          ))}
        </>}
        <View style={{ height: 80 }} />
      </ScrollView>

      <AddModal visible={modal} onClose={() => setModal(false)} onAdd={addTask} type="task" />
      <TouchableOpacity style={[s.fab, { backgroundColor: COLORS.tasks }]} onPress={() => setModal(true)}><Text style={s.fabText}>+</Text></TouchableOpacity>
    </View>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('home');
  const [data, setData] = useState(SEED);
  const upd = (key, val) => setData(d => ({ ...d, [key]: val }));

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home', color: COLORS.primary },
    { id: 'shopping', icon: '🛒', label: 'Shop', color: COLORS.shopping },
    { id: 'trips', icon: '✈️', label: 'Trips', color: COLORS.trip },
    { id: 'wishlist', icon: '⭐', label: 'Wishes', color: COLORS.wish },
    { id: 'entertainment', icon: '🎬', label: 'Watch', color: COLORS.ent },
    { id: 'tasks', icon: '✅', label: 'Tasks', color: COLORS.tasks },
  ];

  const headers = {
    home: { title: 'FamList 👨‍👩‍👧', sub: 'Welcome back!' },
    shopping: { title: 'Shopping 🛒', sub: 'Track your purchases' },
    trips: { title: 'Trip Planner ✈️', sub: 'Pack smart, travel happy' },
    wishlist: { title: 'My Wishlist ⭐', sub: 'Dreams & future plans' },
    entertainment: { title: 'Watch List 🎬', sub: 'Movies · Series · Serials' },
    tasks: { title: 'Tasks ✅', sub: 'Stay on top of everything' },
  };
  const hdr = headers[tab];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>{hdr.title}</Text>
        <Text style={s.headerSub}>{hdr.sub}</Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        {tab === 'home' && <HomeTab data={data} setTab={setTab} />}
        {tab === 'shopping' && <ShoppingTab data={data} upd={upd} />}
        {tab === 'trips' && <TripsTab data={data} upd={upd} />}
        {tab === 'wishlist' && <WishlistTab data={data} upd={upd} />}
        {tab === 'entertainment' && <EntertainmentTab data={data} upd={upd} />}
        {tab === 'tasks' && <TasksTab data={data} upd={upd} />}
      </View>

      {/* Bottom Nav */}
      <View style={s.nav}>
        {navItems.map(n => (
          <TouchableOpacity key={n.id} style={s.navItem} onPress={() => setTab(n.id)}>
            <View style={[s.navIcon, tab === n.id && { backgroundColor: n.color + '22' }]}>
              <Text style={{ fontSize: 20 }}>{n.icon}</Text>
            </View>
            <Text style={[s.navLabel, tab === n.id && { color: n.color }]}>{n.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  nav: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 8, paddingBottom: 12, borderTopWidth: 1, borderTopColor: '#e8edf5' },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 9, fontWeight: '800', color: COLORS.muted },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  statsRow: { flexDirection: 'row', gap: 9, marginBottom: 4, paddingHorizontal: 14, marginTop: 14 },
  statCard: { flex: 1, alignItems: 'center', padding: 13 },
  statNum: { fontSize: 22, fontWeight: '900' },
  statLbl: { fontSize: 9, color: COLORS.muted, fontWeight: '800', marginTop: 1, textTransform: 'uppercase' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 14 },
  qCard: { width: '47%', borderRadius: 16, padding: 15 },
  qNum: { fontSize: 26, fontWeight: '900', color: '#fff' },
  qLbl: { fontSize: 12, fontWeight: '800', color: '#fff', marginTop: 2 },
  reminderCard: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 14, marginBottom: 8 },
  reminderTitle: { fontWeight: '700', fontSize: 13, color: COLORS.text },
  reminderSub: { fontSize: 11, color: COLORS.muted },
  hCard: { width: 120, backgroundColor: '#fff', borderRadius: 14, padding: 13, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  hCardTitle: { fontWeight: '800', fontSize: 12, color: COLORS.text, marginBottom: 5 },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 16, marginBottom: 8, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center' },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  btnText: { fontWeight: '800', fontSize: 13 },
  btnSm: { paddingHorizontal: 11, paddingVertical: 5 },
  badge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20, marginTop: 4 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  cb: { width: 23, height: 23, borderRadius: 8, borderWidth: 2.5, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  pillRow: { paddingHorizontal: 14, marginBottom: 4, marginTop: 10 },
  pill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 },
  pillText: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  cardTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  cardSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  iName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  iMeta: { fontSize: 11, color: COLORS.muted, marginTop: 1 },
  done: { textDecorationLine: 'line-through', color: COLORS.muted },
  delBtn: { fontSize: 16 },
  progBar: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden', marginTop: 10 },
  progFill: { height: '100%', borderRadius: 3 },
  hero: { borderRadius: 18, padding: 18, marginBottom: 10 },
  heroTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginTop: 4 },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5, marginTop: 10 },
  heroBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  tabs: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 3, marginBottom: 10 },
  tab: { flex: 1, paddingVertical: 7, borderRadius: 10, alignItems: 'center' },
  tabOn: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 11, fontWeight: '800', color: COLORS.muted },
  tabTextOn: { color: COLORS.text },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 44, marginBottom: 10 },
  emptyText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  fab: { position: 'absolute', bottom: 16, right: 16, width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 17, fontWeight: '900', color: COLORS.text },
  label: { fontSize: 11, fontWeight: '900', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  input: { borderWidth: 2, borderColor: '#e8edf5', borderRadius: 11, padding: 11, fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 },
  optRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  optBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#f1f5f9' },
  optText: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  microBtn: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, backgroundColor: '#f1f5f9', marginLeft: 3 },
});
