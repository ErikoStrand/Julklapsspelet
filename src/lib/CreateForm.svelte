<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick, untrack } from 'svelte';
	import Icon from '#lib/illustrations/Icon.svelte';

	// Posts to /skapa so the front page can stay prerendered. Without JS the
	// browser lands on /skapa, which renders this form again with `initial`.
	let { initial }: { initial?: { title?: string; names?: string[]; error?: string } | null } =
		$props();

	const MAX = 50;
	const start = untrack(() => initial);
	let title = $state(start?.title ?? '');
	let names = $state(start?.names?.length ? [...start.names] : ['', '', '']);
	let error = $state(start?.error ?? '');
	let submitting = $state(false);
	let inputs: HTMLInputElement[] = $state([]);
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
</script>

<form
	method="POST"
	action="/skapa"
	class="card space-y-7"
	use:enhance={() => {
		submitting = true;
		error = '';
		return async ({ result, update }) => {
			if (result.type === 'failure') error = String(result.data?.error ?? 'Något gick fel.');
			else if (result.type === 'error') error = 'Något gick fel. Försök igen.';
			else await update();
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

	{#if error}<p class="error">{error}</p>{/if}

	<button class="btn w-full" disabled={submitting}>
		{submitting ? 'Skapar…' : 'Skapa spel'}
		<Icon name="arrow" class="h-4 w-6" />
	</button>
</form>
