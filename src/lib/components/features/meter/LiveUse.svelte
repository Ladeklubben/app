<script lang="ts">
    import { get } from '$lib/services/api';
    import { onMount } from 'svelte';

    let totalEnergyImport = 0;

    onMount(async () => {
        try {
            const response = await get('/installation/mainmeter_tmp', true);
            totalEnergyImport = Math.round(response.total_energy_import);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });
</script>

<div class="wrapper">
    Live Usage

    <h2>{totalEnergyImport}<span>W</span></h2>
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 32px;
        align-items: center;
        border-radius: 1.5rem;
        border: 1px solid var(--lk-blue-800);
        background: linear-gradient(to right, var(--lk-blue-400), var(--lk-blue-800));
    }

    h2 {
        font-size: 4rem;
        font-weight: bold;
        color: var(--lk-blue-100);
        margin: 0;
        margin-bottom: -10px;
    }

    span {
        font-size: 1rem;
        font-weight: normal;
    }
</style>