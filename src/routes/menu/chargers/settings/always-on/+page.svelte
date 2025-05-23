<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { managedChargers, type AlwaysOnSchedule } from "$lib/models/ManagedChargers.svelte";
	import Trashcan from "~icons/mdi/trash-can-outline";
	import PlusClock from "~icons/mdi/clock-plus-outline";
	import ChevronDown from "~icons/mdi/chevron-down";
	import ChevronUp from "~icons/mdi/chevron-up";
	import AlertCircle from "~icons/mdi/alert-circle-outline";
	import CryptoJS from "crypto-js";
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

	interface ValidationError {
		slotId: string;
		message: string;
		type: "time-order" | "overlap";
	}

	// Helper functions for time conversion
	function timeStringToMinutes(timeString: string): number {
		if (!timeString) return 0;
		const [hours, minutes] = timeString.split(":").map(Number);
		return hours * 60 + minutes;
	}

	function minutesToTimeString(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
	}

	// Validation functions
	function validateTimeSlot(slot: TimeSlot): ValidationError[] {
		const errors: ValidationError[] = [];

		if (!slot.startTime || !slot.endTime) {
			return errors; // Don't validate incomplete slots
		}

		const startMinutes = timeStringToMinutes(slot.startTime);
		const endMinutes = timeStringToMinutes(slot.endTime);

		if (endMinutes <= startMinutes) {
			errors.push({
				slotId: slot.id,
				message: "End time must be after start time",
				type: "time-order",
			});
		}

		return errors;
	}

	function validateDaySchedule(daySchedule: DaySchedule): ValidationError[] {
		const errors: ValidationError[] = [];

		// First validate individual time slots
		for (const slot of daySchedule.timeSlots) {
			errors.push(...validateTimeSlot(slot));
		}

		// Then check for overlaps between different slots
		const validSlots = daySchedule.timeSlots.filter(
			(slot) =>
				slot.startTime &&
				slot.endTime &&
				timeStringToMinutes(slot.endTime) > timeStringToMinutes(slot.startTime),
		);

		for (let i = 0; i < validSlots.length; i++) {
			for (let j = i + 1; j < validSlots.length; j++) {
				const slot1 = validSlots[i];
				const slot2 = validSlots[j];

				const start1 = timeStringToMinutes(slot1.startTime);
				const end1 = timeStringToMinutes(slot1.endTime);
				const start2 = timeStringToMinutes(slot2.startTime);
				const end2 = timeStringToMinutes(slot2.endTime);

				// Check if slots overlap: slot1 starts before slot2 ends AND slot2 starts before slot1 ends
				if (start1 < end2 && start2 < end1) {
					errors.push({
						slotId: slot1.id,
						message: `Overlaps with ${slot2.startTime} - ${slot2.endTime}`,
						type: "overlap",
					});
					errors.push({
						slotId: slot2.id,
						message: `Overlaps with ${slot1.startTime} - ${slot1.endTime}`,
						type: "overlap",
					});
				}
			}
		}

		return errors;
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

				// Skip slots with validation errors
				const slotErrors = validateTimeSlot(slot);
				if (slotErrors.length > 0) return;

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

	// Validation errors state
	let validationErrors = $state<ValidationError[]>([]);

	// Track which day is currently expanded (default to Monday - index 1)
	let expandedDayIndex = $state(0);

	// Validate all schedule data
	function validateAllSchedules() {
		const allErrors: ValidationError[] = [];

		for (const daySchedule of scheduleData) {
			allErrors.push(...validateDaySchedule(daySchedule));
		}

		validationErrors = allErrors;
		return allErrors.length === 0;
	}

	// Get errors for a specific slot
	function getSlotErrors(slotId: string): ValidationError[] {
		return validationErrors.filter((error) => error.slotId === slotId);
	}

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

		// Validate and update if valid
		validateAllSchedules();
		if (validationErrors.length === 0) {
			updateAlwaysOnSchedule();
		}
	}

	function removeTimeSlot(dayIndex: number, slotId: string) {
		scheduleData[dayIndex].timeSlots = scheduleData[dayIndex].timeSlots.filter((slot) => slot.id !== slotId);
		scheduleData = [...scheduleData];

		// Validate and update
		validateAllSchedules();
		updateAlwaysOnSchedule();
	}

	function updateTimeSlot(dayIndex: number, slotId: string, field: "startTime" | "endTime", value: string) {
		const slot = scheduleData[dayIndex].timeSlots.find((s) => s.id === slotId);
		if (slot) {
			slot[field] = value;
			scheduleData = [...scheduleData];

			// Validate and update if valid
			validateAllSchedules();
			if (validationErrors.length === 0) {
				updateAlwaysOnSchedule();
			}
		}
	}

	// Update the actual AlwaysOnSchedule data structure
	function updateAlwaysOnSchedule() {
		if (managedChargers.selectedCharger) {
			managedChargers.selectedCharger.patchAlwaysOnSchedule(displayFormatToAlwaysOnSchedule(scheduleData));
		}
	}

	// Handle direct time input changes
	function handleTimeChange(dayIndex: number, slotId: string, field: "startTime" | "endTime", event: Event) {
		const target = event.target as HTMLInputElement;
		updateTimeSlot(dayIndex, slotId, field, target.value);
	}

	// Initial validation
	validateAllSchedules();
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
							{@const slotErrors = getSlotErrors(timeSlot.id)}
							<div class="w-full flex flex-col gap-2">
								<div class="w-full flex flex-row flex-1 gap-2 items-center">
									<input
										type="time"
										value={timeSlot.startTime}
										onchange={(e) => handleTimeChange(dayIndex, timeSlot.id, "startTime", e)}
										class="flex-1 min-w-0 text-center rounded-2xl border {slotErrors.length > 0
											? 'border-lk-red-500'
											: 'border-lk-blue-500'} bg-transparent text-lk-blue-50 focus:border-lk-blue-300 focus:outline-none"
									/>
									<input
										type="time"
										value={timeSlot.endTime}
										onchange={(e) => handleTimeChange(dayIndex, timeSlot.id, "endTime", e)}
										class="flex-1 min-w-0 text-center rounded-2xl border {slotErrors.length > 0
											? 'border-lk-red-500'
											: 'border-lk-blue-500'} bg-transparent text-lk-blue-50 focus:border-lk-blue-300 focus:outline-none"
									/>
									<button
										class="text-lk-blue-100/70 p-1"
										onclick={() => removeTimeSlot(dayIndex, timeSlot.id)}
										title="Remove time slot"
									>
										<Trashcan />
									</button>
								</div>

								{#if slotErrors.length > 0}
									<div class="flex flex-col gap-1">
										{#each slotErrors as error}
											<div class="flex items-center gap-2 text-lk-red-400 text-sm">
												<AlertCircle class="w-4 h-4" />
												<span>{error.message}</span>
											</div>
										{/each}
									</div>
								{/if}
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

		{#if validationErrors.length > 0}
			<div class="w-full p-4 bg-lk-red-900/20 border border-lk-red-500 rounded-2xl">
				<div class="flex items-center gap-2 text-lk-red-400 mb-2">
					<AlertCircle class="w-5 h-5" />
					<span class="font-semibold">Schedule has validation errors</span>
				</div>
				<p class="text-lk-red-300 text-sm">Please fix the errors above before the schedule can be saved.</p>
			</div>
		{/if}
	</div>
</Subpage>
