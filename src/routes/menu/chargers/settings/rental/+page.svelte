<script lang="ts">
	import WeekSchedule from "$lib/components/features/charger/WeekSchedule.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import { chargers } from "$lib/classes/Chargers.svelte";

	let rentalEnabled = $state(chargers.selected?.chargeState?.public ?? false);
	let rentPossible = $state(false);
	let loaded = $state(false);

	// TODO: Handle API errors

	$effect(() => {
		chargers.selected?.putPublicCharger(rentalEnabled).then((result) => {
			rentPossible = result;
			loaded = true;
		});
	});
</script>

<Subpage title="Rental" backURL="/menu/chargers/settings">
	{#if loaded}
		{#if rentPossible}
			<p>
				Make money by renting out your charger. Set your available time periods for different days, and you'll
				automatically earn money based on how much other members use it.
			</p>
			<InputField label="Enable Rental" labelBold={true} type="toggle" bind:value={rentalEnabled} />

			{#if rentalEnabled}
				<WeekSchedule scheduleType="openhours"></WeekSchedule>
			{/if}
		{:else}
			<p class="p-5 bg-lk-red-800 rounded-2xl">
				Rental is not available for this charger. If you think this is a mistake or you want to get a charger
				that supports rental, then contact us!
			</p>
		{/if}
	{/if}
</Subpage>
