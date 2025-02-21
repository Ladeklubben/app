<script lang="ts">
    import PhaseOverview from "$lib/components/features/meter/PhaseOverview.svelte";
    import LiveUse from "$lib/components/features/meter/LiveUse.svelte";
</script>

<div class="wrapper">
    <LiveUse />
    <PhaseOverview />
    
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }
</style>