<!-- +layout.svelte -->
<script>
    import TabBar from '$lib/TabBar.svelte';
    import { page } from '$app/stores';
</script>


<div class="layout-container">
    <main>
        <slot />
    </main>
    {#if $page.url.pathname !== '/login'}
        <TabBar />
    {/if}
</div>

<style>
    .layout-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        /* Add padding-bottom to prevent content from being hidden behind tabbar */
        padding-bottom: 60px; /* Adjust based on your tabbar height */
    }
</style>
