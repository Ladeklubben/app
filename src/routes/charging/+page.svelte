<script lang="ts">
	import { goto } from "$app/navigation";
	import { selectedCharger } from "$lib/classes/PublicCharger.svelte";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { bottomButtonFixed } from "$lib/services/layout";
	import { onDestroy, onMount } from "svelte";

	function formatDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
		} else {
			return `${minutes}:${secs.toString().padStart(2, "0")}`;
		}
	}

	function stopCharging(event: Event) {
		event.preventDefault();
		selectedCharger.charger?.stopCharge().then(() => {
			goto("/map");
		});
	}

	onMount(() => {
		console.log("Charging", selectedCharger.charger?.stationid);
		$bottomButtonFixed = true;
		selectedCharger.charger?.startPolling();
	});

	onDestroy(() => {
		$bottomButtonFixed = false;
		selectedCharger.charger?.stopPolling();
	});
</script>

<Subpage title="Charging" backURL="/map">
	<div class="flex flex-col gap-5">
		<div class="flex flex-col rounded-2xl overflow-hidden border border-lk-green-500">
			<div
				class="flex flex-row rounded-xl overflow-hidden border border-lk-green-500 bg-lk-green-500 w-full p-6 justify-between items-center"
			>
				<div class="text-lk-blue-950">Energy</div>
				<div class="text-lk-blue-800 text-3xl font-bold">
					{selectedCharger.charger?.charging.consumption?.toFixed(1)}
					<span class="text-sm font-light">kWh</span>
				</div>
			</div>
			<div class="text-lk-blue-300 text-sm p-4 text-center">
				Chargin speed: {selectedCharger.charger?.charging.speed} kW
			</div>
		</div>

		<div
			class="flex flex-row rounded-2xl overflow-hidden border border-lk-blue-800 w-full p-6 justify-between items-center"
		>
			<div class="text-lk-blue-300">Duration</div>
			<div class="text-lk-blue-50 text-3xl font-bold">
				{formatDuration(selectedCharger.charger?.charging.duration || 0)}
			</div>
		</div>

		<div
			class="flex flex-row rounded-2xl overflow-hidden border border-lk-blue-800 w-full p-6 justify-between items-center"
		>
			<div class="text-lk-blue-300">Cost</div>
			<div class="text-lk-blue-50 text-3xl font-bold">
				{selectedCharger.charger?.charging.price?.toFixed(2)}
				<span class="text-sm font-light">DKK</span>
			</div>
		</div>

		<form id="stop-charging" onsubmit={stopCharging}>
			<BottomButton
				buttonText="Stop Charging"
				formID="stop-charging"
				activeDot={undefined}
				totalDots={undefined}
			/>
		</form>
	</div>
</Subpage>
