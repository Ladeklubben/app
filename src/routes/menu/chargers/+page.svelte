<script lang="ts">
	import { get, post, put, del } from "$lib/services/api";
	import { ManagedChargers } from "$lib/models/ManagedCharger";
	import { onMount } from "svelte";

	onMount((async () => {
	    const managedChargers = new ManagedChargers();

		// Initialize with chargers from the server
		await managedChargers.initializeChargers();

		// Load all data for all chargers
		await managedChargers.loadAllChargersData();

		// Get a specific charger
		const charger = managedChargers.getCharger('2754636038');
		console.log(charger);
	}));

	const ID = "2754636038";

    function API_tester(endpoint: string) {
        get(endpoint).then((response) => {
            console.log(`/cp/${ID}/${endpoint}: `, response.timestamps[99]);
        });
    }

    // API_tester(`/ta/${ID}/plot`);

</script>
