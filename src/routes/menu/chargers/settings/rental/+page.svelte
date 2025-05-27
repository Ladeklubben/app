<script lang="ts">
	import WeekSchedule from "$lib/components/features/charger/WeekSchedule.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
</script>

<Subpage title="Rental" backURL="/menu/chargers/settings">
	<p>
		Make money by renting out your charger. Set your available time periods for different days, and you'll
		automatically earn money based on how much other members use it.
	</p>
	<WeekSchedule></WeekSchedule>
</Subpage>
