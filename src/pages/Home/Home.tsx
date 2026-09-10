import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

type View = 'home' | 'cart' | 'payment' | 'success' | 'failure' | 'orders' | 'profile';
type Cart = Record<number, number>;
type Category = 'Burger' | 'Pizza' | 'Tacos' | 'Sandwich' | 'Poulet' | 'Autres';
type Product = { id: number; name: string; detail: string; price: number; category: Category; image: string };
type ActiveOrder = { restaurant: string; restaurantAddress: string; clientAddress: string; createdAt: number };

const products: Product[] = [
  { id: 1, name: 'Poulet Frit', detail: 'Crispy & Savoureux', price: 9.99, category: 'Poulet', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Crispy Golden', detail: 'Burger Croustillant', price: 13.5, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'French Tacos', detail: 'Tacos Généreux', price: 11, category: 'Tacos', image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Pillon Poulet', detail: 'Doré & Fondant', price: 9.99, category: 'Poulet', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=500&q=80' },
  { id: 5, name: 'Pizza Margherita', detail: 'Tomate, mozzarella & basilic', price: 10, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80' },
  { id: 6, name: 'Wrap Mexicain', detail: 'Poulet épicé & crudités', price: 8.9, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=80' },
  { id: 7, name: 'Big Mac Classic', detail: 'Double steak & sauce maison', price: 12.5, category: 'Burger', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80' },
  { id: 8, name: 'Bowl Saumon', detail: 'Saumon, avocat & riz', price: 14.9, category: 'Autres', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80' },
  { id: 9, name: 'Pâtes Carbonara', detail: 'Crème, parmesan & lardons', price: 11.9, category: 'Autres', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80' },
  { id: 10, name: 'Salade César', detail: 'Poulet, parmesan & croûtons', price: 9.5, category: 'Autres', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=500&q=80' },
  { id: 11, name: 'Tacos Poulet', detail: 'Poulet mariné & sauce fromagère', price: 10.9, category: 'Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=500&q=80' },
  { id: 12, name: 'Pizza Pepperoni', detail: 'Pepperoni & mozzarella', price: 12, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80' },
];
const money = (value: number) => `${value.toFixed(2).replace('.', ',')} €`;
const restaurantFor = (category: Category) => category === 'Pizza'
  ? { name: 'Pizza Roma', address: '8 place du Vieux-Marché, Rouen' }
  : category === 'Burger' || category === 'Sandwich'
    ? { name: 'Burger House', address: '12 rue Jeanne-d’Arc, Rouen' }
    : { name: 'Good Chicken', address: '24 avenue Pasteur, Rouen' };
const Icon = ({ children }: { children: React.ReactNode }) => <span className="nav-icon">{children}</span>;

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>('home');
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(() => {
    try { return JSON.parse(localStorage.getItem('goodfood-active-order-details') || 'null'); } catch { return null; }
  });
  const [cart, setCart] = useState<Cart>(() => {
    try { return JSON.parse(localStorage.getItem('goodfood-cart') || '{}'); } catch { return {}; }
  });
  useEffect(() => localStorage.setItem('goodfood-cart', JSON.stringify(cart)), [cart]);
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
  const total = subtotal ? subtotal + 3.99 : 0;
  const update = (id: number, delta: number) => setCart(current => {
    const quantity = Math.max(0, (current[id] || 0) + delta);
    const next = { ...current };
    if (quantity) next[id] = quantity; else delete next[id];
    return next;
  });
  const handleLogout = async () => { await logout(); navigate('/auth'); };

  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">♨</span> Good<span>Food</span></div><nav>
    <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}><Icon>⌂</Icon>Accueil</button>
    <button className={['cart','payment','success','failure'].includes(view) ? 'active' : ''} onClick={() => setView('cart')}><Icon>🛒</Icon>Panier</button>
    <button className={view === 'orders' ? 'active' : ''} onClick={() => setView('orders')}><Icon>▤</Icon>Commande</button>
    <button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}><Icon>♙</Icon>Utilisateur</button>
  </nav><button className="logout-link" onClick={handleLogout}>↪ Déconnexion</button></aside><main className="dashboard">
    {view === 'home' && <HomeView cart={cart} count={count} subtotal={subtotal} update={update} onCart={() => setView('cart')} />}
    {view === 'cart' && <CartView cart={cart} subtotal={subtotal} total={total} update={update} onPay={() => setView('payment')} />}
    {view === 'payment' && <PaymentView subtotal={subtotal} total={total} onSuccess={() => { const first=products.find(p=>cart[p.id]); const restaurant=restaurantFor(first?.category || 'Autres'); const order={restaurant:restaurant.name,restaurantAddress:restaurant.address,clientAddress:deliveryAddress(),createdAt:Date.now()}; setActiveOrder(order); localStorage.setItem('goodfood-active-order-details',JSON.stringify(order)); setCart({}); setView('success'); }} onFailure={() => setView('failure')} />}
    {view === 'success' && <PaymentResult success total={total || 30.99} onAction={() => setView('orders')} />}
    {view === 'failure' && <PaymentResult success={false} total={total} onAction={() => setView('payment')} />}
    {view === 'orders' && (activeOrder ? <TrackingView order={activeOrder} /> : <NoActiveOrder onBrowse={() => setView('home')} />)}{view === 'profile' && <SettingsView name={user?.name ?? 'Utilisateur'} email={user?.email ?? ''} onLogout={handleLogout} />}
  </main></div>;
}

function deliveryAddress() { try { const p=JSON.parse(localStorage.getItem('goodfood-profile')||'{}'); return p.address ? `${p.address}, ${p.postalCode || ''} ${p.city || ''}`.trim() : '80 avenue Edmund, Rouen'; } catch { return '80 avenue Edmund, Rouen'; } }
function AddressBar() { return <div className="address"><span>●</span><small>Adresse de livraison<strong>{deliveryAddress()}</strong></small><button>Modifier</button></div>; }

function HomeView({ cart, count, subtotal, update, onCart }: { cart: Cart; count: number; subtotal:number; update: (id:number,d:number)=>void; onCart:()=>void }) {
  const [category,setCategory]=useState<'Tout'|Category>('Tout');
  const [cartPreviewOpen,setCartPreviewOpen]=useState(false);
  const categories: Array<'Tout'|Category>=['Tout','Burger','Pizza','Tacos','Sandwich','Poulet','Autres'];
  const displayed=category==='Tout'?products:products.filter(product=>product.category===category);
  const add=(id:number)=>{update(id,1);setCartPreviewOpen(true)};
  const cartItems=products.filter(product=>cart[product.id]);
  return <><header className="topbar"><div><small>Adresse de livraison</small><strong>📍 {deliveryAddress()}</strong></div><div className="top-actions"><button>⌕</button><button onClick={()=>count?setCartPreviewOpen(true):onCart()}>🛒{count > 0 && <b>{count}</b>}</button></div></header><section className="hero"><div><span>-25%</span><p>Offre Spéciale</p><h1>Burger Double Steack</h1></div><div className="hero-burger">🍔</div></section><section className="content-section"><h2>Catégories</h2><div className="chips">{categories.map(item=><button key={item} className={category===item?'selected':''} onClick={()=>setCategory(item)}>{item}</button>)}</div><div className="section-title"><h2>{category==='Tout'?'Populaires':category}</h2><span className="result-count">{displayed.length} plat{displayed.length>1?'s':''}</span></div><div className="product-grid">{displayed.map(p => { const q=cart[p.id]||0; return <article className={q ? 'product selected-product':'product'} key={p.id}><img src={p.image} alt={p.name}/><h3>{p.name}</h3><p>{p.detail}</p><footer><strong>{money(p.price)}</strong>{q ? <div className="counter"><button onClick={()=>update(p.id,-1)}>−</button><span>{q}</span><button onClick={()=>add(p.id)}>+</button></div>:<button className="add" onClick={()=>add(p.id)}>+</button>}<button className="heart">♡</button></footer></article>})}</div><div className="section-title recommend-title"><h2>Recommandés pour vous</h2><button>Voir tout →</button></div><div className="recommendations">{products.slice(1,4).map(p=><article key={p.id}><img src={p.image} alt=""/><div><b>{p.name}</b><small>{p.category} · 15 min</small></div><strong>{money(p.price)}</strong></article>)}</div></section>{cartPreviewOpen&&count>0&&<><button className="cart-preview-overlay" aria-label="Fermer le mini-panier" onClick={()=>setCartPreviewOpen(false)}/><aside className="cart-preview"><header><div><h2>Mon panier</h2><span>{count} article{count>1?'s':''}</span></div><button onClick={()=>setCartPreviewOpen(false)}>×</button></header><div className="cart-preview-items">{cartItems.map(p=><article key={p.id}><img src={p.image} alt=""/><div><b>{p.name}</b><small>{money(p.price)} × {cart[p.id]}</small><div className="counter"><button onClick={()=>update(p.id,-1)}>−</button><span>{cart[p.id]}</span><button onClick={()=>add(p.id)}>+</button></div></div><strong>{money(p.price*cart[p.id])}</strong></article>)}</div><footer><div><span>Sous-total</span><strong>{money(subtotal)}</strong></div><small>Frais de livraison calculés à l’étape suivante</small><button className="main-action" onClick={onCart}>Voir mon panier</button></footer></aside></>}</>;
}

function CartView({cart,subtotal,total,update,onPay}:{cart:Cart;subtotal:number;total:number;update:(id:number,d:number)=>void;onPay:()=>void}) {
  const items=products.filter(p=>cart[p.id]);
  return <section className="page-card"><h1>Mon Panier</h1><AddressBar/>{items.length ? items.map(p=><article className="cart-item" key={p.id}><img src={p.image} alt={p.name}/><div><small>{p.detail}</small><h2>{p.name}</h2><strong>{money(p.price*cart[p.id])}</strong></div><div className="counter large"><button onClick={()=>update(p.id,-1)}>−</button><span>{cart[p.id]}</span><button onClick={()=>update(p.id,1)}>+</button></div></article>):<div className="empty-cart"><span>🛒</span><h2>Votre panier est vide</h2><p>Ajoutez un plat depuis l’accueil.</p></div>}<OrderTotal subtotal={subtotal} total={total}/><button className="main-action" disabled={!items.length} onClick={onPay}>Valider la commande</button></section>;
}
function OrderTotal({subtotal,total}:{subtotal:number;total:number}) { return <div className="totals"><p><span>Total panier</span><span>{money(subtotal)}</span></p><p><span>Réduction</span><span>0,00 €</span></p><p><span>Frais de livraison <small>(TVA incluse)</small></span><span>{subtotal ? '3,99 €':'0,00 €'}</span></p><hr/><h3><span>Total</span><span>{money(total)}</span></h3></div>; }
function PaymentView({subtotal,total,onSuccess,onFailure}:{subtotal:number;total:number;onSuccess:()=>void;onFailure:()=>void}) { return <section className="payment-page"><div className="payment-main"><h1>Paiement</h1><AddressBar/><div className="payment-form"><label>Mode de paiement</label><input placeholder="💳  0000 0000 0000 0000"/><div><input placeholder="MM / AA"/><input placeholder="CVV        🔒"/></div><input placeholder="Prénom Nom"/><small>Nom sur la carte</small><label className="save"><input type="checkbox"/> Enregistrer cette carte</label></div><button className="main-action" onClick={onSuccess}>Payer {money(total)}</button><button className="failure-demo" onClick={onFailure}>Simuler un paiement refusé</button></div><div className="summary"><OrderTotal subtotal={subtotal} total={total}/></div></section>; }
function PaymentResult({success,total,onAction}:{success:boolean;total:number;onAction:()=>void}) { return <section className={`payment-result ${success?'is-success':'is-failure'}`}><h1>Paiement</h1><div className="result-content"><div className="result-icon">{success?'✓':'×'}</div><h2>{success?'Paiement accepté !':'Paiement refusé'}</h2><p>{success?'Votre commande a été confirmée avec succès':'Votre paiement n’a pas pu être traité'}</p>{success?<div className="receipt"><small>Numéro de commande</small><strong>#CMD-20260227-4821</strong><hr/><small>Montant débité</small><b>{money(total)}</b></div>:<div className="payment-alert"><b>!</b><span><strong>Transaction refusée</strong><small>Vérifiez vos informations de carte<br/>ou contactez votre banque</small></span></div>}<button className="main-action" onClick={onAction}>{success?'Suivre ma commande':'Réessayer'}</button></div></section>; }
function TrackingView({order}:{order:ActiveOrder}) { return <section className="tracking"><h1>Suivi de commande</h1><div className="trip-summary"><div><span className="restaurant-pin">R</span><p><small>Départ · Restaurant</small><strong>{order.restaurant}</strong><em>{order.restaurantAddress}</em></p></div><div><span className="client-pin">⌂</span><p><small>Arrivée · Votre adresse</small><strong>Chez vous</strong><em>{order.clientAddress}</em></p></div></div><div className="tracking-grid"><div className="map"><div className="map-grid"/><span className="map-home" title={order.clientAddress}>⌂</span><span className="map-car">🚗</span><span className="map-shop" title={order.restaurantAddress}>R</span><div className="route route-dynamic"/><div className="map-label restaurant-label">{order.restaurant}</div><div className="map-label client-label">{order.clientAddress}</div></div><div className="tracking-side"><div className="delivery-status"><small>Trajet : {order.restaurant} → votre adresse</small><p className="done">✓ <span>Commande confirmée<small>Validée</small></span></p><p className="done">✓ <span>Préparation terminée<small>{order.restaurant}</small></span></p><p className="current">● <span>Le livreur est en route<small>Vers {order.clientAddress}</small></span></p><p>○ <span>Livraison effectuée</span></p></div><div className="driver"><div>◷ <span><b>10 min</b><small>Temps estimé</small></span></div><div><span className="avatar">TM</span><span><b>Thomas M.</b><small>Votre livreur</small></span></div></div><div className="delivery-code"><small>Code à communiquer au livreur</small><strong>4821</strong></div><button className="main-action">Contacter le livreur</button></div></div></section>; }
function NoActiveOrder({onBrowse}:{onBrowse:()=>void}) { return <section className="no-order"><div className="no-order-icon">▤</div><h1>Aucune commande en cours</h1><p>Vous n’avez pas encore de commande à suivre.<br/>Découvrez nos plats et passez votre première commande.</p><button className="main-action" onClick={onBrowse}>Découvrir les plats</button></section>; }
function SettingsView({name,email,onLogout}:{name:string;email:string;onLogout:()=>void}) {
  const stored = (() => { try { return JSON.parse(localStorage.getItem('goodfood-profile') || '{}'); } catch { return {}; } })();
  const [profile,setProfile]=useState({name:stored.name||name,email:stored.email||email,phone:stored.phone||'',address:stored.address||'80 avenue Edmund, Rouen',postalCode:stored.postalCode||'76000',city:stored.city||'Rouen'});
  const [saved,setSaved]=useState(false);
  const change=(field:keyof typeof profile,value:string)=>{setProfile(current=>({...current,[field]:value}));setSaved(false)};
  const save=(event:React.FormEvent)=>{event.preventDefault();localStorage.setItem('goodfood-profile',JSON.stringify(profile));const currentUser=localStorage.getItem('user');if(currentUser){try{localStorage.setItem('user',JSON.stringify({...JSON.parse(currentUser),name:profile.name,email:profile.email}))}catch{/* données utilisateur invalides */}}setSaved(true)};
  return <section className="settings profile-settings"><h1>Mon profil</h1><p className="settings-intro">Gérez vos informations personnelles et votre adresse de livraison.</p><form className="profile-form" onSubmit={save}><div className="profile-section"><div className="profile-section-title"><span>♙</span><div><h2>Informations personnelles</h2><p>Les informations associées à votre compte</p></div></div><div className="profile-fields"><label>Nom complet<input value={profile.name} onChange={e=>change('name',e.target.value)} required/></label><label>Adresse e-mail<input type="email" value={profile.email} onChange={e=>change('email',e.target.value)} required/></label><label className="full-field">Téléphone<input type="tel" value={profile.phone} onChange={e=>change('phone',e.target.value)} placeholder="06 12 34 56 78"/></label></div></div><div className="profile-section"><div className="profile-section-title"><span>⌖</span><div><h2>Adresse de livraison</h2><p>Adresse utilisée par défaut pour vos commandes</p></div></div><div className="profile-fields"><label className="full-field">Adresse<input value={profile.address} onChange={e=>change('address',e.target.value)} required/></label><label>Code postal<input value={profile.postalCode} onChange={e=>change('postalCode',e.target.value)} required/></label><label>Ville<input value={profile.city} onChange={e=>change('city',e.target.value)} required/></label></div></div>{saved&&<div className="profile-success">✓ Vos informations ont bien été enregistrées.</div>}<button className="main-action profile-save" type="submit">Enregistrer les modifications</button></form><button className="settings-logout" onClick={onLogout}>Se déconnecter</button></section>;
}
