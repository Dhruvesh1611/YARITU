import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ success: false, message: 'Missing message' }, { status: 400 });

    // If OpenAI key present, call it. Otherwise return a simple canned reply or echo.
    const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (OPENAI_KEY) {
      try {
        const r = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: 'You are Yaritu assistant. Answer concisely.' }, { role: 'user', content: message }],
            max_tokens: 250,
          }),
        });
        const j = await r.json();
        const reply = j?.choices?.[0]?.message?.content || 'I am unable to answer right now.';
        return NextResponse.json({ success: true, reply });
      } catch (err) {
        console.error('OpenAI call failed', err);
      }
    }

    // Fallback canned responses
    const lower = message.toLowerCase();
    let reply = '';
    if (lower.includes('hello') || lower.includes('hi')) reply = 'Hello! How can I help you today?';
    else if (lower.includes('price') || lower.includes('cost')) reply = 'Our prices vary by collection — which product are you interested in?';
    else if (lower.includes('offer')) reply = 'You can sign up for offers using the Offers signup on our website. Would you like me to register your interest?';
    else reply = `Thanks for your message. We received: "${message}". Our team will get back to you soon.`;

    return NextResponse.json({ success: true, reply });
  } catch (err) {
    console.error('Chat error', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
