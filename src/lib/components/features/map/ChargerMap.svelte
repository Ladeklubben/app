<script lang="ts">
    import * as L from "leaflet";
    import BaseMap from "./BaseMap.svelte";
    import { onDestroy } from "svelte";
    import type { ChargerStation } from "$lib/types/chargers";
    import "leaflet.markercluster/dist/leaflet.markercluster.js";
    import "leaflet.markercluster/dist/MarkerCluster.css";
    import "leaflet.markercluster/dist/MarkerCluster.Default.css";

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
    let markerClusterGroup: L.MarkerClusterGroup | undefined;

    // Charger icon
    const chargerIcon = L.icon({
        iconUrl: "/LK_waypoint.svg",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
    });

    // Initialize map and add charger markers
    function handleMapInit(initializedMap: L.Map) {
        map = initializedMap;
        
        // Initialize the marker cluster group
        markerClusterGroup = L.markerClusterGroup({
            maxClusterRadius: 50,
            disableClusteringAtZoom: 19, // Optional: disable clustering at high zoom levels
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
        });
        
        map.addLayer(markerClusterGroup);
        updateMarkers();
    }

    // Function to update markers based on current chargers data
    function updateMarkers() {
        if (!map || !markerClusterGroup) return;
        
        // Clear existing markers
        markerClusterGroup.clearLayers();
        
        // Add new markers to the cluster group
        chargers.forEach((charger: ChargerStation) => {
            const marker = L.marker([charger.location.latitude, charger.location.longitude], { icon: chargerIcon })
                .bindPopup(charger.stationid);
            markerClusterGroup!.addLayer(marker);
        });
    }

    // Reactive statement to update markers when chargers change
    $effect(() => {
        if (map && markerClusterGroup && chargers) {
            updateMarkers();
        }
    });

    onDestroy(() => {
        if (map && markerClusterGroup) {
            map.removeLayer(markerClusterGroup);
        }
    });
</script>

<BaseMap
    {isSatellite}
    defaultZoom={6}
    onMapInit={handleMapInit}
/>