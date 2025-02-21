<script lang="ts">
    import PhaseOverview from "$lib/components/features/meter/PhaseOverview.svelte";
    import { getHTTP } from '$lib/api';

    // Fetch data
    const fetchData = async () => {
        try {
            console.log('Fetching data...');
            const data = await getHTTP('/installation/mainmeter_tmp', true);
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