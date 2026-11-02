<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Village from '#lib/illustrations/Village.svelte';
	import GiftArt from '#lib/illustrations/GiftArt.svelte';
	import Icon from '#lib/illustrations/Icon.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let selected = $state('');
	let submitting = $state(false);
	let confirming = $state(false);

	const selectedName = $derived(data.participants.find((p) => p.id === selected)?.name);
</script>

<svelte:head>
	<title>{data.title} – Julklappsspelet</title>
</svelte:head>

<section class="-mt-6 overflow-hidden">
	<Village class="h-[200px] w-full sm:h-[320px]" />
</section>

<div class="mx-auto max-w-2xl px-5">
	<div class="mt-4 text-center">
		<p class="eyebrow">Julklappsspel</p>
		<h1 class="mt-2 font-display text-5xl leading-tight sm:text-6xl">{data.title}</h1>
	</div>

	<div class="mt-10">
		{#if data.me}
			<div class="card text-center">
				<GiftArt class="mx-auto w-44" />
				<p class="mt-4 text-ink/70">
					Hej <strong class="font-medium text-ink">{data.me.name}</strong>! Du ska ge en julklapp till
				</p>
				<p class="mt-3 font-display text-6xl text-coral sm:text-7xl">{data.me.receiver}</p>
				<p class="mx-auto mt-6 flex max-w-sm items-center justify-center gap-2 text-sm text-ink/60">
					<Icon name="lock" class="size-4 shrink-0" />
					Håll det hemligt! Öppna länken igen på samma enhet för att se namnet.
				</p>
			</div>
		{:else}
			<form
				method="POST"
				action="?/draw"
				class="card space-y-6"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
						confirming = false;
					};
				}}
			>
				<div class="flex items-center gap-4">
					<div class="flex size-14 shrink-0 items-center justify-center rounded-full bg-blush text-coral">
						<Icon name="shuffle" class="size-7" />
					</div>
					<div>
						<h2 class="font-display text-3xl">Dra ditt namn</h2>
						<p class="text-sm text-ink/60">Välj vem du är och se vem du ska köpa julklapp till.</p>
					</div>
				</div>

				<div>
					<label class="label" for="participant">Vem är du?</label>
					<select class="input" id="participant" name="participant" required bind:value={selected} onchange={() => (confirming = false)}>
						<option value="" disabled>Välj ditt namn…</option>
						{#each data.participants as p (p.id)}
							<option value={p.id}>{p.name}</option>
						{/each}
					</select>
					<p class="mt-2 text-sm text-ink/60">
						När du har dragit låses ditt namn så att ingen annan kan välja det.
					</p>
				</div>

				{#if form?.error}<p class="error">{form.error}</p>{/if}

				{#if confirming}
					<div class="rounded-2xl bg-blush p-5 text-center ring-1 ring-blush-2">
						<p class="font-display text-2xl">Är du säkert {selectedName}?</p>
						<p class="mt-1 text-sm text-ink/70">
							Du kan bara dra en gång, och ditt namn låses efteråt.
						</p>
						<div class="mt-4 flex flex-wrap justify-center gap-2">
							<button class="btn" disabled={submitting}>
								{submitting ? 'Drar…' : 'Ja, dra mitt namn'}
								<Icon name="gift" class="size-5" />
							</button>
							<button
								type="button"
								class="btn-ghost"
								disabled={submitting}
								onclick={() => (confirming = false)}>Avbryt</button
							>
						</div>
					</div>
				{:else}
					<button
						type="button"
						class="btn w-full"
						disabled={!selected}
						onclick={() => (confirming = true)}
					>
						Dra ett namn
						<Icon name="gift" class="size-5" />
					</button>
				{/if}
			</form>
		{/if}
	</div>

	<p class="eyebrow mt-8 text-center">
		{data.drawnCount} av {data.participants.length} har dragit
	</p>
	<p class="mt-3 text-center text-sm">
		<a href="/spel/{page.params.id}/admin" class="text-ink/60 underline decoration-blush-2 underline-offset-4 hover:text-coral">
			Skapade du spelet? Logga in som admin
		</a>
	</p>
</div>
