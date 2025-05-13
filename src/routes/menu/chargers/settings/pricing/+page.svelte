<script lang="ts">
	import InputField from "$lib/components/ui/InputField.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { managedChargers } from "$lib/models/ManagedChargers.svelte";
	import type { ListPrice } from "$lib/models/ManagedChargers.svelte";
	import { get } from "$lib/services/api";
	import { onMount } from "svelte";

	let initialized = false;

	const DEFAULT_LIST_PRICE = {
		nominal: 0,
		minimum: 1,
		fallback: 3,
		valuta: "DKK",
		follow_spot: true,
	};

	let listPriceVAT: ListPrice = $state(DEFAULT_LIST_PRICE);
	let listPrice: ListPrice = $state(DEFAULT_LIST_PRICE);

	function convertListPrice(listPrice: ListPrice, addVAT: boolean): ListPrice {
		const convertedListPrice: ListPrice = {
			...listPrice,
			nominal: listPrice.nominal * (addVAT ? 1.25 : 0.8),
			minimum: listPrice.minimum * (addVAT ? 1.25 : 0.8),
			fallback: listPrice.fallback * (addVAT ? 1.25 : 0.8),
		};

		return convertedListPrice;
	}

	onMount(() => {
		if (managedChargers.selectedCharger) {
			const initialPrices = managedChargers.selectedCharger.listPrice;
			if (initialPrices) {
				listPriceVAT = convertListPrice(listPrice, true);
			}
		}
	});

	// $effect(() => {
	// 	if (initialized && managedChargers.selectedCharger) {
	// 		// TODO: Implement a debounce function to avoid rapid updates
	// 		managedChargers.selectedCharger.putSmartChargeSchedule({
	// 			enabled,
	// 			needed_energy,
	// 			charging_begin_earliest: `${begin_H}:${begin_M}`,
	// 			charging_end_latest: `${end_H}:${end_M}`,
	// 			preheat,
	// 		});
	// 	} else {
	// 		// Ensures the variables are dependencies of the effect
	// 		// and will be tracked by Svelte 5
	// 		console.log("Data loaded: ", {enabled, needed_energy, begin_H, begin_M, end_H, end_M, preheat});
	// 	}
	// });
</script>

<Subpage title="Pricing" backURL="/menu/chargers/settings">
	<InputField label="Follow live energy prices" type="toggle" bind:value={listPriceVAT.follow_spot} />
	{#if listPriceVAT.follow_spot}
		<InputField
			label="Price Markup"
			type="number"
			suffix="DKK/kWh"
			center={true}
			bind:value={listPriceVAT.nominal}
			description="Price added to the live energy price"
		/>
		<InputField
			label="Fallback Price"
			type="number"
			suffix="DKK/kWh"
			center={true}
			bind:value={listPriceVAT.fallback}
			description="Default price if public spot prices are unavailable"
		/>
	{:else}
		<InputField
			label="Fixed Price"
			type="number"
			suffix="DKK/kWh"
			center={true}
			bind:value={listPriceVAT.nominal}
			description="Price per kWh"
		/>
	{/if}
	<InputField
		label="Minimum Price"
		type="number"
		suffix="DKK/kWh"
		center={true}
		bind:value={listPriceVAT.minimum}
		description="Minimal price regardless of live energy prices or discounts"
	/>
</Subpage>
