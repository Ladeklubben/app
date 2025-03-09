<script lang="ts">
	import PhaseOverview from "$lib/components/features/meter/PhaseOverview.svelte";
	import SingleStatCard from "$lib/components/ui/SingleStatCard.svelte";
	import { onMount } from "svelte";
	import { fetchpowerImport, meterData, lastFetch } from "$lib/services/meter";
	import { goto } from "$app/navigation";

	onMount(() => {
		fetchpowerImport();
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
			class="bg-lk-blue-300 text-4xl border-0 rounded-4xl w-8 h-8"
			onclick={() => goto("/setup/installation")}
		>
			<span class="add-icon">+</span>
		</button>
	</div>
	<SingleStatCard description="Live Usage - {$lastFetch}" stat={total_power_import} unit="W" />
	<PhaseOverview />
</div>
