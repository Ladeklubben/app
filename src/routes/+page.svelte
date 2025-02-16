<script>
    import PhaseOverview from "$lib/PhaseOverview.svelte";
    import { onMount } from "svelte";
    import { login } from "$lib/stores/auth";
</script>

<div class="container">
    <PhaseOverview />
</div>


<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }
</style>