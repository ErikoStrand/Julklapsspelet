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

<footer class="mt-24 border-t border-blush-2/60 bg-blush/40">
	<div class="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-3 sm:px-8">
		<div>
			<a href="/" class="inline-flex items-center gap-2 text-ink">
				<Icon name="snowflake" class="size-5 text-sage" />
				<span class="font-display text-2xl">Julklappsspelet</span>
			</a>
			<p class="mt-3 max-w-xs text-sm text-ink/70">
				Dra julklappsnamn online – gratis, utan konto och utan att någon kan fuska.
			</p>
		</div>

		<nav class="text-sm">
			<p class="eyebrow mb-3">Sidor</p>
			<ul class="space-y-2 text-ink/80">
				<li><a href="/#skapa" class="hover:text-coral">Skapa spel</a></li>
				<li><a href="/#sa-funkar-det" class="hover:text-coral">Så funkar det</a></li>
				<li>
					<a
						href="https://github.com/ErikoStrand/Julklapsspelet"
						target="_blank"
						rel="noopener noreferrer"
						class="hover:text-coral">Källkod på GitHub</a
					>
				</li>
			</ul>
		</nav>

		<div class="text-sm">
			<p class="eyebrow mb-3">Integritet</p>
			<p class="text-ink/70">
				Vi sparar bara spelets namn, deltagarnas namn och vem som dragit vem. Kakor används endast
				för att komma ihåg din dragning och din admininloggning – ingen spårning eller reklam.
			</p>
		</div>
	</div>

	<div class="border-t border-blush-2/60">
		<div
			class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-ink/60 sm:flex-row sm:px-8"
		>
			<p>© {new Date().getFullYear()} Julklappsspelet · Alla rättigheter förbehållna</p>
			<p class="font-display text-base text-ink">God jul! 🎄</p>
		</div>
	</div>
</footer>
