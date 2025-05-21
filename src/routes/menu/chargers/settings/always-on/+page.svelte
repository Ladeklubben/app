<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { managedChargers } from "$lib/models/ManagedChargers.svelte";
	import Trashcan from "~icons/mdi/trash-can-outline";
	import PlusClock from "~icons/mdi/clock-plus-outline";
	import ChevronDown from "~icons/mdi/chevron-down";
	import ChevronUp from "~icons/mdi/chevron-up";
	import CryptoJS from "crypto-js";
	import InputField from "$lib/components/ui/InputField.svelte";
	import { slide } from "svelte/transition";

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

	// Track which day is currently expanded (default to Monday - index 0)
	let expandedDayIndex = $state(0);

	function toggleDay(index: number) {
		expandedDayIndex = expandedDayIndex === index ? -1 : index;
	}

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
	<div class="flex flex-col gap-3 w-full">
		{#each scheduleData as dayData, dayIndex}
			<div class="w-full flex flex-col border border-lk-blue-800 rounded-2xl overflow-hidden">
				<button
					class="flex flex-row justify-between items-center {expandedDayIndex === dayIndex ? "bg-lk-blue-900" : ""} p-4 w-full"
					onclick={() => toggleDay(dayIndex)}
				>
					<h3 class="font-bold text-lk-blue-50">{dayData.day}</h3>
					<div class="flex items-center gap-2">
						<div
							class="w-2 h-2 rounded-full {dayData.timeSlots.length > 0
								? 'bg-lk-green-500'
								: 'bg-lk-red-500'}"
						></div>
						{#if expandedDayIndex === dayIndex}
							<ChevronUp class="text-lk-blue-100" />
						{:else}
							<ChevronDown class="text-lk-blue-100" />
						{/if}
					</div>
				</button>

				{#if expandedDayIndex === dayIndex}
					<div class="flex flex-col p-4 gap-4" transition:slide>
						{#each dayData.timeSlots as timeSlot}
							<div class="w-full flex flex-row gap-3 items-center">
								<InputField type="time" label="" bind:value={timeSlot.startTime} />
								<InputField type="time" label="" bind:value={timeSlot.endTime} />
								<button
									class="text-lk-blue-100/70 p-1"
									onclick={() => removeTimeSlot(dayIndex, timeSlot.id)}
									title="Remove time slot"
								>
									<Trashcan />
								</button>
							</div>
						{/each}
						<button
							class="flex p-2 border border-dashed border-lk-blue-100/70 rounded-2xl justify-center gap-3 items-center text-lk-blue-100/70"
							onclick={() => addTimeSlot(dayIndex)}
							title="Add time slot"
						>
							<PlusClock />Add time slot
						</button>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</Subpage>
