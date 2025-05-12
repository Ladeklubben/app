<script lang="ts">
	import InputField from "$lib/components/ui/InputField.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { DatetimePicker } from "@capawesome-team/capacitor-datetime-picker";
	import { managedChargers } from "$lib/models/ManagedChargers.svelte";
	import { device, Platform } from "$lib/services/layout";
	import { onMount } from "svelte";

	let initialized = false;

	let enabled = $state(false);
	let needed_energy = $state(0);
	let begin_H = $state("18");
	let begin_M = $state("00");
	let end_H = $state("06");
	let end_M = $state("00");
	let preheat = $state(0);

	async function selectTime(timeType: "begin" | "end") {
		if ($device === Platform.Web) {
			console.warn("TimePicker is not supported on web.");
			return;
		}

		const { value } = await DatetimePicker.present({
			mode: "time",
			theme: "dark",
			locale: "en-DK",
			format: "HH:mm",
			value: timeType === "begin" ? `${begin_H}:${begin_M}` : `${end_H}:${end_M}`,
		});

		if (value) {
			const [hour, minute] = value.split(":");
			switch (timeType) {
				case "begin":
					begin_H = hour;
					begin_M = minute;
					break;
				case "end":
					end_H = hour;
					end_M = minute;
					break;
				default:
					console.warn(`Unsupported timeType: ${timeType}`);
			}
		}
	}

	onMount(() => {
		initialized = false;
		const schedule = managedChargers.selectedCharger?.smartChargeSchedule;
		if (schedule) {
			enabled = schedule.enabled;
			needed_energy = schedule.needed_energy;
			begin_H = schedule.charging_begin_earliest.split(":")[0];
			begin_M = schedule.charging_begin_earliest.split(":")[1];
			end_H = schedule.charging_end_latest.split(":")[0];
			end_M = schedule.charging_end_latest.split(":")[1];
			preheat = schedule.preheat;
		}

		// Workaround to ensure that the effect is not triggered immediately
		setTimeout(() => {
			initialized = true;
		}, 0);
	});

	$effect(() => {
		if (initialized && managedChargers.selectedCharger) {
			// TODO: Implement a debounce function to avoid rapid updates
			managedChargers.selectedCharger.putSmartChargeSchedule({
				enabled,
				needed_energy,
				charging_begin_earliest: `${begin_H}:${begin_M}`,
				charging_end_latest: `${end_H}:${end_M}`,
				preheat,
			});
		} else {
			// Ensures the variables are dependencies of the effect
			// and will be tracked by Svelte 5
			console.log("Data loaded: ", {enabled, needed_energy, begin_H, begin_M, end_H, end_M, preheat});
		}
	});
</script>

<Subpage title="Smart Charging" backURL="/menu/chargers/settings">
	<div class="flex flex-col gap-10">
		<InputField label="Enable Smart Charging" type="toggle" bind:value={enabled} />
		<InputField
			label="Power Requirement"
			type="number"
			bind:value={needed_energy}
			description="The amount of kWh your car needs. This is typically set to your daily average."
		/>
		<div class="flex flex-col gap-3">
			<span>
				<span class="font-bold">Earliest Start</span>
				- {begin_H}:{begin_M}
			</span>
			<p>This is the earliest possible time you want to start charging your car.</p>
			<button
				class="p-3 font-bold bg-lk-blue-500 border border-lk-blue-500 rounded-xl text-lk-blue-50
							cursor-pointer disabled:cursor-not-allowed w-full"
				onclick={async () => selectTime("begin")}
			>
				Set Time
			</button>
		</div>
		<div class="flex flex-col gap-3">
			<span>
				<span class="font-bold">Ready Time</span>
				- {end_H}:{end_M}
			</span>
			<p>This is usually when you need to use your car. It will be fully charged by this time.</p>
			<button
				class="p-3 font-bold bg-lk-blue-500 border border-lk-blue-500 rounded-xl text-lk-blue-50
							cursor-pointer disabled:cursor-not-allowed w-full"
				onclick={async () => selectTime("end")}
			>
				Set Time
			</button>
		</div>
		<InputField
			label="Preheat"
			type="number"
			bind:value={preheat}
			description="Set the amount of minutes that your car will need power to heat the cabin"
		/>
	</div>
</Subpage>
