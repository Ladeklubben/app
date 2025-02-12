<!-- +layout.svelte -->
<script>
    import NavBar from '$lib/NavBar.svelte';
</script>


<div class="layout-container">
    <main>
        <slot />
    </main>
    <NavBar />
</div>

<style>
    .layout-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        /* Add padding-bottom to prevent content from being hidden behind navbar */
        padding-bottom: 60px; /* Adjust based on your navbar height */
    }
</style>
