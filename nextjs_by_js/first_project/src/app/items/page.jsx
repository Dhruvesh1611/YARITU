
'use client';

import { useEffect, useState } from 'react';
import { getItems, addItem, updateItem, deleteItem } from '../lib/api';

export default function ItemsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    // form state
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');

    const [editId, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');

    const [deleteId, setDeleteId] = useState('');

    async function refresh() {
        setErr('');
        setLoading(true);
        try {
            const data = await getItems();
            setItems(data);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { refresh(); }, []);

    async function handleAdd(e) {
        e.preventDefault();
        try {
            await addItem({ name: newName, price: newPrice });
            setNewName(''); setNewPrice('');
            await refresh();
        } catch (e) { setErr(e.message); }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        try {
            await updateItem({ id: editId, name: editName || undefined, price: editPrice || undefined });
            setEditId(''); setEditName(''); setEditPrice('');
            await refresh();
        } catch (e) { setErr(e.message); }
    }

    async function handleDelete(e) {
        e.preventDefault();
        try {
            await deleteItem(deleteId);
            setDeleteId('');
            await refresh();
        } catch (e) { setErr(e.message); }
    }

    return (
        <main style={{ padding: 24 }}>
            <h1>Items API Demo</h1>

            {err && <p style={{ color: 'crimson' }}>{err}</p>}
            {loading ? <p>Loading…</p> : (
                <ul>
                    {items.map(it => (
                        <li key={it.id}>
                            #{it.id} — {it.name} — ₹{it.price}
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <h2>Add Item (POST)</h2>
            <form onSubmit={handleAdd}>
                <input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} required />
                <input placeholder="Price" type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} required />
                <button type="submit">Add</button>
            </form>

            <h2>Update Item (PUT)</h2>
            <form onSubmit={handleUpdate}>
                <input placeholder="ID" type="number" value={editId} onChange={e => setEditId(e.target.value)} required />
                <input placeholder="New name (optional)" value={editName} onChange={e => setEditName(e.target.value)} />
                <input placeholder="New price (optional)" type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                <button type="submit">Update</button>
            </form>

            <h2>Delete Item (DELETE)</h2>
            <form onSubmit={handleDelete}>
                <input placeholder="ID" type="number" value={deleteId} onChange={e => setDeleteId(e.target.value)} required />
                <button type="submit">Delete</button>
            </form>
        </main>
    );
}