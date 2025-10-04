export async function getItems() {
    const res = await fetch('/api/items', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch items');
    return res.json();
}

export async function addItem({ name, price }) {
    const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: Number(price) }),
    });
    if (!res.ok) throw new Error('Failed to add item');
    return res.json();
}

export async function updateItem({ id, name, price }) {
    const res = await fetch('/api/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: Number(id),
            ...(name ? { name } : {}),
            ...(price ? { price: Number(price) } : {}),
        }),
    });
    if (!res.ok) throw new Error('Failed to update item');
    return res.json();
}

export async function deleteItem(id) {
    const res = await fetch(`/api/items?id=${Number(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete item');
    return res.json();
}

export async function getStudent(id) {
    const res = await fetch(`/api/students/${Number(id)}`, { cache: 'no-store' });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Student not found');
    }
    return res.json();
}
