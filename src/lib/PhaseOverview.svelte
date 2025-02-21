<!-- PhaseOverview.svelte -->
<script>
    import PhaseBar from "$lib/PhaseBar.svelte";
    import Card from "$lib/Card.svelte";

    const phases = [
        { label: "L1", percentage: 85 },
        { label: "L2", percentage: 25 },
        { label: "L3", percentage: 95 },
    ];
</script>

<Card title="Fase Oversigt">
    {#each phases as phase}
        <PhaseBar label={phase.label} percentage={phase.percentage} />
    {/each}
</Card>