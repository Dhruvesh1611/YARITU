
'use client';

import { useState } from 'react';
import { getStudent } from '../lib/api';

export default function StudentsPage() {
    const [id, setId] = useState('');
    const [student, setStudent] = useState(null);
    const [err, setErr] = useState('');

    async function handleFetch(e) {
        e.preventDefault();
        setErr(''); setStudent(null);
        try {
            const data = await getStudent(id);
            setStudent(data);
        } catch (e) {
            setErr(e.message || 'Error');
        }
    }

    return (
        <main style={{ padding: 24 }}>
            <h1>Students API Demo</h1>
            <form onSubmit={handleFetch}>
                <input
                    placeholder="Student ID (e.g., 1, 2, 3)"
                    type="number"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    required
                />
                <button type="submit">Fetch Student</button>
            </form>

            {err && <p style={{ color: 'crimson' }}>{err}</p>}
            {student && (
                <div style={{ marginTop: 12 }}>
                    <p><b>ID:</b> {student.id}</p>
                    <p><b>Name:</b> {student.name}</p>
                    <p><b>Age:</b> {student.age}</p>
                    <p><b>Course:</b> {student.course}</p>
                </div>
            )}
        </main>
    );
}