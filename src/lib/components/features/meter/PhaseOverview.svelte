<!-- PhaseOverview.svelte -->
<script>
    import PhaseBar from "$lib/components/features/meter/PhaseBar.svelte";
    import Card from "$lib/components/ui/Card.svelte";

    const phases = [
        { label: "L1", percentage: 85 },
        { label: "L2", percentage: 25 },
        { label: "L3", percentage: 95 },
    ];
</script>

<Card title="Phases">
    {#each phases as phase}
        <PhaseBar label={phase.label} percentage={phase.percentage} />
    {/each}
</Card>