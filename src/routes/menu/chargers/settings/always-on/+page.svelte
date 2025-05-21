<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { managedChargers, type AlwaysOnSchedule } from "$lib/models/ManagedChargers.svelte";
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

	console.log($inspect(managedChargers.selectedCharger?.alwaysOnSchedule));

	// Helper functions for time conversion
	function timeStringToMinutes(timeString: string): number {
		const [hours, minutes] = timeString.split(":").map(Number);
		return hours * 60 + minutes;
	}

	function minutesToTimeString(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
	}

	// Convert AlwaysOnSchedule to display format
	function alwaysOnScheduleToDisplayFormat(schedule: AlwaysOnSchedule | undefined): DaySchedule[] {
		const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		const result: DaySchedule[] = [];

		// Initialize all days with empty time slots
		for (let i = 0; i < 7; i++) {
			result.push({
				day: dayNames[i],
				timeSlots: [],
			});
		}

		if (!schedule) return result;

		// Convert each AlwaysOnInterval to TimeSlots for the appropriate days
		for (const interval of schedule) {
			const startTime = minutesToTimeString(interval.start);
			const endTime = minutesToTimeString(interval.start + interval.interval);

			for (const dayIndex of interval.days) {
				result[dayIndex].timeSlots.push({
					id: CryptoJS.lib.WordArray.random(16).toString(),
					startTime,
					endTime,
				});
			}
		}

		return result;
	}

	// Convert display format back to AlwaysOnSchedule
	function displayFormatToAlwaysOnSchedule(daySchedules: DaySchedule[]): AlwaysOnSchedule {
		const result: AlwaysOnSchedule = [] as AlwaysOnSchedule;

		// Group time slots by their time ranges across different days
		const timeRangeMap = new Map<string, number[]>();

		daySchedules.forEach((daySchedule, dayIndex) => {
			daySchedule.timeSlots.forEach((slot) => {
				// Skip empty or invalid time slots
				if (!slot.startTime || !slot.endTime) return;

				const key = `${slot.startTime}-${slot.endTime}`;
				if (!timeRangeMap.has(key)) {
					timeRangeMap.set(key, []);
				}
				timeRangeMap.get(key)!.push(dayIndex);
			});
		});

		// Convert grouped time ranges to AlwaysOnInterval format
		for (const [timeRange, days] of timeRangeMap) {
			const [startTime, endTime] = timeRange.split("-");
			const start = timeStringToMinutes(startTime);
			const end = timeStringToMinutes(endTime);

			// Skip invalid time calculations
			if (isNaN(start) || isNaN(end) || end <= start) continue;

			const interval = end - start;

			result.push({
				days: days.sort(),
				start,
				interval,
			});
		}

		return result;
	}

	// Initialize display data from the actual AlwaysOnSchedule
	let scheduleData = $state(alwaysOnScheduleToDisplayFormat(managedChargers.selectedCharger?.alwaysOnSchedule));

	// Track which day is currently expanded (default to Monday - index 1)
	let expandedDayIndex = $state(0);

	function toggleDay(index: number) {
		expandedDayIndex = expandedDayIndex === index ? -1 : index;
	}

	function addTimeSlot(dayIndex: number) {
		const newTimeSlot: TimeSlot = {
			id: CryptoJS.lib.WordArray.random(16).toString(),
			startTime: "",
			endTime: "",
		};

		scheduleData[dayIndex].timeSlots.push(newTimeSlot);
		scheduleData = [...scheduleData];

		// Update the actual AlwaysOnSchedule
		updateAlwaysOnSchedule();
	}

	function removeTimeSlot(dayIndex: number, slotId: string) {
		scheduleData[dayIndex].timeSlots = scheduleData[dayIndex].timeSlots.filter((slot) => slot.id !== slotId);
		scheduleData = [...scheduleData];

		// Update the actual AlwaysOnSchedule
		updateAlwaysOnSchedule();
	}

	function updateTimeSlot(dayIndex: number, slotId: string, field: "startTime" | "endTime", value: string) {
		const slot = scheduleData[dayIndex].timeSlots.find((s) => s.id === slotId);
		if (slot) {
			slot[field] = value;
			scheduleData = [...scheduleData];

			// Update the actual AlwaysOnSchedule
			updateAlwaysOnSchedule();
		}
	}

	// Update the actual AlwaysOnSchedule data structure
	function updateAlwaysOnSchedule() {
		if (managedChargers.selectedCharger) {
			managedChargers.selectedCharger.alwaysOnSchedule = displayFormatToAlwaysOnSchedule(scheduleData);
		}
	}

	// Handle direct time input changes
	function handleTimeChange(dayIndex: number, slotId: string, field: "startTime" | "endTime", event: Event) {
		const target = event.target as HTMLInputElement;
		updateTimeSlot(dayIndex, slotId, field, target.value);
	}
</script>

<Subpage title="Always On" backURL="/menu/chargers/settings">
	<div class="flex flex-col gap-3 w-full">
		{#each scheduleData as dayData, dayIndex}
			<div class="w-full flex flex-col border border-lk-blue-800 rounded-2xl overflow-hidden">
				<button
					class="flex flex-row justify-between items-center p-4 w-full
					{expandedDayIndex === dayIndex ? 'bg-lk-blue-900' : ''}"
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
							<div class="w-full flex flex-row flex-1 gap-2 items-center">
								<input
									type="time"
									value={timeSlot.startTime}
									onchange={(e) => handleTimeChange(dayIndex, timeSlot.id, "startTime", e)}
									class="flex-1 min-w-0 text-center rounded-2xl border border-lk-blue-500 bg-transparent text-lk-blue-50 focus:border-lk-blue-300 focus:outline-none"
								/>
								<input
									type="time"
									value={timeSlot.endTime}
									onchange={(e) => handleTimeChange(dayIndex, timeSlot.id, "endTime", e)}
									class="flex-1 min-w-0 text-center rounded-2xl border border-lk-blue-500 bg-transparent text-lk-blue-50 focus:border-lk-blue-300 focus:outline-none"
								/>
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
							class="flex p-3 border border-dashed border-lk-blue-100/70 rounded-2xl justify-center gap-3 items-center text-lk-blue-100/70 text-sm"
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
