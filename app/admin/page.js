export const dynamic = 'force-dynamic';

import { auth } from '../api/auth/[...nextauth]/route';
import AdminClient from './AdminClient';
import Link from 'next/link';
import styles from './admin.module.css'; // CSS Module ko import karein

export default async function Page() {
  const session = await auth();

  // Admin role check karein
  if (!session || (!session.user?.isAdmin && session.user?.role !== 'admin')) {
    return (
      <div className={styles.adminAccessDenied}>
        <div className={styles.container}>
          <h2>Admin Access Required</h2>
          <p>
            Aap is page ko dekhne ke liye authorized nahi hain. Kripya ek admin account se{' '}
            <Link href="/api/auth/signin">sign in</Link> karein.
          </p>
        </div>
      </div>
    );
  }

  // Agar authorized hai to AdminClient component render karein
  return <AdminClient />;
}