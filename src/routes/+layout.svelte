<!-- +layout.svelte -->
<script>
    import TabBar from '$lib/TabBar.svelte';
</script>


<div class="layout-container">
    <main>
        <slot />
    </main>
    <TabBar />
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
