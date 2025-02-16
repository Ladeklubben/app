<script>
    import PhaseOverview from "$lib/PhaseOverview.svelte";
    import { invoke } from '@tauri-apps/api/core';

    

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