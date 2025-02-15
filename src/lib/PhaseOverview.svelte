<!-- PhaseOverview.svelte -->
<script>
    import PhaseBar from "$lib/PhaseBar.svelte";

    const phases = [
        { label: "L1", percentage: 85 },
        { label: "L2", percentage: 25 },
        { label: "L3", percentage: 95 },
    ];
</script>

<div class="container">
    <h1>Fase oversigt</h1>
    {#each phases as phase}
        <PhaseBar label={phase.label} percentage={phase.percentage} />
    {/each}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        border-radius: 1.5rem;
        border: 1px solid var(--lk-blue-800);
        max-width: 600px;
    }

    h1 {
        color: var(--lk-blue-100);
        font-size: 1.5rem;
        margin: 0;
    }
</style>
