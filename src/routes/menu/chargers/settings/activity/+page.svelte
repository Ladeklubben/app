<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import ChevronUp from "~icons/mdi/chevron-up";
	import ChevronDown from "~icons/mdi/chevron-down";
	import { managedChargers } from "$lib/models/ManagedChargers.svelte";
	import { slide } from "svelte/transition";

	const transactions = $derived(managedChargers.selectedCharger?.transactionsList);

	// State for expanded transaction
	let expandedId: string | null = $state(null);

	// Function to toggle expanded state
	function toggleExpand(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	function calculateConsumption(meter_start: string, meter_end: string) {
		// Convert to numbers
		const meter_start_num = parseFloat(meter_start);
		const meter_end_num = parseFloat(meter_end);

		// Check if the values are valid numbers
		if (isNaN(meter_start_num) || isNaN(meter_end_num)) {
			return 0;
		}

		return meter_end_num - meter_start_num;
	}

	// Function to format date or time
	function formatDate(dateString: string, type: "date" | "time" = "date") {
		// Convert Unix timestamp (seconds) to milliseconds
		const timestamp = parseInt(dateString) * 1000;
		const date = new Date(timestamp);

		if (type === "date") {
			return date.toLocaleDateString("en-DK", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			});
		} else {
			return date.toLocaleTimeString("en-DK", {
				hour: "2-digit",
				minute: "2-digit",
			});
		}
	}
</script>

<Subpage title="Activity" backURL="/menu/chargers/settings">
	{#if !transactions || transactions.length === 0}
		<div class="rounded-2xl p-8 text-center">
			<p class="text-lk-blue-50">No transactions available</p>
		</div>
	{:else}
		{#each transactions as tx}
			<div class="border border-lk-blue-800 rounded-2xl">
				<button
					class="p-4 flex justify-between items-center cursor-pointer text-left w-full"
					onclick={() => toggleExpand(tx.Tid)}
				>
					<div class="flex-1">
						<h3 class="font-bold text-lk-blue-50 pb-1">{formatDate(tx.Started, "date")}</h3>
						<p class="text-sm text-lk-blue-300">
							{formatDate(tx.Started, "time")} - {formatDate(tx.Ended, "time")}
						</p>
					</div>
					<div class="flex items-center">
						<span class="font-bold text-lk-blue-300 mr-3">{parseFloat(tx.Cost).toFixed(2)} kr.</span>
						{#if expandedId === tx.Tid}
							<ChevronUp class="h-4 w-4 text-lk-blue-50" />
						{:else}
							<ChevronDown class="h-4 w-4 text-lk-blue-50" />
						{/if}
					</div>
				</button>

				{#if expandedId === tx.Tid}
					<div class="p-4 border-t border-lk-blue-800 text-sm" transition:slide>
						<div class="grid grid-cols-2 gap-2">
							<div>
								<p class="text-xs text-lk-blue-300">Power [kWh]</p>
								<p class="lk-blue-50">
									{calculateConsumption(tx.meter_start, tx.meter_stop).toFixed(2)}
								</p>
							</div>
							<div>
								<p class="text-xs text-lk-blue-300">Price [kr/kWh]</p>
								<p class="lk-blue-50">
									{(
										parseFloat(tx.Cost) / calculateConsumption(tx.meter_start, tx.meter_stop)
									).toFixed(2)}
								</p>
							</div>
							<div>
								<p class="text-xs text-lk-blue-300">ID</p>
								<p class="lk-blue-50">{tx.Tid}</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	{/if}
</Subpage>
