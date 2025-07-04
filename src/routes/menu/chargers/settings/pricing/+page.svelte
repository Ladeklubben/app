<script lang="ts">
	import { goto } from "$app/navigation";
	import InputField from "$lib/components/ui/InputField.svelte";
	import NumberInput from "$lib/components/ui/inputs/NumberInput.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { chargers } from "$lib/classes/Chargers.svelte";
	import type { ListPrice } from "$lib/types/charger.types";
	import { onMount } from "svelte";
	import { showError } from "$lib/services/dialog.svelte";

	let initialized = false;

	const DEFAULT_LIST_PRICE = {
		nominal: 0,
		minimum: 1,
		fallback: 3,
		valuta: "DKK",
		follow_spot: true,
	};

	let listPriceVAT: ListPrice = $state(DEFAULT_LIST_PRICE);
	let inputErrors = $state({
		nominal: "",
		minimum: "",
		fallback: "",
	});

	function validateInputs(): boolean {
		// Reset errors
		inputErrors.nominal = "";
		inputErrors.minimum = "";
		inputErrors.fallback = "";

		// Validate nominal price
		if (isNaN(parseFloat(String(listPriceVAT.nominal)))) {
			inputErrors.nominal = "Please enter a valid number";
			return false;
		}

		// Validate minimum price
		if (isNaN(parseFloat(String(listPriceVAT.minimum)))) {
			inputErrors.minimum = "Please enter a valid number";
			return false;
		}

		// Validate fallback price if following spot prices
		if (listPriceVAT.follow_spot && isNaN(parseFloat(String(listPriceVAT.fallback)))) {
			inputErrors.fallback = "Please enter a valid number";
			return false;
		}

		return true;
	}

	onMount(() => {
		initialized = false;
		if (chargers.selected) {
			const initialPrices = chargers.selected.listPrice;
			if (initialPrices) {
				listPriceVAT = chargers.selected.convertListPrice(initialPrices, true);
			}
		} else {
			showError("No charger selected, please select a charger first.", false);
			goto("/menu/chargers");
		}

		// Workaround to ensure that the effect is not triggered immediately
		setTimeout(() => {
			initialized = true;
		}, 0);
	});

	$effect(() => {
		if (initialized && chargers.selected) {
			// TODO: Implement a debounce function to avoid rapid updates
			if (!validateInputs()) {
				console.warn("Invalid input detected, not updating price list.");
				return;
			}
			const priceForServer = chargers.selected.convertListPrice(listPriceVAT, false);
			chargers.selected.putListPrice(priceForServer);
			console.log("Updating price list: ", priceForServer);
		} else {
			// Ensures the variables are dependencies of the effect
			// and will be tracked by Svelte 5
			void listPriceVAT.nominal;
			void listPriceVAT.minimum;
			void listPriceVAT.fallback;
			void listPriceVAT.follow_spot;
		}
	});
</script>

<Subpage title="Pricing" backURL="/menu/chargers/settings">
	<InputField label="Follow live energy prices" type="toggle" bind:value={listPriceVAT.follow_spot} />
	{#if listPriceVAT.follow_spot}
		<NumberInput
			label="Price Markup"
			suffix="DKK/kWh"
			bind:value={listPriceVAT.nominal}
			error={inputErrors.nominal}
			description="Price added to the live energy price"
		/>
		<NumberInput
			label="Fallback Price"
			suffix="DKK/kWh"
			bind:value={listPriceVAT.fallback}
			error={inputErrors.fallback}
			description="Default price if public spot prices are unavailable"
		/>
	{:else}
		<NumberInput
			label="Fixed Price"
			suffix="DKK/kWh"
			bind:value={listPriceVAT.nominal}
			error={inputErrors.nominal}
			description="Price per kWh"
		/>
	{/if}
	<NumberInput
		label="Minimum Price"
		suffix="DKK/kWh"
		bind:value={listPriceVAT.minimum}
		error={inputErrors.minimum}
		description="Minimal price regardless of live energy prices or discounts"
	/>
</Subpage>
