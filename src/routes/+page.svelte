<script lang="ts">
    import PhaseOverview from "$lib/components/features/meter/PhaseOverview.svelte";
    import SingleStatCard from "$lib/components/ui/SingleStatCard.svelte";
    import { onMount } from "svelte";
    import { fetchpowerImport, powerImport } from "$lib/services/meter";

    onMount(() => {
        fetchpowerImport();
    });
</script>

<div class="wrapper">
    <SingleStatCard description="Live Usage" stat={$powerImport} unit="W" />
    <PhaseOverview />
    
</div>