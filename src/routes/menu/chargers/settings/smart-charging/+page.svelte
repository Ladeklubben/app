<script lang="ts">
	import InputField from "$lib/components/ui/InputField.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { DatetimePicker } from "@capawesome-team/capacitor-datetime-picker";
	import { chargers } from "$lib/classes/Chargers.svelte";
	import { device, Platform } from "$lib/services/layout";
	import { onMount } from "svelte";

	let initialized = false;

	let enabled = $state(false);
	let needed_energy = $state(0);
	let begin = $state("18:00");
	let end = $state("06:00");
	let preheat = $state(0);

	async function selectTime(timeType: "begin" | "end") {
		if ($device === Platform.Web) {
			console.warn("TimePicker is not supported on web.");
			// TODO: Implement a web version of the time picker
			return;
		}

		const { value } = await DatetimePicker.present({
			mode: "time",
			theme: "dark",
			locale: "en-DK",
			format: "HH:mm",
			value: timeType === "begin" ? begin : end,
		});

		if (value) {
			switch (timeType) {
				case "begin":
					begin = value;
					break;
				case "end":
					end = value;
					break;
				default:
					console.warn(`Unsupported timeType: ${timeType}`);
			}
		}
	}

	onMount(() => {
		initialized = false;
		const schedule = chargers.selected?.smartChargeSchedule;
		if (schedule) {
			enabled = schedule.enabled;
			needed_energy = schedule.needed_energy;
			begin = schedule.charging_begin_earliest.split(':').slice(0, 2).join(':');
			end = schedule.charging_end_latest.split(':').slice(0, 2).join(':');
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
	<InputField label="Enable Smart Charging" type="toggle" bind:value={enabled} />
	<InputField
		label="Power Requirement"
		type="number"
		suffix="kWh"
		center={true}
		bind:value={needed_energy}
		description="The amount of kWh your car needs. This is typically set to your daily average."
	/>
	<div class="flex flex-col gap-1.5">
		<span>
			<span class="font-bold">Earliest Start</span>
			- {begin}
		</span>
		<p>This is the earliest possible time you want to start charging your car.</p>
		<button
			class="p-3 mt-2 font-bold bg-lk-blue-500 border border-lk-blue-500 rounded-xl text-lk-blue-50
							cursor-pointer disabled:cursor-not-allowed w-full"
			onclick={async () => selectTime("begin")}
		>
			Set Time
		</button>
	</div>
	<div class="flex flex-col gap-1.5">
		<span>
			<span class="font-bold">Ready Time</span>
			- {end}
		</span>
		<p>This is usually when you need to use your car. It will be fully charged by this time.</p>
		<button
			class="p-3 mt-2 font-bold bg-lk-blue-500 border border-lk-blue-500 rounded-xl text-lk-blue-50
							cursor-pointer disabled:cursor-not-allowed w-full"
			onclick={async () => selectTime("end")}
		>
			Set Time
		</button>
	</div>
	<InputField
		label="Preheat"
		type="number"
		suffix="min"
		center={true}
		bind:value={preheat}
		description="Set the amount of minutes that your car will need power to heat the cabin"
	/>
</Subpage>
