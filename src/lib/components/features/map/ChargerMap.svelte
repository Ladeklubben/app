<script lang="ts">
	import * as L from "leaflet";
	import BaseMap from "./BaseMap.svelte";
    import { onDestroy } from "svelte";

	// Props
	let {
		isSatellite = false,
		chargers = [] as { lat: number; lng: number; name: string }[],
	} = $props<{
		isSatellite?: boolean;
		chargers?: { lat: number; lng: number; name: string }[];
	}>();

	// Reactive variables
	let map: L.Map | undefined;
	let chargerMarkers: L.Marker[] = [];

	// Charger icon
    const chargerIcon = L.icon({
		iconUrl: "/LK_waypoint.svg",
		iconSize: [48, 48],
		iconAnchor: [24, 48],
	});

	// Initialize map and add charger markers
	function handleMapInit(initializedMap: L.Map) {
		map = initializedMap;

		// Add charger markers
		chargerMarkers = chargers.map((charger) => {
			const marker = L.marker([charger.lat, charger.lng], { icon: chargerIcon })
				.addTo(map)
				.bindPopup(charger.name);
			return marker;
		});

		// Fit map to show all chargers if any exist
		if (chargers.length > 0) {
			const bounds = L.latLngBounds(chargers.map((c) => [c.lat, c.lng]));
			map.fitBounds(bounds, { padding: [50, 50] });
		}
	}

	// Cleanup on unmount
	function cleanup() {
		chargerMarkers.forEach((marker) => marker.remove());
		chargerMarkers = [];
	}

    onDestroy(() => {
        chargerMarkers.forEach((marker) => marker.remove());
		chargerMarkers = [];
    });
</script>

<BaseMap
	{isSatellite}
	defaultZoom={6}
	onMapInit={handleMapInit}
/>