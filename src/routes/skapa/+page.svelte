<script lang="ts">
	import CreateForm from '#lib/CreateForm.svelte';
	import type { PageProps } from './$types';

	// Only reached without JavaScript (or by visiting /skapa directly)
	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Skapa julklappsspel</title>
</svelte:head>

<section class="mx-auto mt-10 max-w-2xl px-5">
	<CreateForm initial={form} />
</section>
