<script lang="ts">
	import InteractiveMap from "$lib/components/features/map/InteractiveMap.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
</script>

<Subpage title="Location" backURL="/menu/chargers/settings">
	<div class="h-100 w-full rounded-2xl overflow-auto">
        <InteractiveMap tileServer={"satellite"} />
    </div>
</Subpage>
