"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './ChangeAdminCredentials.module.css';

export default function ChangeAdminCredentials() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!session || !session.user || session.user.role !== 'admin') return null;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username || undefined, password: password || undefined }),
      });
      const data = await res.json();
      if (data?.success) {
        setMessage({ type: 'success', text: 'Credentials updated successfully' });
        setUsername('');
        setPassword('');
        setOpen(false);
      } else {
        setMessage({ type: 'error', text: data?.error || 'Update failed' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <button onClick={() => setOpen(true)} className={styles.btn} aria-label="Change admin credentials">Change Creds</button>

      {open && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="change-creds-title">
          <div className={styles.modalCard}>
            <h3 id="change-creds-title" className={styles.modalHeader}>Update Admin Credentials</h3>
            <form onSubmit={submit}>
              <label className={styles.label}>Username (leave blank to keep)</label>
              <input className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />

              <label className={styles.label}>Password (leave blank to keep)</label>
              <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <div className={styles.actions}>
                <button type="button" onClick={() => setOpen(false)} disabled={loading} className={styles.secondary}>Cancel</button>
                <button type="submit" disabled={loading} className={styles.primary}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
            {message && (
              <div className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>{message.text}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
