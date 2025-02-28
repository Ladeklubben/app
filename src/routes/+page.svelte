<script lang="ts">
    import PhaseOverview from "$lib/components/features/meter/PhaseOverview.svelte";
    import SingleStatCard from "$lib/components/ui/SingleStatCard.svelte";
    import { onMount } from "svelte";
    import { fetchpowerImport, meterData, lastFetch } from "$lib/services/meter";

    onMount(() => {
        fetchpowerImport();
    });

    const formatter = new Intl.NumberFormat('en-DK');
    let total_power_import = "";
    $: if ($meterData) {
        total_power_import = formatter.format($meterData.totals.total_power_import * 1000);
    }
</script>

<div class="wrapper">
    <SingleStatCard description="Live Usage - {$lastFetch}" stat={total_power_import} unit="W" />
    <PhaseOverview />
</div>