<script lang="ts">
    import PhaseOverview from "$lib/components/features/meter/PhaseOverview.svelte";
    import SingleStatCard from "$lib/components/ui/SingleStatCard.svelte";
    import { onMount } from "svelte";
    import { fetchpowerImport, powerImport, lastFetch } from "$lib/services/meter";

    onMount(() => {
        fetchpowerImport();
    });
</script>

<div class="wrapper">
    <SingleStatCard description="Live Usage - {$lastFetch}" stat={$powerImport} unit="W" />
    <PhaseOverview />
    
</div>