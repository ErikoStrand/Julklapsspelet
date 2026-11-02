<script lang="ts">
	import { enhance } from '$app/forms';

	// A form action button that asks for confirmation inline instead of a browser popup.
	let {
		action,
		label,
		question,
		confirmLabel = 'Ja',
		id,
		danger = false,
		disabled = false
	}: {
		action: string;
		label: string;
		question: string;
		confirmLabel?: string;
		id?: string;
		danger?: boolean;
		disabled?: boolean;
	} = $props();

	let confirming = $state(false);
</script>

<form
	method="POST"
	{action}
	class="inline-flex"
	use:enhance={() =>
		async ({ update }) => {
			confirming = false;
			await update();
		}}
>
	{#if id}<input type="hidden" name="id" value={id} />{/if}
	{#if confirming}
		<span
			class="inline-flex flex-wrap items-center gap-2 rounded-full bg-blush py-1 pr-1 pl-4 text-sm ring-1 ring-blush-2"
		>
			{question}
			<button class="btn px-4 py-1.5 text-xs">{confirmLabel}</button>
			<button type="button" class="btn-ghost bg-white py-1.5" onclick={() => (confirming = false)}
				>Avbryt</button
			>
		</span>
	{:else}
		<button
			type="button"
			class="btn-ghost {danger ? 'text-coral-dark' : ''}"
			{disabled}
			onclick={() => (confirming = true)}>{label}</button
		>
	{/if}
</form>
