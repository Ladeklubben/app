<script lang="ts">
    import PhaseOverview from "$lib/components/features/meter/PhaseOverview.svelte";
    import SingleStatCard from "$lib/components/ui/SingleStatCard.svelte";
    import { onMount } from "svelte";
    import { fetchEnergyImport, energyImport } from "$lib/services/meter";

    onMount(() => {
        fetchEnergyImport();
    });
</script>

<div class="wrapper">
    <SingleStatCard description="Live Usage" stat={$energyImport} unit="W" />
    <PhaseOverview />
    
</div>