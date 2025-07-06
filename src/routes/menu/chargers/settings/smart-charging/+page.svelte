<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { chargers } from "$lib/classes/Chargers.svelte";
	import { onMount } from "svelte";
	import NumberInput from "$lib/components/ui/inputs/NumberInput.svelte";
	import ToggleInput from "$lib/components/ui/inputs/ToggleInput.svelte";

	let initialized = false;

	let enabled = $state(false);
	let needed_energy = $state(10);
	let begin = $state("18:00");
	let end = $state("06:00");
	let preheat = $state(0);

	let inputErrors = $state({
		needed_energy: "",
		preheat: "",
	});

	function validateSchedule(): boolean {
		// Make sure values are integer
		needed_energy = Math.round(needed_energy);
		preheat = Math.round(preheat);

		if (needed_energy < 1) {
			inputErrors.needed_energy = "Cannot be less than 1kWh";
			return false;
		}
		if (needed_energy === null) {
			inputErrors.needed_energy = "This field is required.";
			return false;
		}
		if (preheat < 0) {
			inputErrors.preheat = "Cannot be negative.";
			return false;
		}
		if (preheat === null) {
			inputErrors.preheat = "This field is required.";
			return false;
		}
		inputErrors.needed_energy = "";
		inputErrors.preheat = "";
		return true;
	}

	onMount(() => {
		initialized = false;
		const schedule = chargers.selected?.smartChargeSchedule;
		if (schedule) {
			enabled = schedule.enabled;
			needed_energy = schedule.needed_energy;
			begin = schedule.charging_begin_earliest.split(":").slice(0, 2).join(":");
			end = schedule.charging_end_latest.split(":").slice(0, 2).join(":");
			preheat = schedule.preheat;
		}

		// Workaround to ensure that the effect is not triggered immediately
		setTimeout(() => {
			initialized = true;
		}, 0);
	});

	$effect(() => {
		if (initialized && chargers.selected) {
			// TODO: Implement a debounce function to avoid rapid updates

			// Validate the schedule before saving
			if (!validateSchedule()) return;

			chargers.selected.putSmartChargeSchedule({
				enabled,
				needed_energy,
				charging_begin_earliest: begin,
				charging_end_latest: end,
				preheat,
			});
		} else {
			// Ensures the variables are dependencies of the effect
			// and will be tracked by Svelte 5
			void enabled;
			void needed_energy;
			void begin;
			void end;
			void preheat;
		}
	});
</script>

<Subpage title="Smart Charging" backURL="/menu/chargers/settings">
	<ToggleInput label="Enable Smart Charging" bind:value={enabled} />
	{#if enabled}
		<NumberInput
			label="Power Requirement"
			suffix="kWh"
			error={inputErrors.needed_energy}
			bind:value={needed_energy}
			description="The amount of kWh your car needs. This is typically set to your daily average."
		/>
		<div class="flex flex-col gap-1.5">
			<span class="font-bold">Earliest Start</span>
			<p>This is the earliest possible time you want to start charging your car.</p>
			<input
				id="earliest-start"
				type="time"
				class="w-full text-center rounded-2xl border border-lk-blue-500 bg-transparent p-3 text-lg text-lk-blue-50 focus:border-lk-blue-300"
				bind:value={begin}
			/>
		</div>
		<div class="flex flex-col gap-1.5">
			<span class="font-bold">Ready Time</span>
			<p>This is usually when you need to use your car. It will be fully charged by this time.</p>
			<input
				id="earliest-start"
				type="time"
				class="w-full text-center rounded-2xl border border-lk-blue-500 bg-transparent p-3 text-lg text-lk-blue-50 focus:border-lk-blue-300"
				bind:value={end}
			/>
		</div>
		<NumberInput
			label="Preheat"
			suffix="min"
			bind:value={preheat}
			description="Set the amount of minutes that your car will need power to heat the cabin"
			error={inputErrors.preheat}
		/>
	{/if}
</Subpage>
