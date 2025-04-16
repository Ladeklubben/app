<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import * as L from "leaflet";
	import BaseMap from "./BaseMap.svelte";
	import { pos, getPosition } from "$lib/services/map";
	import type { Position } from "@capacitor/geolocation";

	// Props
	let { isDark = false } = $props<{
		isDark?: boolean;
	}>();

	// Reactive variables
	let map: L.Map | undefined;
	let userMarker: L.Marker | undefined;
	let clickMarker: L.Marker | undefined;

	// Constants
	const DEFAULT_ZOOM = 18;

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
		iconUrl: "/LK_waypoint_green.svg",
		iconSize: [48, 48],
		iconAnchor: [24, 48],
	});

	// Update user position
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

	// Initialize map
	function handleMapInit(initializedMap: L.Map) {
		map = initializedMap;
	}

	// Lifecycle hooks
	onMount(() => {
		// Subscribe to position changes
		const unsubscribe = pos.subscribe((newPosition) => {
			updateMapPosition(newPosition);
		});

		// Kick off position retrieval
		getPosition();

		return () => {
			unsubscribe();
			if (clickMarker) {
				clickMarker.remove();
			}
			if (userMarker) {
				userMarker.remove();
			}
		};
	});
</script>

<BaseMap {isDark} defaultZoom={6} onMapClick={handleMapClick} onMapInit={handleMapInit} />
