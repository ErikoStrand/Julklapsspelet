<script lang="ts">
	import CreateForm from '#lib/CreateForm.svelte';
	import Village from '#lib/illustrations/Village.svelte';
	import Icon from '#lib/illustrations/Icon.svelte';

	const steps = [
		{
			icon: 'users',
			title: 'Skapa spelet',
			text: 'Skriv in upp till 50 namn och välj ett adminlösenord.'
		},
		{
			icon: 'link',
			title: 'Dela länken',
			text: 'Skicka länken till alla som är med – i chatten, sms eller mejl.'
		},
		{
			icon: 'gift',
			title: 'Dra ett namn',
			text: 'Var och en väljer sig själv och drar i hemlighet vem de ska ge till.'
		}
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
	<CreateForm />
</section>
