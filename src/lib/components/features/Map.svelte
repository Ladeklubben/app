<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import * as L from "leaflet";
	import "leaflet/dist/leaflet.css";
	import { type Position, type PermissionStatus, Geolocation } from "@capacitor/geolocation";
	import { device, Platform } from "$lib/services/layout";

	// Props
	let { isSatellite = false } = $props();

	let mapContainer: HTMLDivElement;
	let map: L.Map | undefined;
	let pos: Position | undefined = $state();
	let userMarker: L.Marker | undefined; // Track the marker to update it later

	// Define a custom icon for a "live location" look
	const liveLocationIcon = L.divIcon({
		html: `
			<div style="
				background-color: #00A3FF;
				width: 16px;
				height: 16px;
				border-radius: 50%;
				border: 2px solid white;
				box-shadow: 0 0 8px rgba(0, 163, 255, 0.6);
			"></div>
		`,
		className: "", // Remove default Leaflet class to avoid conflicts
		iconSize: [16, 16], // Size of the icon
		iconAnchor: [8, 8], // Center the icon on the position
	});

	// Initialize and update the map
	$effect(() => {
		if (!mapContainer) return;

		// Set the map center to the user's current position
		if (pos && map) {
			map.setView([pos.coords.latitude, pos.coords.longitude], 16);
			L.marker([pos.coords.latitude, pos.coords.longitude], { icon: liveLocationIcon }).addTo(map);
		}
	});

	let tileServer = isSatellite
		? "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
		: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

	onMount(async () => {
		if ($device !== Platform.Web) {
			Geolocation.requestPermissions().then((status: PermissionStatus) => {
				if (status.location === "granted") {
					Geolocation.getCurrentPosition().then((position: Position) => {
						console.log("Current position:", position);
						pos = position;
					});
				}
			});
		}

		map = L.map(mapContainer, {
			center: [56, 10.5], // Center of Denmark
			zoom: 6,
			zoomControl: true,
		});

		map.attributionControl.setPrefix(""); // Remove default Leaflet attribution
		map.zoomControl.remove(); // Remove default Leaflet zoom control

		// Add dark tile layer from CartoDB
		L.tileLayer(tileServer, { maxZoom: 19 }).addTo(map);
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div bind:this={mapContainer} class="w-full h-100 border border-lk-blue-800 rounded-2xl" style="background-color: #182b34;"></div>
