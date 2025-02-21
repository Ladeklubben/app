<script lang="ts">
    import PhaseOverview from "$lib/components/features/meter/PhaseOverview.svelte";
    import { get } from '$lib/services/api';

    // Fetch data
    const fetchData = async () => {
        try {
            const data = await get('/installation/mainmeter_tmp', true);
            console.log('Data fetched:', data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
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