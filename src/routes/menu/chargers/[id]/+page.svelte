<script lang="ts">
	import { page } from "$app/state";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { onMount } from "svelte";
    import { ManagedCharger, ManagedChargersStore } from "$lib/models/ManagedChargers";

	const chargerId = page.params.id;
    let charger: ManagedCharger | undefined = $state();
    const title = $derived(charger?.locationInfo?.brief || "Unnamed")

	onMount(async () => {
		// Simulate loading data
        charger = $ManagedChargersStore.getCharger(chargerId);
		
	});
</script>

<Subpage title={title} backURL="/menu/chargers">{charger}</Subpage>
