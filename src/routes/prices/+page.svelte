<script lang="ts">
    import { onMount } from 'svelte';
    import { prices, isLoading, error, fetchPrices } from '$lib/stores/prices';

    onMount(() => {
        fetchPrices();
    });
</script>

<h1>Prices</h1>

{#if $isLoading}
    <p>Loading...</p>
{:else if $error}
    <p>Error: {$error}</p>
{:else}
    <ul>
        {#each $prices as price}
            <li>{price.Timestamp}: {price.Costprice_VAT}</li>
        {/each}
    </ul>
{/if}

<style>
    h1 {
        color: var(--lk-blue-100);
    }
</style>