<script>
    import PhaseOverview from "$lib/PhaseOverview.svelte";
    import { invoke } from '@tauri-apps/api/core';

    

</script>

<div class="wrapper">
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