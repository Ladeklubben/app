<script lang="ts">
	import InteractiveMap from "$lib/components/features/map/InteractiveMap.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
    import { chargers } from "$lib/classes/Chargers.svelte";
    import type { LocationInfo } from "$lib/types/publicCharger.types";

	let address: AddressFromCoords | undefined = $state(undefined);
	let locationInfo: LocationInfo | undefined = $state(undefined);

	function onLocationFound(newAddress: AddressFromCoords) {
		address = newAddress;
        locationInfo = {
            brief : "Charger", // TODO: Consider making this editable
            address: newAddress.road + " " + newAddress.house_number,
            city: newAddress.city,
            zip: newAddress.postcode,
            latitude: newAddress.lat,
            longitude: newAddress.lon,
        }
        chargers.selected?.putLocationInfo(locationInfo);
	}
</script>

<Subpage title="Location" backURL="/menu/chargers/settings">
	<p>Click on the map to mark your charger's exact location. The address will be automatically calculated.</p>

	<div class="h-100 w-full rounded-2xl overflow-auto">
		<InteractiveMap tileServer={"dark"} {onLocationFound} />
	</div>

	{#if locationInfo}
		<div class="flex flex-col gap-2">
			<p>
				<strong>Address: </strong>
				{locationInfo.address}
			</p>
			<p>
				<strong>City: </strong>
				{locationInfo.city}
			</p>
			<p>
				<strong>Postcode: </strong>
				{locationInfo.zip}
			</p>
		</div>
	{/if}
    <!-- TODO: Consider if users should be able to modify the address manually. -->
</Subpage>
