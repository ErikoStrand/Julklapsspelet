<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import Village from '#lib/illustrations/Village.svelte';
	import Icon from '#lib/illustrations/Icon.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let submitting = $state(false);

	const MAX = 50;
	let title = $state('');
	let names = $state(['', '', '']);
	let inputs: HTMLInputElement[] = $state([]);
	$effect.pre(() => {
		if (form?.title) title = form.title;
		if (form?.names?.length) names = [...form.names];
	});
	const count = $derived(names.filter((n) => n.trim()).length);

	async function onKeydown(e: KeyboardEvent, i: number) {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (i === names.length - 1) {
				if (names.length >= MAX) return;
				names.push('');
				await tick();
			}
			inputs[i + 1]?.focus();
		} else if (e.key === 'Backspace' && names[i] === '' && names.length > 1) {
			e.preventDefault();
			names.splice(i, 1);
			await tick();
			inputs[Math.max(0, i - 1)]?.focus();
		}
	}

	function remove(i: number) {
		if (names.length > 1) names.splice(i, 1);
		else names[0] = '';
	}

	const steps = [
		{ icon: 'users', title: 'Skapa spelet', text: 'Skriv in upp till 50 namn och välj ett adminlösenord.' },
		{ icon: 'link', title: 'Dela länken', text: 'Skicka länken till alla som är med – i chatten, sms eller mejl.' },
		{ icon: 'gift', title: 'Dra ett namn', text: 'Var och en väljer sig själv och drar i hemlighet vem de ska ge till.' }
	] as const;
</script>

<svelte:head>
	<title>Julklappsspelet – dra julklappsnamn online</title>
</svelte:head>

<section class="-mt-6 overflow-hidden">
	<Village class="h-[260px] w-full sm:h-auto" />
</section>

<section class="mx-auto max-w-6xl px-5 pt-6 sm:px-8">
	<h1 class="font-display text-6xl leading-[0.95] sm:text-8xl">
		Julklapps<br /><span class="text-sage">spelet</span>
	</h1>
</section>

<section id="sa-funkar-det" class="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
	<p class="eyebrow">Så funkar det</p>
	<div class="mt-6 grid gap-8 sm:grid-cols-3">
		{#each steps as step, i (step.title)}
			<div>
				<div class="flex size-14 items-center justify-center rounded-full bg-blush text-coral">
					<Icon name={step.icon} class="size-7" />
				</div>
				<h2 class="mt-4 font-display text-2xl">
					<span class="text-sage">{i + 1}.</span>
					{step.title}
				</h2>
				<p class="mt-1 text-ink/70">{step.text}</p>
			</div>
		{/each}
	</div>
	<p class="mt-8 flex items-center gap-2 text-sm text-ink/60">
		<Icon name="lock" class="size-4" /> Ingen kan dra sig själv, och ingen blir dragen två gånger.
	</p>
</section>

<section id="skapa" class="mx-auto mt-20 max-w-2xl scroll-mt-8 px-5">
	<form
		method="POST"
		class="card space-y-7"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update({ reset: false });
				submitting = false;
			};
		}}
	>
		<div>
			<p class="eyebrow">Nytt spel</p>
			<h2 class="mt-1 font-display text-4xl">Skapa ditt julklappsspel</h2>
		</div>

		<div>
			<label class="label" for="title">Spelets namn</label>
			<input
				class="input"
				id="title"
				name="title"
				required
				maxlength="80"
				placeholder="t.ex. Familjens julklappar 2026"
				bind:value={title}
			/>
		</div>

		<div>
			<div class="flex items-baseline justify-between">
				<label class="label" for="name-0">Deltagare</label>
				<span class="text-xs tracking-[0.12em] text-sage">{count} / {MAX}</span>
			</div>
			<ol class="space-y-2">
				{#each names as _, i (i)}
					<li class="flex items-center gap-2">
						<span class="w-7 shrink-0 text-right font-display text-lg text-sage">{i + 1}</span>
						<input
							class="input py-2"
							id="name-{i}"
							name="name"
							maxlength="40"
							autocomplete="off"
							placeholder="Namn"
							bind:value={names[i]}
							bind:this={inputs[i]}
							onkeydown={(e) => onKeydown(e, i)}
						/>
						<button
							type="button"
							class="flex size-9 shrink-0 items-center justify-center rounded-full text-ink/40 transition hover:bg-blush hover:text-coral"
							aria-label="Ta bort rad"
							onclick={() => remove(i)}>✕</button
						>
					</li>
				{/each}
			</ol>
			<div class="mt-3 flex flex-wrap items-center justify-between gap-2 pl-9">
				<button
					type="button"
					class="btn-ghost"
					disabled={names.length >= MAX}
					onclick={async () => {
						names.push('');
						await tick();
						inputs[names.length - 1]?.focus();
					}}>+ Lägg till rad</button
				>
				<span class="text-xs text-ink/50">Max 40 tecken per namn · Enter = ny rad</span>
			</div>
		</div>

		<div>
			<label class="label" for="password">Adminlösenord</label>
			<input
				class="input"
				id="password"
				name="password"
				type="password"
				required
				minlength="4"
				autocomplete="new-password"
			/>
			<p class="mt-2 text-sm text-ink/60">
				Med lösenordet kan du senare ändra namnen och hantera spelet. Spara det!
			</p>
		</div>

		{#if form?.error}<p class="error">{form.error}</p>{/if}

		<button class="btn w-full" disabled={submitting}>
			{submitting ? 'Skapar…' : 'Skapa spel'}
			<Icon name="arrow" class="h-4 w-6" />
		</button>
	</form>
</section>
