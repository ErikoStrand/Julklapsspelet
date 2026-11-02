<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import Icon from '#lib/illustrations/Icon.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Julklappsspelet</title>
</svelte:head>

<header class="relative z-10 mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5 py-5 sm:px-8">
	<nav class="hidden gap-8 text-xs font-medium tracking-[0.16em] uppercase sm:flex">
		<a href="/#sa-funkar-det" class="hover:text-coral">Så funkar det</a>
	</nav>
	<a href="/" class="col-start-2 flex flex-col items-center text-ink">
		<Icon name="snowflake" class="size-5" />
		<span class="font-display text-2xl leading-none sm:text-3xl">Julklappsspelet</span>
	</a>
	<nav class="hidden justify-end gap-8 text-xs font-medium tracking-[0.16em] uppercase sm:flex">
		<a href="/#skapa" class="hover:text-coral">Skapa spel</a>
	</nav>
</header>

{@render children()}

<footer class="mt-24 border-t border-blush-2/60 py-10 text-center">
	<Icon name="snowflake" class="mx-auto mb-3 size-5 text-sage" />
	<p class="font-display text-xl">God jul!</p>
	<p class="eyebrow mt-2">Julklappsspelet</p>
</footer>
