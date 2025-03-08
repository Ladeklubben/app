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
	const total_power_import = $derived($meterData ? formatter.format($meterData.totals.total_power_import * 1000) : "");
</script>

<div class="wrapper">
	<div class="header">
		<h1>Home</h1>
		<button class="add-button" onclick={() => goto("/setup/installation")}>
			<span class="add-icon">+</span>
		</button>
	</div>
	<SingleStatCard description="Live Usage - {$lastFetch}" stat={total_power_import} unit="W" />
	<PhaseOverview />
</div>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.add-button {
		background-color: var(--lk-blue-200);
		font-size: 32px;
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
</style>
