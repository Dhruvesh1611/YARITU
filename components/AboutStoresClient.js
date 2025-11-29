"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import StoreImageGalleryClient from './StoreImageGalleryClient';
import EditStoreImagesModal from './EditStoreImagesModal';
import styles from '../app/about/about.module.css';
import { buildGoogleMapsUrl } from '../utils/maps';

export default function AboutStoresClient() {
  const { data: session } = useSession();
  const isAdmin = !!(session?.user?.isAdmin || session?.user?.role === 'admin');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStore, setEditingStore] = useState(null);

  const sortStoresByName = (arr) => {
    if (!Array.isArray(arr)) return arr;
    return arr.slice().sort((a, b) => {
      const na = (a?.name || a?.city || '').toString().trim();
      const nb = (b?.name || b?.city || '').toString().trim();
      return na.localeCompare(nb, undefined, { sensitivity: 'base', numeric: true });
    });
  };

  const makeTelHref = (p) => {
    if (!p) return '';
    try {
      const s = p.toString().trim();
      // Keep leading + if present, otherwise keep digits only
      const cleaned = (s.startsWith('+') ? '+' : '') + s.replace(/[^0-9]/g, '');
      return cleaned || '';
    } catch (e) {
      return p;
    }
  };


  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/stores', { cache: 'no-store' });
        const j = await res.json();
  if (!res.ok || !j.success) throw new Error(j.error || j.message || 'Failed to load stores');
  if (isMounted) setStores(sortStoresByName(Array.isArray(j.data) ? j.data : []));
      } catch (e) {
        console.error(e);
        if (isMounted) setError(e.message || 'Failed to load stores');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const onSaved = (updated) => {
    setStores(prev => {
      const updatedList = prev.map(s => (s._id === updated._id ? updated : s));
      return sortStoresByName(updatedList);
    });
  };

  if (loading) {
    return <div className="container"><p>Loading stores…</p></div>;
  }
  if (error) {
    return <div className="container"><p style={{ color: 'crimson' }}>{error}</p></div>;
  }

  return (
    <div className="container">
      <div className={styles.storesHeader}>
        <h2>Visit Our <span className="highlight">Stores</span></h2>
        <p>Experience our collections firsthand at our premium boutiques</p>
      </div>
     
      <div className={styles.storesGrid}>
        {(() => {
          const sortedStores = Array.isArray(stores)
            ? [...stores].sort((a, b) => {
                const na = String(a?.name || a?.city || '').trim();
                const nb = String(b?.name || b?.city || '').trim();
                return na.localeCompare(nb, undefined, { sensitivity: 'base', numeric: true });
              })
            : stores;
          return sortedStores.map((store, index) => {
          const name = store.name || store.city || 'Store';
          const address = store.address || '';
          const phone = store.phone || '';
          const telHref = makeTelHref(phone);
          const mapHref = buildGoogleMapsUrl(store.mapQuery || address);
          const images = Array.isArray(store.images) && store.images.length
            ? store.images
            : (store.imageUrl ? [store.imageUrl] : []);
              return (
            <div key={store._id || index} className={`${styles.aboutStoreCard} ${index % 2 !== 0 ? styles.cardReverse : ''}`}>
              <div className={styles.storeDetails}>
                <h3>{name}</h3>
                {address ? (
                  <p className={styles.address}>
                    <a href={mapHref} target="_blank" rel="noopener noreferrer">{address}</a>
                  </p>
                ) : null}
                {phone ? (
                  <p className={styles.phone}>
                    <a href={telHref ? `tel:${telHref}` : `tel:${phone}`} aria-label={`Call ${name}`}>
                      <span className={styles.phoneIcon} aria-hidden="true">📞</span>
                      <span className={styles.phoneText}>{phone}</span>
                    </a>
                  </p>
                ) : null}
                <a href={mapHref} target="_blank" rel="noopener noreferrer" className={styles.storeButton}>Get Directions</a>
                
              </div>
              <a href={mapHref} target="_blank" rel="noopener noreferrer" className={styles.storeImage}>
                <div className={styles.storeImageInner}>
                  {/* Make the first two store images eager to avoid visible lazy-load jank on mobile */}
                  <StoreImageGalleryClient images={images} alt={`${name} Store Interior`} eager={index < 2} />
                </div>
              </a>
            </div>
          );
          });
        })()}
      </div>
      {editingStore && (
        <EditStoreImagesModal
          store={editingStore}
          onClose={() => setEditingStore(null)}
          onSaved={(s) => { onSaved(s); setEditingStore(null); }}
        />
      )}
    </div>
  );
}
