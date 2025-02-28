<!-- PhaseOverview.svelte -->
<script lang="ts">
    import PhaseBar from "$lib/components/features/meter/PhaseBar.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import { meterData } from "$lib/services/meter";

    let phases: any = [];

    $: if ($meterData) {
        phases = [
            {
                label: "L1",
                percentage: Math.floor(($meterData.current[0] / 16) * 100),
            },
            {
                label: "L2",
                percentage: Math.floor(($meterData.current[1] / 16) * 100),
            },
            {
                label: "L3",
                percentage: Math.floor(($meterData.current[2] / 16) * 100),
            },
        ];
    }
</script>

<Card title="Phases">
    {#each phases as phase}
        <PhaseBar label={phase.label} percentage={phase.percentage} />
    {/each}
</Card>
