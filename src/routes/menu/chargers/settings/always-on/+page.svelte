<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { managedChargers } from "$lib/models/ManagedChargers.svelte";
	import Trashcan from "~icons/mdi/trash-can-outline";
	import PlusClock from "~icons/mdi/clock-plus-outline";
	import CryptoJS from "crypto-js";
	import InputField from "$lib/components/ui/InputField.svelte";

	interface TimeSlot {
		id: string;
		startTime: string;
		endTime: string;
	}

	interface DaySchedule {
		day: string;
		timeSlots: TimeSlot[];
	}

	// Initialize data with existing time slots
	let scheduleData: DaySchedule[] = $state([
		{
			day: "Monday",
			timeSlots: [{ id: CryptoJS.lib.WordArray.random(16).toString(), startTime: "13:00", endTime: "17:00" }],
		},
		{
			day: "Tuesday",
			timeSlots: [{ id: CryptoJS.lib.WordArray.random(16).toString(), startTime: "13:00", endTime: "17:00" }],
		},
		{
			day: "Wednesday",
			timeSlots: [{ id: CryptoJS.lib.WordArray.random(16).toString(), startTime: "13:00", endTime: "17:00" }],
		},
		{
			day: "Thursday",
			timeSlots: [{ id: CryptoJS.lib.WordArray.random(16).toString(), startTime: "13:00", endTime: "17:00" }],
		},
		{
			day: "Friday",
			timeSlots: [{ id: CryptoJS.lib.WordArray.random(16).toString(), startTime: "13:00", endTime: "17:00" }],
		},
		{
			day: "Saturday",
			timeSlots: [{ id: CryptoJS.lib.WordArray.random(16).toString(), startTime: "13:00", endTime: "17:00" }],
		},
		{
			day: "Sunday",
			timeSlots: [{ id: CryptoJS.lib.WordArray.random(16).toString(), startTime: "13:00", endTime: "17:00" }],
		},
	]);

	function addTimeSlot(dayIndex: number) {
		const newTimeSlot: TimeSlot = {
			id: CryptoJS.lib.WordArray.random(16).toString(),
			startTime: "09:00",
			endTime: "12:00",
		};

		scheduleData[dayIndex].timeSlots.push(newTimeSlot);
		// Trigger reactivity in Svelte 5
		scheduleData = [...scheduleData];
	}

	function removeTimeSlot(dayIndex: number, slotId: string) {
		scheduleData[dayIndex].timeSlots = scheduleData[dayIndex].timeSlots.filter((slot) => slot.id !== slotId);
		// Trigger reactivity in Svelte 5
		scheduleData = [...scheduleData];
	}

	function updateTimeSlot(dayIndex: number, slotId: string, field: "startTime" | "endTime", value: string) {
		const slot = scheduleData[dayIndex].timeSlots.find((s) => s.id === slotId);
		if (slot) {
			slot[field] = value;
			// Trigger reactivity in Svelte 5
			scheduleData = [...scheduleData];
		}
	}
</script>

<Subpage title="Always On" backURL="/menu/chargers/settings">
	{#each scheduleData as dayData, dayIndex}
		<div class="w-full flex flex-col border border-lk-blue-800 rounded-2xl overflow-hidden">
			<div class="flex flex-row justify-between items-center bg-lk-blue-900 px-4 py-3">
				<span class="font-bold">{dayData.day}</span>
				<button
					class="bg-lk-blue-700 text-white rounded-full p-2 transition-colors"
					onclick={() => addTimeSlot(dayIndex)}
					title="Add time slot"
				>
					<PlusClock />
				</button>
			</div>
			<div class="flex flex-col p-4 gap-4">
				{#each dayData.timeSlots as timeSlot}
					<div class="w-full flex flex-row gap-3 items-center">
						<InputField type="time" label="" bind:value={timeSlot.startTime} />
						<InputField type="time" label="" bind:value={timeSlot.endTime} />
						<button
							class="text-lk-red-700 p-1"
							onclick={() => removeTimeSlot(dayIndex, timeSlot.id)}
							title="Remove time slot"
						>
							<Trashcan />
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</Subpage>
