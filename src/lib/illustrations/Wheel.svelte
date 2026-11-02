<script lang="ts">
	import { onMount } from 'svelte';

	// A prize wheel with every name. It spins freely from mount until `land` is
	// called with the already-drawn index, then eases out onto that segment.
	let { names }: { names: string[] } = $props();

	const R = 150;
	const SPEED = 0.72; // degrees per ms while waiting
	const colors = ['#ee5f57', '#fbdcdb', '#2f7a6e', '#f9aba6', '#7c2b2b', '#fdeceb'];
	const textColors = ['#fff', '#12403f', '#fff', '#12403f', '#fff', '#12403f'];

	const seg = $derived(360 / names.length);
	const fontSize = $derived(names.length <= 12 ? 14 : names.length <= 24 ? 11 : 8);
	let angle = $state(0);
	let frame = 0;

	const point = (deg: number, r = R) => {
		const rad = (deg * Math.PI) / 180;
		return `${(r * Math.sin(rad)).toFixed(2)} ${(-r * Math.cos(rad)).toFixed(2)}`;
	};
	const label = (name: string) => (name.length > 14 ? name.slice(0, 13) + '…' : name);
	// avoid two neighbours sharing a colour when the count wraps around
	const color = (i: number) => (i === names.length - 1 && i % 6 === 0 ? 3 : i % 6);

	onMount(() => {
		let last = performance.now();
		const tick = (now: number) => {
			angle += (now - last) * SPEED;
			last = now;
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});

	export function land(index: number): Promise<void> {
		cancelAnimationFrame(frame);
		const jitter = (Math.random() - 0.5) * seg * 0.6;
		const rest = (((360 - (index + 0.5) * seg + jitter) % 360) + 360) % 360;
		const start = angle;
		let target = start - (start % 360) + rest;
		while (target < start + 3 * 360) target += 360;
		const distance = target - start;
		// ease-out cubic starts at 3x average speed, so match the current spin speed
		const duration = Math.min(6000, (3 * distance) / SPEED);
		const t0 = performance.now();

		return new Promise((resolve) => {
			const tick = (now: number) => {
				const t = Math.min(1, (now - t0) / duration);
				angle = start + distance * (1 - (1 - t) ** 3);
				if (t < 1) frame = requestAnimationFrame(tick);
				else resolve();
			};
			frame = requestAnimationFrame(tick);
		});
	}
</script>

<svg viewBox="-170 -180 340 350" class="mx-auto w-full max-w-sm" role="img" aria-label="Lyckohjul">
	<circle r={R + 10} fill="#12403f" />
	<g transform="rotate({angle})">
		{#each names as name, i (i)}
			{@const a = i * seg}
			<path
				d="M0 0 L{point(a)} A{R} {R} 0 {seg > 180 ? 1 : 0} 1 {point(a + seg)} Z"
				fill={colors[color(i)]}
			/>
			<g transform="rotate({a + seg / 2 - 90})">
				<text
					x={R - 12}
					y={fontSize / 3}
					text-anchor="end"
					font-size={fontSize}
					font-family="Jost, sans-serif"
					font-weight="500"
					fill={textColors[color(i)]}>{label(name)}</text
				>
			</g>
		{/each}
	</g>
	{#each Array.from({ length: 24 }, (_, i) => i * 15) as d (d)}
		<circle
			cx={Math.sin((d * Math.PI) / 180) * (R + 5)}
			cy={-Math.cos((d * Math.PI) / 180) * (R + 5)}
			r="2"
			fill="#fdeceb"
		/>
	{/each}
	<circle r="26" fill="#fff" stroke="#12403f" stroke-width="4" />
	<path d="M0 -9 l2.6 5.6 6.1.7-4.5 4.2 1.2 6L0 4.5l-5.4 3 1.2-6-4.5-4.2 6.1-.7Z" fill="#ee5f57" />
	<!-- pointer -->
	<path
		d="M-14 -176 H14 L0 -146 Z"
		fill="#ee5f57"
		stroke="#fff"
		stroke-width="3"
		stroke-linejoin="round"
	/>
</svg>
