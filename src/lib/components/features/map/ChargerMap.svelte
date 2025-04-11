<script lang="ts">
    import * as L from "leaflet";
    import BaseMap from "./BaseMap.svelte";
    import { onDestroy } from "svelte";
    import type { ChargerStation } from "$lib/types/chargers";

    // Props
    let {
        isSatellite = false,
        chargers = [] as ChargerStation[],
    } = $props<{
        isSatellite?: boolean;
        chargers?: ChargerStation[];
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
        updateMarkers();
    }

    // Function to update markers based on current chargers data
    function updateMarkers() {
        if (!map) return;
        
        // Remove existing markers
        chargerMarkers.forEach((marker) => marker.remove());
        chargerMarkers = [];
        
        // Add new markers
        chargerMarkers = chargers.map((charger: ChargerStation) => {
            const marker = L.marker([charger.location.latitude, charger.location.longitude], { icon: chargerIcon })
                .addTo(map!)
                .bindPopup(charger.stationid);
            return marker;
        });
    }

    // Reactive statement to update markers when chargers change
    $effect(() => {
        if (map && chargers) {
            updateMarkers();
        }
    });

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