<script lang="ts">
	// Flat winter village: pink hills, houses, pine trees, a big Christmas tree and people in the snow.
	let { class: className = 'w-full' }: { class?: string } = $props();

	const C = {
		ink: '#12403f',
		pine: '#2f7a6e',
		pineDark: '#245f56',
		coral: '#ee5f57',
		roof: '#7c2b2b',
		skin: '#f4c7ad',
		farHill: '#fdeceb',
		midHill: '#fbdcdb',
		farTree: '#f7c9c7'
	};

	type House = { x: number; w: number; h: number; base: number; body: string; flat?: boolean };
	const houses: House[] = [
		{ x: 10, w: 95, h: 210, base: 335, body: '#f26b63' },
		{ x: 150, w: 115, h: 120, base: 350, body: '#f9aba6' },
		{ x: 300, w: 125, h: 160, base: 345, body: '#f58d86' },
		{ x: 470, w: 85, h: 85, base: 330, body: '#fbc6c2' },
		{ x: 570, w: 70, h: 150, base: 325, body: '#f9b3ae', flat: true },
		{ x: 680, w: 140, h: 95, base: 340, body: '#f26b63' },
		{ x: 1000, w: 110, h: 160, base: 345, body: '#f58d86' },
		{ x: 1130, w: 90, h: 115, base: 350, body: '#f9aba6' }
	];

	const windows = (h: House, i: number) => {
		const cols = Math.max(1, Math.floor((h.w - 20) / 34));
		const rows = Math.max(1, Math.floor((h.h - 30) / 42));
		const out: { x: number; y: number; color: string }[] = [];
		for (let r = 0; r < rows; r++)
			for (let c = 0; c < cols; c++)
				out.push({
					x: h.x + (h.w - (cols * 34 - 16)) / 2 + c * 34,
					y: h.base - h.h + 22 + r * 42,
					color: (r + c + i) % 3 === 0 ? C.roof : C.ink
				});
		return out;
	};

	const pines = [
		{ x: 125, base: 360, h: 115 },
		{ x: 285, base: 355, h: 90 },
		{ x: 445, base: 345, h: 105 },
		{ x: 660, base: 350, h: 85 },
		{ x: 975, base: 360, h: 95 },
		{ x: 1115, base: 365, h: 125 },
		{ x: 40, base: 400, h: 90 },
		{ x: 760, base: 405, h: 70 }
	];
	const farTrees = [70, 240, 395, 530, 640, 850, 1060, 1170];
</script>

{#snippet person(
	x: number,
	y: number,
	coat: string,
	scarf: string,
	arms: 'down' | 'out' | 'up' | 'gift',
	flip = false
)}
	<g transform="translate({x} {y}) scale({flip ? -1 : 1} 1)">
		<path d="M-4 -26 L-8 0 M4 -26 L9 0" stroke={C.ink} stroke-width="3.5" stroke-linecap="round" />
		{#if arms === 'out'}
			<path d="M-9 -53 L-25 -44 M9 -53 L25 -44" stroke={coat} stroke-width="4" stroke-linecap="round" />
		{:else if arms === 'up'}
			<path d="M-9 -53 L-19 -72 M9 -53 L19 -72" stroke={coat} stroke-width="4" stroke-linecap="round" />
		{:else if arms === 'gift'}
			<path d="M-9 -53 L-6 -38 M9 -53 L6 -38" stroke={coat} stroke-width="4" stroke-linecap="round" />
			<rect x="-11" y="-46" width="22" height="16" rx="2" fill={C.coral} />
			<path d="M0 -46 V-30 M-11 -40 H11" stroke="#fff" stroke-width="2" />
		{:else}
			<path d="M-9 -53 L-14 -31 M9 -53 L14 -31" stroke={coat} stroke-width="4" stroke-linecap="round" />
		{/if}
		<path d="M-9 -56 Q0 -60 9 -56 L13 -24 L-13 -24 Z" fill={coat} />
		<rect x="-8" y="-61" width="16" height="5" rx="2.5" fill={scarf} />
		<rect x="3" y="-58" width="4" height="12" rx="2" fill={scarf} />
		<circle cy="-68" r="7.5" fill={C.skin} />
		<path d="M-7.5 -69 Q0 -82 7.5 -69 Z" fill={scarf} />
		<circle cy="-79" r="2.5" fill="#fff" />
	</g>
{/snippet}

<svg viewBox="0 0 1200 460" class={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
	<!-- far hill + pink trees -->
	<path d="M0 250 C200 175 420 200 620 165 S1000 140 1200 195 V460 H0 Z" fill={C.farHill} />
	{#each farTrees as x, i (x)}
		<path d="M{x} {170 + (i % 3) * 18} l-22 70 h44 Z" fill={C.farTree} />
	{/each}

	<!-- middle hill -->
	<path d="M0 320 C250 270 520 295 720 275 S1060 255 1200 285 V460 H0 Z" fill={C.midHill} />

	<!-- houses -->
	{#each houses as h, i (h.x)}
		{@const rh = h.w * 0.38}
		{@const top = h.base - h.h}
		<rect x={h.x} y={top} width={h.w} height={h.h} fill={h.body} />
		{#if h.flat}
			<rect x={h.x - 4} y={top - 10} width={h.w + 8} height="12" fill={C.roof} />
			<rect x={h.x + 6} y={top - 16} width={h.w - 12} height="7" rx="3.5" fill="#fff" />
		{:else}
			<path d="M{h.x - 8} {top} L{h.x + h.w / 2} {top - rh} L{h.x + h.w + 8} {top} Z" fill={C.roof} />
			<rect x={h.x + h.w * 0.68} y={top - rh * 0.85} width="12" height={rh * 0.5} fill={C.roof} />
			<circle cx={h.x + h.w / 2 - 12} cy={top - rh + 16} r="7" fill="#fff" />
			<circle cx={h.x + h.w / 2} cy={top - rh + 10} r="8" fill="#fff" />
			<circle cx={h.x + h.w / 2 + 13} cy={top - rh + 17} r="6" fill="#fff" />
		{/if}
		{#each windows(h, i) as w (w.x + '-' + w.y)}
			<rect x={w.x} y={w.y} width="18" height="20" fill={w.color} />
			<path d="M{w.x + 9} {w.y} v20 M{w.x} {w.y + 10} h18" stroke="#fff" stroke-width="2" />
			<rect x={w.x - 2} y={w.y + 20} width="22" height="4" fill="#fff" />
		{/each}
	{/each}

	<!-- string of lights -->
	<path d="M265 238 Q 282 256 300 240" stroke={C.ink} stroke-width="1.2" fill="none" />
	<path d="M555 262 Q 568 276 580 262" stroke={C.ink} stroke-width="1.2" fill="none" />
	{#each [[272, 246], [282, 250], [292, 247], [562, 269], [572, 271]] as [cx, cy] (cx)}
		<circle {cx} {cy} r="2.6" fill={C.coral} />
	{/each}

	<!-- pine trees -->
	{#each pines as t (t.x)}
		{@const half = t.h * 0.3}
		<path d="M{t.x} {t.base - t.h} L{t.x - half} {t.base - 8} H{t.x} Z" fill={C.pine} />
		<path d="M{t.x} {t.base - t.h} L{t.x + half} {t.base - 8} H{t.x} Z" fill={C.pineDark} />
		<path d="M{t.x} {t.base - 8} V{t.base}" stroke={C.ink} stroke-width="3" />
	{/each}

	<!-- big Christmas tree -->
	<g>
		<path d="M890 135 L790 410 H890 Z" fill={C.pine} />
		<path d="M890 135 L990 410 H890 Z" fill={C.pineDark} />
		{#each [[835, 255, 945, 235], [815, 320, 965, 300], [800, 380, 980, 362]] as [x1, y1, x2, y2] (y1)}
			<path d="M{x1} {y1} Q890 {y1 + 30} {x2} {y2}" stroke="#fff" stroke-width="1.6" fill="none" opacity="0.8" />
		{/each}
		{#each [[860, 215, 7], [915, 250, 9], [845, 290, 6], [935, 320, 11], [870, 345, 10], [820, 375, 8], [955, 385, 7], [900, 395, 6]] as [cx, cy, r], i (cx)}
			<circle {cx} {cy} {r} fill={i % 3 === 2 ? C.roof : C.coral} />
		{/each}
		<path
			d="m890 108 7.6 15.4 17 2.5-12.3 12 2.9 16.9-15.2-8-15.2 8 2.9-16.9-12.3-12 17-2.5Z"
			fill={C.coral}
		/>
	</g>

	<!-- foreground snow -->
	<path d="M0 395 C260 360 560 420 860 398 S1120 380 1200 390 V460 H0 Z" fill="#fff" />

	<!-- snowman -->
	<g transform="translate(745 432)">
		<circle cy="-14" r="16" fill="#fff" stroke={C.farTree} stroke-width="2" />
		<circle cy="-40" r="11" fill="#fff" stroke={C.farTree} stroke-width="2" />
		<path d="M0 -40 l9 2 -9 2 Z" fill={C.coral} />
		<rect x="-9" y="-58" width="18" height="6" fill={C.ink} />
		<rect x="-6" y="-68" width="12" height="11" fill={C.ink} />
		<rect x="-10" y="-31" width="20" height="4" rx="2" fill={C.coral} />
	</g>

	<!-- sled -->
	<g transform="translate(230 440) rotate(-8)">
		<path d="M-34 0 H26 Q34 0 34 -8" stroke={C.ink} stroke-width="3" fill="none" stroke-linecap="round" />
		<rect x="-30" y="-8" width="56" height="6" rx="3" fill={C.roof} />
		<path d="M-6 -10 L18 -10 L22 -2" stroke={C.ink} stroke-width="3.5" stroke-linecap="round" fill="none" />
		<path d="M-14 -12 Q-10 -40 2 -40 L6 -12 Z" fill={C.coral} />
		<path d="M2 -34 L22 -14" stroke={C.coral} stroke-width="4" stroke-linecap="round" />
		<circle cx="-3" cy="-48" r="7.5" fill={C.skin} />
		<path d="M-10.5 -49 Q-3 -62 4.5 -49 Z" fill={C.ink} />
	</g>

	<!-- people -->
	{@render person(80, 428, C.coral, C.ink, 'out')}
	{@render person(360, 438, C.ink, C.coral, 'down', true)}
	{@render person(520, 432, C.coral, C.ink, 'gift')}
	{@render person(600, 430, C.pine, C.coral, 'up')}
	{@render person(640, 432, C.coral, C.ink, 'down', true)}
	{@render person(1040, 430, C.ink, C.coral, 'gift', true)}
	{@render person(1120, 428, C.coral, C.pine, 'out', true)}
</svg>
