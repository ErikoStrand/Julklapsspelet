<script lang="ts">
	// A wrapped present with a bow, snow at its feet and sparkles around it.
	let { class: className = 'w-40' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 200 170" class={className} aria-hidden="true">
	<ellipse cx="100" cy="158" rx="80" ry="10" fill="#fdeceb" />
	<path d="M30 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3Z" fill="#7d9c9c" />
	<path
		d="M168 50 l2.5 5.5 5.5 2.5 -5.5 2.5 -2.5 5.5 -2.5 -5.5 -5.5 -2.5 5.5 -2.5Z"
		fill="#ee5f57"
	/>
	<circle cx="160" cy="18" r="3" fill="#7d9c9c" />
	<!-- box -->
	<rect x="45" y="78" width="110" height="80" fill="#ee5f57" />
	<rect x="100" y="78" width="55" height="80" fill="#d64a43" />
	<rect x="38" y="62" width="124" height="22" fill="#f26b63" />
	<rect x="100" y="62" width="62" height="22" fill="#e2554d" />
	<!-- ribbon -->
	<rect x="92" y="62" width="16" height="96" fill="#12403f" />
	<!-- bow -->
	<path d="M100 62 C80 30 52 40 62 56 C68 66 100 62 100 62Z" fill="#2f7a6e" />
	<path d="M100 62 C120 30 148 40 138 56 C132 66 100 62 100 62Z" fill="#245f56" />
	<circle cx="100" cy="61" r="7" fill="#12403f" />
	<!-- tag -->
	<path d="M120 100 h26 l8 9 -8 9 h-26Z" fill="#fff" />
	<circle cx="145" cy="109" r="2" fill="#ee5f57" />
</svg>
