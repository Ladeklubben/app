<script lang="ts">
    import { onMount } from "svelte";
    import { isLoading, error, fetchPrices } from "$lib/stores/prices";
    import Card from "$lib/Card.svelte";
    import PriceChart from "$lib/PriceChart.svelte";

    onMount(() => {
        fetchPrices();
    });
</script>

<div class="container">
    {#if $isLoading}
        <p>Loading...</p>
    {:else if $error}
        <p>Error: {$error}</p>
    {:else}
        <Card title="Prices">
            Cost price with VAT
            <PriceChart />
        </Card>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }
</style>
