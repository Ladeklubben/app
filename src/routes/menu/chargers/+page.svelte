<script lang="ts">
	import { onMount } from "svelte";
	import { ManagedChargersStore } from "$lib/models/ManagedChargers";
	import Subpage from "$lib/components/ui/Subpage.svelte";

	onMount(async () => {

		await $ManagedChargersStore.initializeChargers();
		await $ManagedChargersStore.loadAllChargersData();
	});
</script>

<Subpage title="Chargers" backURL="/menu">
	{#each $ManagedChargersStore.getAllChargers() as charger}
		<div class="flex flex-col gap-5 p-5 rounded-2xl border border-lk-blue-800">
			{charger.id}
		</div>
	{/each}
</Subpage>
