<script lang="ts">
	import { chargers } from "$lib/classes/Chargers.svelte";
	import type { SingleSchedule } from "$lib/types/charger.types";
	import Trashcan from "~icons/mdi/trash-can-outline";
	import PlusClock from "~icons/mdi/clock-plus-outline";
	import ChevronDown from "~icons/mdi/chevron-down";
	import ChevronUp from "~icons/mdi/chevron-up";
	import AlertCircle from "~icons/mdi/alert-circle-outline";
	import CryptoJS from "crypto-js";
	import { slide } from "svelte/transition";
	import type { DisplaySchedule } from "$lib/types/charger.types";
	import { Charger } from "$lib/classes/Charger.svelte";

	// Component Props
	let { scheduleType }: { scheduleType: "alwayson" | "openhours" } = $props();

	// Day names for display
	const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	const dayAbbreviations = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	// Initialize display data from the appropriate schedule based on the scheduleType
	let displaySchedules: DisplaySchedule[] = $state(
		scheduleType === "alwayson"
			? Charger.convertScheduleDataToDisplayData(chargers.selected?.alwaysOnSchedule || [])
			: Charger.convertScheduleDataToDisplayData(chargers.selected?.rentalSchedule || []),
	);

	// Check if a schedule is valid (no conflicts and valid time range)
	function isScheduleValid(schedule: DisplaySchedule): boolean {
		return (
			schedule.days.length > 0 &&
			Charger.isValidTimeRange(schedule.startTime, schedule.endTime) &&
			!Charger.hasConflicts(schedule.id, schedule.days, schedule.startTime, schedule.endTime, displaySchedules)
		);
	}

	// Sync schedule with server (add or update as needed)
	async function syncScheduleWithServer(schedule: DisplaySchedule, originalScheduleData?: SingleSchedule) {
		if (!isScheduleValid(schedule)) {
			return; // Don't sync invalid schedules
		}

		const scheduleData = Charger.convertDisplayDataToScheduleData([schedule])[0];

		try {
			if (schedule.savedToServer && originalScheduleData) {
				// Update existing schedule
				console.log("Updating schedule:", scheduleData);
				scheduleType === "alwayson"
					? await chargers.selected?.updateAlwaysOnSchedule(scheduleData, originalScheduleData)
					: await chargers.selected?.updateRentalSchedule(scheduleData, originalScheduleData);
			} else {
				// Add new schedule
				scheduleType === "alwayson"
					? await chargers.selected?.addAlwaysOnSchedule(scheduleData)
					: await chargers.selected?.addRentalSchedule(scheduleData);
				// Mark as saved to server
				displaySchedules = displaySchedules.map((s) =>
					s.id === schedule.id ? { ...s, savedToServer: true } : s,
				);
			}
		} catch (error) {
			console.error("Failed to sync schedule with server:", error);
			// Optionally show user feedback about the error
		}
	}

	// Add new schedule
	function addNewSchedule() {
		const newSchedule: DisplaySchedule = {
			id: CryptoJS.MD5(Date.now().toString()).toString(),
			days: [0], // Default to Monday
			startTime: "18:00",
			endTime: "23:59",
			expanded: true,
			savedToServer: false, // New schedule not saved to server yet
		};
		displaySchedules = [...displaySchedules, newSchedule];

		// Try to sync with server if valid
		syncScheduleWithServer(newSchedule);
	}

	// Remove schedule
	async function removeSchedule(schedule: DisplaySchedule) {
		// Remove from display
		displaySchedules = displaySchedules.filter((s) => s.id !== schedule.id);
		const newScheduleData = Charger.convertDisplayDataToScheduleData(displaySchedules);

		// Update the selected charger's schedule
		if (chargers.selected) {
			if (scheduleType === "alwayson") {
				chargers.selected.alwaysOnSchedule = newScheduleData;
			} else {
				chargers.selected.rentalSchedule = newScheduleData;
			}
		}

		// Only try to remove from server if it was saved there
		if (schedule.savedToServer) {
			try {
				let scheduleToRemove = Charger.convertDisplayDataToScheduleData([schedule])[0];
				scheduleType === "alwayson"
					? await chargers.selected?.deleteAlwaysOnSchedule(scheduleToRemove)
					: await chargers.selected?.deleteRentalSchedule(scheduleToRemove);
			} catch (error) {
				console.error("Failed to remove schedule from server:", error);
			}
		}
	}

	// Toggle schedule expansion
	function toggleSchedule(id: string) {
		displaySchedules = displaySchedules.map((schedule) =>
			schedule.id === id ? { ...schedule, expanded: !schedule.expanded } : schedule,
		);
	}

	// Toggle day selection
	async function toggleDay(schedule_org: DisplaySchedule, day: number) {
		const originalScheduleData = Charger.convertDisplayDataToScheduleData([schedule_org])[0];

		displaySchedules = displaySchedules.map((schedule) => {
			if (schedule.id === schedule_org.id) {
				const days = schedule.days.includes(day)
					? schedule.days.filter((d) => d !== day)
					: [...schedule.days, day].sort((a, b) => a - b);
				return { ...schedule, days };
			}
			return schedule;
		});

		// Find the updated schedule and sync with server
		let updatedSchedule = displaySchedules.find((s) => s.id === schedule_org.id);
		if (updatedSchedule) {
			await syncScheduleWithServer(updatedSchedule, originalScheduleData);
		}
	}

	// Update time
	async function updateTime(schedule_org: DisplaySchedule, timeType: "start" | "end", value: string) {
		const originalScheduleData = Charger.convertDisplayDataToScheduleData([schedule_org])[0];

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

		// Find the updated schedule and sync with server
		let updatedSchedule = displaySchedules.find((s) => s.id === schedule_org.id);
		if (updatedSchedule) {
			await syncScheduleWithServer(updatedSchedule, originalScheduleData);
		}
	}
</script>

<!-- Schedule List -->
<div class="flex flex-col gap-5">
	{#each displaySchedules as schedule (schedule.id)}
		<div class="border border-lk-blue-800 rounded-2xl overflow-hidden">
			<!-- Schedule Header -->
			<button class="w-full p-4 flex items-center justify-between" onclick={() => toggleSchedule(schedule.id)}>
				<div class="flex flex-col items-start gap-1">
					<div class="flex gap-2">
						<span class="font-bold text-left text-lk-blue-50">
							{Charger.formatDaysDisplay(schedule.days)}
						</span>
						{#if !schedule.savedToServer}
							<span class="text-xs bg-lk-yellow-500 text-lk-yellow-900 px-2 py-1 rounded-full">
								Unsaved
							</span>
						{/if}
					</div>
					<span class="text-sm text-lk-blue-300">
						{schedule.startTime} - {schedule.endTime}
					</span>
				</div>
				<div class="flex items-center gap-2">
					{#if schedule.days.length === 0 || !Charger.isValidTimeRange(schedule.startTime, schedule.endTime) || Charger.hasConflicts(schedule.id, schedule.days, schedule.startTime, schedule.endTime, displaySchedules)}
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
				<div class="flex flex-col p-4 border-t border-lk-blue-800 gap-4" transition:slide={{ duration: 200 }}>
					<!-- Validation Messages -->
					{#if schedule.days.length === 0}
						<div class="p-3 bg-lk-red-100 text-lk-red-700 rounded-2xl flex items-center gap-2">
							<AlertCircle class="flex-shrink-0" />
							<span class="text-sm">Please select at least one day</span>
						</div>
					{/if}

					{#if !Charger.isValidTimeRange(schedule.startTime, schedule.endTime)}
						<div class="p-3 bg-lk-red-100 text-lk-red-700 rounded-2xl flex items-center gap-2">
							<AlertCircle class="flex-shrink-0" />
							<span class="text-sm">End time must be after start time</span>
						</div>
					{/if}

					{#if Charger.hasConflicts(schedule.id, schedule.days, schedule.startTime, schedule.endTime, displaySchedules)}
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
								onchange={(e) => updateTime(schedule, "start", (e.target as HTMLInputElement).value)}
							/>
						</div>
						<div>
							<label for="end-time-{schedule.id}" class="block text-sm font-medium text-lk-blue-100 mb-2">
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
	<!-- Add New Schedule Button -->
	<button
		class="flex p-6 border border-dashed border-lk-blue-300/60 rounded-2xl justify-center gap-3 items-center text-lk-blue-300/60"
		onclick={addNewSchedule}
		title="Add time slot"
	>
		<PlusClock />Add New Schedule
	</button>
</div>
