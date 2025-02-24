<!-- Subpage.svelte -->
<script>
    import { goto } from "$app/navigation"; // SvelteKit navigation (if you're using SvelteKit)

    export let title = ""; // Title for the subpage header

    function goBack() {
        // Navigate back to the previous page
        history.back(); // Simple browser back, or use goto('/') for a specific route
    }
</script>

<div class="subpage">
    <header>
        <button class="back-btn" on:click={goBack}>← Back</button>
        <h1>{title}</h1>
    </header>
    <main>
        <slot />
    </main>
</div>

<style>
    .subpage {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
    header {
        display: flex;
        align-items: center;
        padding: 10px;
        background-color: #f5f5f5;
        border-bottom: 1px solid #ddd;
    }
    .back-btn {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 0 10px;
    }
    h1 {
        margin: 0;
        font-size: 20px;
        flex-grow: 1;
        text-align: center;
    }
    main {
        padding: 20px;
        flex-grow: 1;
    }
</style>
