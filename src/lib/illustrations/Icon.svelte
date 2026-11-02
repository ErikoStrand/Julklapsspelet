<script lang="ts">
	type Name = 'gift' | 'snowflake' | 'lock' | 'link' | 'users' | 'shuffle' | 'arrow' | 'star';
	let { name, class: className = 'size-6' }: { name: Name; class?: string } = $props();
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
	aria-hidden="true"
>
	{#if name === 'gift'}
		<rect x="3.5" y="9" width="17" height="11.5" rx="1.5" />
		<rect x="2.5" y="6.5" width="19" height="3.5" rx="1" />
		<path d="M12 6.5v14M12 6.5C10 3 6.5 3.5 7.5 5.5 8.2 6.8 12 6.5 12 6.5Zm0 0c2-3.5 5.5-3 4.5-1-.7 1.3-4.5 1-4.5 1Z" />
	{:else if name === 'snowflake'}
		<path
			d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9.5 4 12 6.5 14.5 4M9.5 20 12 17.5 14.5 20M3.6 10.2l3.4-.9-.9-3.4M20.4 13.8l-3.4.9.9 3.4M6.1 17.5l.9-3.4-3.4-.9M17.9 6.5l-.9 3.4 3.4.9"
		/>
	{:else if name === 'lock'}
		<rect x="4.5" y="10.5" width="15" height="10" rx="2" />
		<path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5" />
	{:else if name === 'link'}
		<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
		<path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
	{:else if name === 'users'}
		<circle cx="9" cy="8" r="3.5" />
		<path d="M2.5 20c.6-3.5 3.2-5.5 6.5-5.5s5.9 2 6.5 5.5" />
		<path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.5 3.5 5.2" />
	{:else if name === 'shuffle'}
		<path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c2 0 3.3-1.6 4.3-3.5M13.2 10.5C14.2 8.6 15.5 7 17.5 7H21" />
		<path d="m18.5 4.5 2.5 2.5-2.5 2.5M18.5 14.5l2.5 2.5-2.5 2.5" />
	{:else if name === 'arrow'}
		<path d="M2 12h20M16 6l6 6-6 6" />
	{:else if name === 'star'}
		<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5l-5.4 3 1.2-6-4.5-4.2 6.1-.7Z" />
	{/if}
</svg>
