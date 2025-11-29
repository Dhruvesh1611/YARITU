// app/page.js

import HomePageClient from './HomePageClient';

// Render the client component immediately so navigation isn't blocked by
// server-side API fetches. HomePageClient will fetch its own data on mount.
export default function Home() {
  return <HomePageClient />;
}