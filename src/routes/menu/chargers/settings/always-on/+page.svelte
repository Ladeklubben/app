<script lang="ts">
	import WeekSchedule from "$lib/components/features/charger/WeekSchedule.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
</script>

<Subpage title="Always On" backURL="/menu/chargers/settings">
	<p>
		Set specific time periods when your charger is open and doesn't require being unlocked. You can create multiple
		schedules for different days and different time intervals.
	</p>
	<WeekSchedule></WeekSchedule>
</Subpage>
