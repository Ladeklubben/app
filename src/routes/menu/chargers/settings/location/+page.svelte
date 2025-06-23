<script lang="ts">
	import InteractiveMap from "$lib/components/features/map/InteractiveMap.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";

	let address: AddressFromCoords | undefined = $state(undefined);

	function onLocationFound(newAddress: AddressFromCoords) {
		address = newAddress;
        console.log("Address found:", newAddress);
	}
</script>

<Subpage title="Location" backURL="/menu/chargers/settings">
	<p>Click on the map to mark your charger's exact location. The address will be automatically calculated.</p>

	<div class="h-100 w-full rounded-2xl overflow-auto">
		<InteractiveMap tileServer={"satellite"} {onLocationFound} />
	</div>

	{#if address}
		<div class="flex flex-col gap-2">
			<p>
				<strong>Address: </strong>
				{address.road}
				{address.house_number}
			</p>
			<p>
				<strong>City: </strong>
				{address.town}
			</p>
			<p>
				<strong>Postcode: </strong>
				{address.postcode}
			</p>
			<p>
				<strong>Country: </strong>
				{address.country}
			</p>
		</div>
	{/if}
    <!-- TODO: Consider if users should be able to modify the address manually. -->
</Subpage>
