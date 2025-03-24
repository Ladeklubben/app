<script lang="ts">
	import PhaseOverview from "$lib/components/features/meter/PhaseOverview.svelte";
	import SingleStatCard from "$lib/components/ui/SingleStatCard.svelte";
	import { onMount } from "svelte";
	import { fetchpowerImport, meterData, lastFetch } from "$lib/services/meter";
	import { getPosition } from "$lib/services/map";
	import { goto } from "$app/navigation";
	import SmartCharge from "$lib/components/features/charger/SmartCharge.svelte";

	onMount(() => {
		fetchpowerImport();
		getPosition();
	});

	const formatter = new Intl.NumberFormat("en-DK");
	const total_power_import = $derived(
		$meterData ? formatter.format($meterData.totals.total_power_import * 1000) : "",
	);
</script>

<div class="wrapper">
	<div class=" flex justify-between items-center">
		<h1>Home</h1>
		<button
			class="flex flex-col justify-center items-center cursor-pointer bg-lk-blue-300 text-4xl border-0 rounded-4xl w-8 h-8"
			onclick={() => goto("/setup/site")}
		>
			<span class="add-icon">+</span>
		</button>
	</div>
	<SmartCharge />
	<SingleStatCard description="Live Usage - {$lastFetch}" stat={total_power_import} unit="W" />
	<PhaseOverview />
</div>
