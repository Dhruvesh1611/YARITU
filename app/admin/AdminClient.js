"use client";


import React, { useEffect, useState } from 'react';
import styles from './admin.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminClient() {
  const [tab, setTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const router = useRouter();

  const [contactCount, setContactCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const searchParams = useSearchParams();

  // sync tab with query param when the page loads or when the query param changes
  useEffect(() => {
    const qp = searchParams?.get?.('tab');
    if (qp && (qp === 'contacts' || qp === 'offers')) {
      setTab(qp);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
    fetchCounts();
  }, [tab]);

  const fetchCounts = async () => {
    try {
      const c = await fetch('/api/contact', { credentials: 'include' });
      if (c.ok) {
        const j = await c.json();
        setContactCount((j.data || []).length);
      }
      const o = await fetch('/api/admin/offers', { credentials: 'include' });
      if (o.ok) {
        const j2 = await o.json();
        setOfferCount((j2.data || []).length);
      }
      const s = await fetch('/api/admin/subscriptions', { credentials: 'include' });
      if (s.ok) {
        const j3 = await s.json();
        setSubscriptionCount((j3.data || []).length);
      }
    } catch (e) {
      // ignore
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      if (tab === 'contacts') {
        const res = await fetch('/api/contact', { credentials: 'include' });
        if (res.status === 401 || res.status === 403) {
          setAuthError(true);
          return;
        }
        if (!res.ok) throw new Error('Failed to load contacts');
        const j = await res.json();
        setContacts(j.data || []);
      } else {
        if (tab === 'offers') {
          const res = await fetch('/api/admin/offers', { credentials: 'include' });
          if (res.status === 401 || res.status === 403) {
            setAuthError(true);
            return;
          }
          if (!res.ok) throw new Error('Failed to load offers');
          const j = await res.json();
          setOffers(j.data || []);
        } else if (tab === 'subscriptions') {
          const res = await fetch('/api/admin/subscriptions', { credentials: 'include' });
          if (res.status === 401 || res.status === 403) {
            setAuthError(true);
            return;
          }
          if (!res.ok) throw new Error('Failed to load subscriptions');
          const j = await res.json();
          setSubscriptions(j.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, which) => {
    try {
      const endpoint = which === 'contact' ? '/api/contact/delete' : '/api/admin/offers/delete';
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Delete failed');
      await fetchData();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed. Please try again.');
    }
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1>Admin Dashboard</h1>
        </div>
        <div className={styles.headerButtonsWrapper}>
          <div className={styles.tabs}>
            <button
              className={tab === 'contacts' ? styles.active : ''}
              onClick={() => {
                setTab('contacts');
                router.replace('/admin?tab=contacts');
              }}
            >
              Contact Submissions
            </button>
            <button
              className={tab === 'offers' ? styles.active : ''}
              onClick={() => {
                setTab('offers');
                router.replace('/admin?tab=offers');
              }}
            >
              Offer Signups
            </button>
            <button
              className={tab === 'subscriptions' ? styles.active : ''}
              onClick={() => {
                setTab('subscriptions');
                router.replace('/admin?tab=subscriptions');
              }}
            >
              Subscribe Mobile Numbers
            </button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className={styles.adminDrawerOverlay} onClick={() => setDrawerOpen(false)}>
          <div className={styles.adminDrawer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.drawerBtn} onClick={() => { setTab('contacts'); setDrawerOpen(false); router.replace('/admin?tab=contacts'); }}>
              Submissions
            </button>
            <button className={styles.drawerBtn} onClick={() => { setTab('offers'); setDrawerOpen(false); router.replace('/admin?tab=offers'); }}>
              Offer Signups
            </button>
          </div>
        </div>
      )}

      <div className={styles.content}>
        {authError && (
          <div className={styles.errorBox}>
            <p>You are not signed in as an admin. Please <a href="/api/auth/signin">sign in</a> with an admin account to view submissions.</p>
          </div>
        )}
        {loadError && (
          <div className={styles.warningBox}>Failed to load data. Please check the server logs and try again.</div>
        )}
        {loading && <p>Loading...</p>}

        {!loading && !authError && !loadError && tab === 'contacts' && (
          <div>
            {contacts.length === 0 && <p>No contact submissions yet.</p>}
            {contacts.map(c => (
              <div key={c._id} className={styles.item}>
                <div className={styles.itemMain}>
                  <div><strong>{c.fullName || c.name || '—'}</strong> <small>{c.email}</small></div>
                  <div>{c.subject}</div>
                  <div>{c.message}</div>
                </div>
                <div className={styles.itemActions}>
                  <div>{new Date(c.createdAt).toLocaleString()}</div>
                  <button onClick={() => handleDelete(c._id, 'contact')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !authError && !loadError && tab === 'offers' && (
          <div>
            {offers.length === 0 && <p>No offer signups yet.</p>}
            {offers.map(o => (
              <div key={o._id} className={styles.item}>
                <div className={styles.itemMain}>
                  <div><strong>{o.name || '—'}</strong> <small>{o.email || o.phone}</small></div>
                  <div>{o.email || o.city || '—'}</div>
                </div>
                <div className={styles.itemActions}>
                  <div>{new Date(o.createdAt).toLocaleString()}</div>
                  <button onClick={() => handleDelete(o._id, 'offers')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !authError && !loadError && tab === 'subscriptions' && (
          <div>
            {subscriptions.length === 0 && <p>No subscriptions yet.</p>}
            {subscriptions.map(s => (
              <div key={s._id} className={styles.item}>
                <div className={styles.itemMain}>
                  <div><strong>{s.phone || '—'}</strong> <small>{s.email || s.name}</small></div>
                </div>
                <div className={styles.itemActions}>
                  <div>{new Date(s.createdAt).toLocaleString()}</div>
                  <button onClick={() => handleDelete(s._id, 'subscriptions')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
