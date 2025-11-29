export default function handler(req, res) {
  console.log('[api/ping] handler loaded');
  res.status(200).json({ ok: true });
}
