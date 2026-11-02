<script lang="ts">
	import { enhance } from '$app/forms';
	import ConfirmButton from '#lib/ConfirmButton.svelte';
	import Icon from '#lib/illustrations/Icon.svelte';
	import GiftArt from '#lib/illustrations/GiftArt.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let copied = $state(false);

	async function copyLink(url: string) {
		await navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>Admin – {data.title}</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-5 pt-8">
	{#if !data.authed}
		<div class="text-center">
			<p class="eyebrow">Admin</p>
			<h1 class="mt-2 font-display text-5xl">{data.title}</h1>
		</div>
		<form
			method="POST"
			action="?/login"
			class="card mx-auto mt-10 max-w-sm space-y-5"
			use:enhance={() =>
				async ({ update }) => {
					await update({ refreshAll: true });
				}}
		>
			<div class="mx-auto flex size-14 items-center justify-center rounded-full bg-blush text-coral">
				<Icon name="lock" class="size-7" />
			</div>
			<div>
				<label class="label" for="password">Adminlösenord</label>
				<input
					class="input"
					id="password"
					name="password"
					type="password"
					required
					autocomplete="current-password"
				/>
			</div>
			{#if form?.error}<p class="error">{form.error}</p>{/if}
			<button class="btn w-full">Logga in</button>
		</form>
	{:else}
		<div class="space-y-8">
			<div class="flex items-end justify-between gap-4">
				<div>
					<p class="eyebrow">Admin</p>
					<h1 class="mt-1 font-display text-4xl sm:text-5xl">{data.title}</h1>
				</div>
				<form method="POST" action="?/logout">
					<button class="btn-ghost">Logga ut</button>
				</form>
			</div>

			{#if form?.error}<p class="error">{form.error}</p>{/if}
			{#if form?.success}<p class="success">{form.success}</p>{/if}

			<section class="card grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
				<GiftArt class="mx-auto w-32 sm:w-36" />
				<div class="space-y-3">
					<h2 class="font-display text-3xl">
						{data.isNew ? 'Spelet är skapat!' : 'Dela länken'}
					</h2>
					<p class="text-ink/70">
						Alla med länken kan välja sitt namn och dra vem de ska köpa julklapp till.
					</p>
					<div class="flex gap-2">
						<input class="input text-sm" readonly value={data.shareUrl} />
						<button class="btn shrink-0 px-5" type="button" onclick={() => copyLink(data.shareUrl)}>
							<Icon name="link" class="size-4" />
							{copied ? 'Kopierad!' : 'Kopiera'}
						</button>
					</div>
					<a href={data.shareUrl} class="inline-flex items-center gap-2 text-sm text-coral hover:underline">
						Öppna spelet <Icon name="arrow" class="h-3 w-5" />
					</a>
				</div>
			</section>

			<section class="card space-y-5">
				<div class="flex items-baseline justify-between">
					<h2 class="flex items-center gap-3 font-display text-3xl">
						<Icon name="users" class="size-6 text-sage" /> Deltagare
					</h2>
					<span class="eyebrow">
						{data.participants.filter((p) => p.drawn).length} av {data.participants.length} har dragit
					</span>
				</div>

				{#if data.anyDrawn}
					<p class="flex items-start gap-2 text-sm text-ink/60">
						<Icon name="lock" class="mt-0.5 size-4 shrink-0" />
						Dragningen har börjat, så du kan bara byta namn – inte lägga till eller ta bort. Vem som
						fått vem är hemligt, även för dig.
					</p>
				{/if}

				<ul class="divide-y divide-blush-2/60">
					{#each data.participants as p (p.id)}
						<li class="flex flex-wrap items-center gap-2 py-3">
							<form method="POST" action="?/rename" class="flex min-w-0 flex-1 gap-2" use:enhance>
								<input type="hidden" name="id" value={p.id} />
								<input class="input py-1.5" name="name" value={p.name} maxlength="40" required />
								<button class="btn-ghost">Spara</button>
							</form>
							{#if p.drawn}
								<span class="inline-flex items-center gap-1 rounded-full bg-pine/10 px-3 py-1 text-xs text-pine-dark">
									<Icon name="gift" class="size-3.5" /> Har dragit
								</span>
								<ConfirmButton
									action="?/reset"
									id={p.id}
									label="Nollställ"
									question="Låt {p.name} dra igen?"
									confirmLabel="Nollställ"
								/>
							{:else if !data.anyDrawn}
								<ConfirmButton
									action="?/remove"
									id={p.id}
									label="Ta bort"
									question="Ta bort {p.name}?"
									confirmLabel="Ta bort"
									danger
								/>
							{/if}
						</li>
					{/each}
				</ul>

				{#if !data.anyDrawn && data.participants.length < data.maxNames}
					<form method="POST" action="?/add" class="flex gap-2" use:enhance>
						<input class="input" name="name" placeholder="Lägg till namn" maxlength="40" required />
						<button class="btn shrink-0 px-5">Lägg till</button>
					</form>
				{/if}
			</section>

			<section class="card space-y-5">
				<h2 class="font-display text-3xl">Inställningar</h2>
				<form method="POST" action="?/title" class="flex gap-2" use:enhance>
					<input class="input" name="title" value={data.title} maxlength="80" required />
					<button class="btn-ghost shrink-0">Byt namn</button>
				</form>
				<div class="flex flex-wrap gap-2 border-t border-blush-2/60 pt-5">
					<ConfirmButton
						action="?/resetAll"
						label="Nollställ all dragning"
						question="Alla måste dra igen. Säker?"
						confirmLabel="Nollställ"
						disabled={!data.anyDrawn}
					/>
					<ConfirmButton
						action="?/delete"
						label="Radera spelet"
						question="Radera spelet för alltid?"
						confirmLabel="Radera"
						danger
					/>
				</div>
			</section>
		</div>
	{/if}
</div>
