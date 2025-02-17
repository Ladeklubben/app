<script lang="ts">
    import { onMount } from "svelte";
    import { isLoading, error, fetchPrices } from "$lib/stores/prices";
    import PriceChart from "$lib/PriceChart.svelte";

    onMount(() => {
        fetchPrices();
    });
</script>

<div class="chart-container">
    {#if $isLoading}
        <p>Loading...</p>
    {:else if $error}
        <p>Error: {$error}</p>
    {:else}
        <PriceChart />
    {/if}
</div>

<style>
    .chart-container {
        position: relative;
        height: 500px;
        width: 100%;
    }
</style>