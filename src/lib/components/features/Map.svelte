<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import * as L from "leaflet";
	import "leaflet/dist/leaflet.css";
	import { type Position } from "@capacitor/geolocation";
	import { pos, getPosition } from "$lib/services/map";

	// Props
	let { isSatellite = false, height = 300 } = $props<{
		isSatellite?: boolean;
		height?: number;
	}>();

	// Reactive variables
	let mapContainer: HTMLDivElement | undefined;
	let map: L.Map | undefined;
	let userMarker: L.Marker | undefined;
	let clickMarker: L.Marker | undefined;

	// Constants
	const DEFAULT_ZOOM = 18;
	const MAX_ZOOM = 20;
	const TILE_SERVERS = {
		satellite: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg",
		dark: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
	};

	// Custom icons
	const liveLocationIcon = L.divIcon({
		html: `
		<div style="
		  background-color: #59a6b7;
		  width: 16px;
		  height: 16px;
		  border-radius: 50%;
		  border: 2px solid white;
		  box-shadow: 0 0 8px #59a6b799;
		"></div>
	  `,
		className: "",
		iconSize: [16, 16],
		iconAnchor: [8, 8],
	});

	const clickLocationIcon = L.icon({
		iconUrl: "/LK_waypoint.svg",
		iconSize: [48, 48],
		iconAnchor: [24, 48]
	});

	// Function to update map position
	function updateMapPosition(position: Position | null) {
		if (!map || !position) return;

		const latLng = [position.coords.latitude, position.coords.longitude] as L.LatLngTuple;
		map.setView(latLng, DEFAULT_ZOOM, { animate: true });

		if (userMarker) {
			userMarker.setLatLng(latLng);
		} else {
			userMarker = L.marker(latLng, { icon: liveLocationIcon }).addTo(map);
		}
	}

	// Initialize map
	function initializeMap() {
		if (!mapContainer) return;

		try {
			map = L.map(mapContainer, {
				zoomControl: false,
				attributionControl: false,
			}).setView([56, 10.5], 6); // Default view

			L.tileLayer(TILE_SERVERS[isSatellite ? "satellite" : "dark"], {
				maxZoom: MAX_ZOOM,
			}).addTo(map);

			map.on("click", handleMapClick);
		} catch (error) {
			console.error("Failed to initialize map:", error);
		}
	}

	// Handle map clicks
	function handleMapClick(e: L.LeafletMouseEvent) {
		if (!map) return;

		const { lat, lng } = e.latlng;
		console.log("Clicked coordinates:", { latitude: lat, longitude: lng });

		if (clickMarker) {
			clickMarker.remove();
		}

		clickMarker = L.marker([lat, lng], { icon: clickLocationIcon }).addTo(map);
	}

	// Lifecycle hooks
	onMount(() => {
		initializeMap();

		// Subscribe to position changes
		const unsubscribe = pos.subscribe((newPosition) => {
			updateMapPosition(newPosition);
		});

		// Kick off position retrieval
		getPosition();

		// Cleanup subscription on unmount
		return () => {
			unsubscribe();
		};
	});

	onDestroy(() => {
		if (map) {
			map.off("click", handleMapClick);
			map.remove();
			map = undefined;
		}
		userMarker = undefined;
		clickMarker = undefined;
	});
</script>

<!-- Extra style is needed due to the way Leaflet.js works -->
<div
	bind:this={mapContainer}
	class="w-full border border-lk-blue-800 rounded-2xl"
	style="background-color: #182b34; cursor: pointer; height: {height}px;"
	
></div>