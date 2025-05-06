<script lang="ts">
	import InputField from "$lib/components/ui/InputField.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import TimePicker from "$lib/components/ui/TimePicker.svelte";
	import { managedChargers } from "$lib/models/ManagedChargers.svelte";
	import { onMount } from "svelte";

	let loading = $state(true);

	let enabled = $state(false);
	let needed_energy = $state(0);

	let begin_H = $state("18");
	let begin_M = $state("00");
	const begin = $derived(`${begin_H}:${begin_M}:00`);

	let end_H = $state("06");
	let end_M = $state("00");
	const end = $derived(`${end_H}:${end_M}:00`);

	let preheat_H = $state("00");
	let preheat_M = $state("00");
	const preheat = $derived(parseInt(preheat_H) * 60 + parseInt(preheat_M));

	onMount(() => {
		loading = true;
		const schedule = managedChargers.selectedCharger?.smartChargeSchedule;
		if (schedule) {
			enabled = schedule.enabled;
			needed_energy = schedule.needed_energy;
			begin_H = schedule.charging_begin_earliest.split(":")[0];
			begin_M = schedule.charging_begin_earliest.split(":")[1];
			end_H = schedule.charging_end_latest.split(":")[0];
			end_M = schedule.charging_end_latest.split(":")[1];
			preheat_H = Math.floor(schedule.preheat / 60).toString();
			preheat_M = (schedule.preheat % 60).toString();
		}
		console.log($state.snapshot(managedChargers.selectedCharger?.smartChargeSchedule));
		console.log($state.snapshot(begin_H));
		loading = false;
	});

</script>

<Subpage title="Smart Charging" backURL="/menu/chargers">
	{#if loading}
		<div class="flex flex-col items-center justify-center h-full">
			<p class="text-lg">Loading...</p>
		</div>
	{:else}
		<div class="flex flex-col gap-10">
			<InputField label="Enable Smart Charging" type="toggle" bind:value={enabled} />
			<InputField
				label="Power Requirement - kWh"
				type="number"
				bind:value={needed_energy}
				description="The amount of power your car needs. This is typically set to your daily average."
			/>
			<div class="flex flex-col gap-3">
				<span class="font-bold">Earliest Start</span>
				<p class="mb-2">This is the earliest possible time you want to start charging your car.</p>
				<div
					class="flex flex-row justify-center gap-4 rounded-2xl border border-lk-blue-800"
					style="background: linear-gradient(to right, #59a6b7, #2e4d59);"
				>
					<TimePicker
						bind:selectedTime={begin_H}
						maxValue={24}
						align="right"
						small={true}
					/>
					<TimePicker
						bind:selectedTime={begin_M}
						maxValue={60}
						jump={15}
						align="left"
						small={true}
					/>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<span class="font-bold">Ready Time</span>
				<p class="mb-2">
					This is the usually when you need to use your car. It will be fully charged by this time.
				</p>
				<div
					class="flex flex-row justify-center gap-4 rounded-2xl border border-lk-blue-800"
					style="background: linear-gradient(to right, #59a6b7, #2e4d59);"
				>
					<TimePicker
						bind:selectedTime={end_H}
						maxValue={24}
						align="right"
						small={true}
					/>
					<TimePicker
						bind:selectedTime={end_M}
						maxValue={60}
						jump={15}
						align="left"
						small={true}
					/>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<span class="font-bold">Preheat</span>
				<p class="mb-2">
					This is the usually when you need to use your car. It will be fully charged by this time.
				</p>
				<div
					class="flex flex-row justify-center gap-4 rounded-2xl border border-lk-blue-800"
					style="background: linear-gradient(to right, #59a6b7, #2e4d59);"
				>
					<TimePicker
						bind:selectedTime={preheat_H}
						maxValue={24}
						align="right"
						small={true}
					/>
					<TimePicker
						bind:selectedTime={preheat_M}
						maxValue={60}
						jump={15}
						align="left"
						small={true}
					/>
				</div>
			</div>
		</div>
	{/if}
</Subpage>
