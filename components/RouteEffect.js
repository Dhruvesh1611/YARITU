"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Lightweight route transition progress indicator + link hover prefetch hint.
// Improves perceived navigation speed without external deps.
export default function RouteEffect() {
	const pathname = usePathname();

	useEffect(() => {
		let bar = document.getElementById('route-progress-bar');
		if (!bar) {
			bar = document.createElement('div');
			bar.id = 'route-progress-bar';
			bar.style.position = 'fixed';
			bar.style.top = '0';
			bar.style.left = '0';
			bar.style.height = '2px';
			bar.style.width = '0%';
			bar.style.background = '#111';
			bar.style.transition = 'width 180ms ease';
			bar.style.zIndex = '9999';
			document.body.appendChild(bar);
		}

		const start = () => {
			try {
				bar.style.width = '18%';
				// small trick: bump width after a tick to animate
				setTimeout(() => { bar.style.width = '48%'; }, 120);
			} catch (_) {}
		};
		const finish = () => {
			try {
				bar.style.width = '100%';
				setTimeout(() => { bar.style.width = '0%'; }, 180);
			} catch (_) {}
		};

		// Start progress when user clicks any internal link
		const onClick = (e) => {
			const a = e.target.closest('a');
			if (!a) return;
			const href = a.getAttribute('href') || '';
			const isInternal = href.startsWith('/') && !href.startsWith('//');
			if (isInternal) start();
		};
		document.addEventListener('click', onClick, true);

		// Finish progress when pathname changes (route completed)
		finish();

		return () => {
			document.removeEventListener('click', onClick, true);
		};
	}, [pathname]);

	return null;
}
