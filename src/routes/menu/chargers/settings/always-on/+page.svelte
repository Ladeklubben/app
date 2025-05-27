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

	// Types for display data
	interface DisplaySchedule {
		id: string;
		days: number[];
		startTime: string;
		endTime: string;
		expanded: boolean;
	}

	// Day names for display
	const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	const dayAbbreviations = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

	// Convert schedule data to display format
	function convertScheduleDataToDisplayData(scheduleData: AlwaysOnSchedule): DisplaySchedule[] {
		return scheduleData.map((schedule) => ({
			id: CryptoJS.MD5(JSON.stringify(schedule)).toString(),
			days: schedule.days,
			startTime: minutesToTimeString(schedule.start),
			endTime: minutesToTimeString(schedule.start + schedule.interval),
			expanded: false,
		}));
	}

	// Convert display data back to schedule format
	function convertDisplayDataToScheduleData(displayData: DisplaySchedule[]): AlwaysOnSchedule {
		return displayData.map((schedule) => ({
			days: schedule.days,
			start: timeStringToMinutes(schedule.startTime),
			interval: timeStringToMinutes(schedule.endTime) - timeStringToMinutes(schedule.startTime),
		}));
	}

	// Initialize display data from the actual AlwaysOnSchedule
	let displaySchedules: DisplaySchedule[] = $state(
		convertScheduleDataToDisplayData(managedChargers.selectedCharger?.alwaysOnSchedule || []),
	);

	// Add new schedule
	function addNewSchedule() {
		const newSchedule: DisplaySchedule = {
			id: CryptoJS.MD5(Date.now().toString()).toString(),
			days: [0], // Default to Monday
			startTime: "18:00",
			endTime: "23:59",
			expanded: true,
		};
		displaySchedules = [...displaySchedules, newSchedule];
		managedChargers.selectedCharger?.addAlwaysOnSchedule(convertDisplayDataToScheduleData([newSchedule])[0]);
	}

	// Remove schedule
	function removeSchedule(schedule: DisplaySchedule) {
		// Remove from display
		displaySchedules = displaySchedules.filter((s) => s.id !== schedule.id);
		const newScheduleData = convertDisplayDataToScheduleData(displaySchedules);
		if (managedChargers.selectedCharger) {
			managedChargers.selectedCharger.alwaysOnSchedule = newScheduleData;
		}

		// Remove from managed charger
		let scheduleToRemove = convertDisplayDataToScheduleData([schedule])[0];
		managedChargers.selectedCharger?.deleteAlwaysOnSchedule(scheduleToRemove);
	}

	// Toggle schedule expansion
	function toggleSchedule(id: string) {
		displaySchedules = displaySchedules.map((schedule) =>
			schedule.id === id ? { ...schedule, expanded: !schedule.expanded } : schedule,
		);
	}

	// Toggle day selection
	function toggleDay(schedule_org: DisplaySchedule, day: number) {
		let schedule_org_conv = convertDisplayDataToScheduleData([schedule_org])[0];
		displaySchedules = displaySchedules.map((schedule) => {
			if (schedule.id === schedule_org.id) {
				const days = schedule.days.includes(day)
					? schedule.days.filter((d) => d !== day)
					: [...schedule.days, day].sort((a, b) => a - b);
				return { ...schedule, days };
			}
			return schedule;
		});
		// Find the updated schedule
		let updatedSchedule = displaySchedules.find((s) => s.id === schedule_org.id);
		if (updatedSchedule) {
			let schedule_new_conv = convertDisplayDataToScheduleData([updatedSchedule])[0];
			managedChargers.selectedCharger?.updateAlwaysOnSchedule(schedule_new_conv, schedule_org_conv);
		}
	}

	// Update time
	function updateTime(schedule_org: DisplaySchedule, timeType: "start" | "end", value: string) {
		let schedule_org_conv = convertDisplayDataToScheduleData([schedule_org])[0];
		displaySchedules = displaySchedules.map((schedule) => {
			if (schedule.id === schedule_org.id) {
				if (timeType === "start") {
					return { ...schedule, startTime: value };
				} else {
					return { ...schedule, endTime: value };
				}
			}
			return schedule;
		});

		// Find the updated schedule
		let updatedSchedule = displaySchedules.find((s) => s.id === schedule_org.id);
		if (updatedSchedule) {
			let schedule_new_conv = convertDisplayDataToScheduleData([updatedSchedule])[0];
			managedChargers.selectedCharger?.updateAlwaysOnSchedule(schedule_new_conv, schedule_org_conv);
		}
	}

	// Format days for display
	function formatDaysDisplay(days: number[]): string {
		if (days.length === 0) return "No days";
		if (days.length === 7) return "Every day";

		// Check for weekdays (0 - 4)
		const weekdays = [0, 1, 2, 3, 4];
		const isWeekdays = weekdays.every((day) => days.includes(day)) && days.length === 5;
		if (isWeekdays) return "Weekdays";

		// Check for weekend (5 - 6)
		const weekend = [5, 6];
		const isWeekend = weekend.every((day) => days.includes(day)) && days.length === 2;
		if (isWeekend) return "Weekend";

		// Otherwise, show abbreviated day names
		return days.map((day) => dayAbbreviations[day]).join(", ");
	}

	// Validate time range
	function isValidTimeRange(startTime: string, endTime: string): boolean {
		const start = timeStringToMinutes(startTime);
		const end = timeStringToMinutes(endTime);
		return end > start;
	}

	// Check for schedule conflicts
	function hasConflicts(scheduleId: string, days: number[], startTime: string, endTime: string): boolean {
		const start = timeStringToMinutes(startTime);
		const end = timeStringToMinutes(endTime);

		return displaySchedules.some((schedule) => {
			if (schedule.id === scheduleId) return false;

			const otherStart = timeStringToMinutes(schedule.startTime);
			const otherEnd = timeStringToMinutes(schedule.endTime);

			// Check if any days overlap
			const daysOverlap = days.some((day) => schedule.days.includes(day));
			if (!daysOverlap) return false;

			// Check if times overlap
			return start < otherEnd && end > otherStart;
		});
	}
</script>

<Subpage title="Always On" backURL="/menu/chargers/settings">
	<p>
		Set specific time periods when your charger is open and doesn't require being unlocked. You can create multiple
		schedules for different days and different time intervals.
	</p>

	<!-- Schedule List -->
	<div class="flex flex-col gap-3">
		{#each displaySchedules as schedule (schedule.id)}
			<div class="border border-lk-blue-800 rounded-2xl overflow-hidden">
				<!-- Schedule Header -->
				<button
					class="w-full p-4 flex items-center justify-between"
					onclick={() => toggleSchedule(schedule.id)}
				>
					<div class="flex flex-col items-start gap-1">
						<div class="flex gap-2">
							<span class="font-bold text-left text-lk-blue-50">
								{formatDaysDisplay(schedule.days)}
							</span>
						</div>
						<span class="text-sm text-lk-blue-300">
							{schedule.startTime} - {schedule.endTime}
						</span>
					</div>
					<div class="flex items-center gap-2">
						{#if schedule.days.length === 0 || !isValidTimeRange(schedule.startTime, schedule.endTime) || hasConflicts(schedule.id, schedule.days, schedule.startTime, schedule.endTime)}
							<AlertCircle class="text-lk-red-500 text-lg" />
						{/if}

						{#if schedule.expanded}
							<ChevronUp class="text-gray-400" />
						{:else}
							<ChevronDown class="text-gray-400" />
						{/if}
					</div>
				</button>

				<!-- Schedule Details -->
				{#if schedule.expanded}
					<div
						class="flex flex-col p-4 border-t border-lk-blue-800 gap-4"
						transition:slide={{ duration: 200 }}
					>
						<!-- Validation Messages -->
						{#if schedule.days.length === 0}
							<div class="p-3 bg-lk-red-100 text-lk-red-700 rounded-2xl flex items-center gap-2">
								<AlertCircle class="flex-shrink-0" />
								<span class="text-sm">Please select at least one day</span>
							</div>
						{/if}

						{#if !isValidTimeRange(schedule.startTime, schedule.endTime)}
							<div class="p-3 bg-lk-red-100 text-lk-red-700 rounded-2xl flex items-center gap-2">
								<AlertCircle class="flex-shrink-0" />
								<span class="text-sm">End time must be after start time</span>
							</div>
						{/if}

						{#if hasConflicts(schedule.id, schedule.days, schedule.startTime, schedule.endTime)}
							<div class="p-3 bg-lk-red-100 text-lk-red-700 rounded-2xl flex items-center gap-2">
								<AlertCircle class="flex-shrink-0" />
								<span class="text-sm">This schedule conflicts with another schedule</span>
							</div>
						{/if}
						<!-- Days Selection -->
						<div>
							<label
								for="days-selection-{schedule.id}"
								class="block text-sm font-medium text-lk-blue-100 mb-3"
							>
								Active Days
							</label>
							<div id="days-selection-{schedule.id}" class="grid grid-cols-7 gap-2">
								{#each dayNames as dayName, index}
									<button
										class="py-2 text-xs text-lk-blue-50 font-medium rounded-xl border transition-colors overflow-hidden {schedule.days.includes(
											index,
										)
											? 'bg-lk-blue-500 border-lk-blue-500'
											: 'border-lk-blue-800'}"
										onclick={() => toggleDay(schedule, index)}
									>
										{dayAbbreviations[index]}
									</button>
								{/each}
							</div>
						</div>

						<!-- Time Selection -->
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label
									for="start-time-{schedule.id}"
									class="block text-sm font-medium text-lk-blue-100 mb-2"
								>
									Start Time
								</label>
								<input
									id="start-time-{schedule.id}"
									type="time"
									class="w-full bg-transparent text-center p-3 border border-lk-blue-800 rounded-2xl focus:border-lk-blue-300 focus:outline-none"
									value={schedule.startTime}
									onchange={(e) =>
										updateTime(schedule, "start", (e.target as HTMLInputElement).value)}
								/>
							</div>
							<div>
								<label
									for="end-time-{schedule.id}"
									class="block text-sm font-medium text-lk-blue-100 mb-2"
								>
									End Time
								</label>
								<input
									id="end-time-{schedule.id}"
									type="time"
									class="w-full bg-transparent text-center p-3 border border-lk-blue-800 rounded-2xl focus:border-lk-blue-300 focus:outline-none"
									value={schedule.endTime}
									onchange={(e) => updateTime(schedule, "end", (e.target as HTMLInputElement).value)}
								/>
							</div>
						</div>

						<button
							class="w-full flex p-4 text-lk-red-400 rounded-2xl justify-center gap-3 items-center text-sm"
							onclick={(e) => {
								e.stopPropagation();
								removeSchedule(schedule);
							}}
							title="Add time slot"
						>
							<Trashcan class="text-lk-red-400" /> Delete Schedule
						</button>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Add New Schedule Button -->
	<button
		class="flex p-6 border border-dashed border-lk-blue-300/60 rounded-2xl justify-center gap-3 items-center text-lk-blue-300/60"
		onclick={addNewSchedule}
		title="Add time slot"
	>
		<PlusClock />Add New Schedule
	</button>
</Subpage>
