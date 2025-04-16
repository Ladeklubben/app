<script lang="ts">
	import { onMount } from "svelte";
	import { isLoading, error, fetchPrices, prices } from "$lib/services/prices";
	import type { PriceData } from "$lib/types/prices.types";
	import Card from "$lib/components/ui/Card.svelte";
	import PriceChart from "$lib/components/features/prices/PriceChart.svelte";
	import SingleStatCard from "$lib/components/ui/SingleStatCard.svelte";
	import PhaseOverview from "$lib/components/features/meter/PhaseOverview.svelte";
	import { fetchpowerImport, meterData, lastFetch } from "$lib/services/meter";
	import { getPosition } from "$lib/services/map";

	onMount(async () => {
		fetchpowerImport();
		getPosition();
		await fetchPrices();
		if ($prices.length > 0) {
			currentPrice = getCurrentPrice($prices);
		}
	});

	function getCurrentPrice(prices: PriceData[]) {
		const earliestPrice = prices[0];
		const date = new Date(earliestPrice.Timestamp * 1000);
		const hour = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		const time = `${hour}:${minutes}`;
		const price = (earliestPrice.Costprice_VAT / 100).toFixed(2);

		return { time, price };
	}

	let currentPrice = $state({ time: "", price: "" });

	const formatter = new Intl.NumberFormat("en-DK");
	const total_power_import = $derived(
		$meterData ? formatter.format($meterData.totals.total_power_import * 1000) : "",
	);
</script>

<div class="wrapper">
	<SingleStatCard description="Live Usage - {$lastFetch}" stat={total_power_import} unit="W" />
	<PhaseOverview />
	<SingleStatCard description="Live Price - {currentPrice.time}" stat={currentPrice.price} unit="kr." />
	<Card title="Price Chart">
		{#if $isLoading}
			<p>Loading...</p>
		{:else if $error}
			<p>Error: {$error}</p>
		{:else}
			Cost price with VAT
			<PriceChart />
		{/if}
	</Card>
</div>
