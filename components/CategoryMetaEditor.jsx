"use client";

import React, { useEffect, useMemo, useState } from 'react';

// BUG 1 FIX: 'collections' prop yahaan se poori tarah se hata diya gaya hai
export default function CategoryMetaEditor({
  category, // 'MEN' | 'WOMEN' | 'CHILDREN'
  metaMap, // the current metaOptions map from page state
  onClose,
  onSaved,
}) {
  const isChildren = category === 'CHILDREN';
  const primaryChoices = isChildren
    ? [ { key: 'BOYS', label: 'BOYS' }, { key: 'GIRLS', label: 'GIRLS' } ]
    : [ { key: 'type', label: 'RENT BY TYPE' }, { key: 'occasion', label: 'RENT BY OCCASION' } ];

  const [scope, setScope] = useState(primaryChoices[0].key);
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);

  // derive meta key in DB based on scope
  const metaKey = useMemo(() => {
    if (isChildren) {
      const subgroup = scope === 'BOYS' ? 'boys' : 'girls';
      return `collectionType_children_${subgroup}`;
    }
    if (scope === 'type') return `collectionType_${category.toLowerCase()}`;
    return `occasion_${category.toLowerCase()}`;
  }, [category, isChildren, scope]);

  // BUG 2 FIX: useEffect se saara fallback logic hata diya gaya hai
  // Yeh sirf metaMap (Master List) se data padhega
  useEffect(() => {
    let list = [];
    if (metaMap && Array.isArray(metaMap[metaKey])) {
      list = metaMap[metaKey].filter(v => v && v.toString().toUpperCase() !== 'OTHER');
    }
    
    setItems(list);
    setOriginalItems(list);
  }, [metaKey, metaMap]); // Dependency array ko bhi clean kar diya gaya hai

  const addItem = () => {
    const v = (newValue || '').trim().toUpperCase();
    if (!v) return;
    if (v === 'OTHER') { setNewValue(''); return; }
    if (items.map(x => x.toUpperCase()).includes(v.toUpperCase())) return;
    setItems(prev => [...prev, v]);
    setNewValue("");
  };

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (idx, v) => {
    const val = (v || '').toString().toUpperCase();
    if (val === 'OTHER') return; // ignore setting to OTHER
    const next = [...items];
    next[idx] = val;
    setItems(next);
  };

   const handleSave = async () => {
    setSaving(true);
    try {
      // compute diffs
      const norm = (arr) => (arr || []).map(x => (x || '').trim()).filter(Boolean);
      const beforeRaw = norm(originalItems).filter(x => x.toUpperCase() !== 'OTHER');
      const afterRaw = norm(items).filter(x => x.toUpperCase() !== 'OTHER');

      // Create uppercase sets for comparison but keep original casing for deletions
      const beforeUpper = beforeRaw.map(x => x.toUpperCase());
      const afterUpper = afterRaw.map(x => x.toUpperCase());

      const toAddUpper = afterUpper.filter(v => !beforeUpper.includes(v));
      const toRemoveUpper = beforeUpper.filter(v => !afterUpper.includes(v));

      // Map uppercase values back to original casing from beforeRaw when deleting
      const upperToOriginal = {};
      beforeRaw.forEach(orig => { upperToOriginal[orig.toUpperCase()] = orig; });

      const toAdd = toAddUpper.map(u => u); // additions will be sent as uppercase (normalized)
      const toRemove = toRemoveUpper.map(u => upperToOriginal[u] || u);

      // perform API calls
      const addCalls = toAdd.map(v => fetch('/api/meta-options', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key: metaKey, value: v })
      }));
      
      // BUG 3 FIX: API call ko sahi URL aur Method par bhej diya gaya hai
      const delCalls = toRemove.map(v => fetch('/api/meta-options', {
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key: metaKey, value: v })
      }));

      const settled = await Promise.allSettled([...addCalls, ...delCalls]);
      // check for rejected promises or non-OK responses
      const errors = [];
      for (const r of settled) {
        if (r.status === 'rejected') {
          errors.push(r.reason?.toString() || 'Request rejected');
          continue;
        }
        // r.value is a Response — check HTTP status
        const resp = r.value;
        if (!resp || !resp.ok) {
          try {
            const json = await resp.json();
            errors.push(json?.error || json?.message || `HTTP ${resp.status}`);
          } catch (e) {
            errors.push(`HTTP ${resp.status}`);
          }
        }
      }
      if (errors.length) {
        console.warn('Some meta-option updates failed:', errors);
        if (errors.some(e => (e || '').toString().toLowerCase().includes('forbidden'))) {
          alert('Permission denied: please login as an admin to save changes.');
        }
      }

      // After operations, re-fetch canonical meta-options from server and pass to parent
      try {
        const mres = await fetch('/api/meta-options');
        if (mres.ok) {
          const mj = await mres.json();
          if (mj && mj.success) {
            const map = {};
            (mj.data || []).forEach(opt => {
              if (!opt || !opt.value) return;
              if (opt.value.toString().toUpperCase() === 'OTHER') return;
              if (!map[opt.key]) map[opt.key] = [];
              if (!map[opt.key].includes(opt.value)) map[opt.key].push(opt.value);
            });
            onSaved && onSaved(map);
          } else {
            // fallback: send local after list
            const updated = { ...(metaMap || {}) };
            updated[metaKey] = afterRaw;
            onSaved && onSaved(updated);
          }
        } else {
          const updated = { ...(metaMap || {}) };
          updated[metaKey] = afterRaw;
          onSaved && onSaved(updated);
        }
      } catch (e) {
        const updated = { ...(metaMap || {}) };
        updated[metaKey] = afterRaw;
        onSaved && onSaved(updated);
      }

      onClose && onClose();
    } catch (e) {
      console.error('Save meta options failed', e);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="metaEditorOverlay" onClick={onClose}>
      <div className="metaEditor" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h3>Edit {category} Options</h3>
        </div>
        <div className="body">
          <div className="row">
            <label>Choose set</label>
            <select value={scope} onChange={(e) => setScope(e.target.value)}>
              {primaryChoices.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>

          <div className="list">
            {items.map((v, idx) => (
              <div key={idx} className="itemRow">
                <input value={v} onChange={(e) => updateItem(idx, e.target.value)} />
                <button className="danger" onClick={() => removeItem(idx)}>Delete</button>
              </div>
            ))}
            <div className="itemRow">
              <input placeholder="Add new..." value={newValue} onChange={(e) => setNewValue(e.target.value)} />
              <button onClick={addItem}>Add</button>
            </div>
          </div>
        </div>
        <div className="footer">
          <button onClick={onClose} disabled={saving}>Cancel</button>
          <button className="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <style jsx>{`
        .metaEditorOverlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .metaEditor { width: 560px; max-width: 95%; background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .header h3 { margin: 0 0 12px; }
        .row { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
        .row select { padding: 8px; border-radius: 6px; border: 1px solid #ccc; }
        .list { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .itemRow { display: flex; gap: 8px; }
        .itemRow input { flex: 1; padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; }
        .itemRow button { padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; background: #f5f5f5; cursor: pointer; }
        .itemRow button.danger { background: #fee2e2; border-color: #fecaca; color: #7f1d1d; }
        .footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; padding-top: 12px; border-top: 1px solid #eee; }
        .footer .primary { background: #111; color: #fff; border-color: #111; }
      `}</style>
    </div>
  );
}