<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { MAP_TOKENS, tileServer } from "$lib/services/map";
	import * as L from "leaflet";
	import "leaflet/dist/leaflet.css";

	// Props for customization
	let {
		defaultCenter = [56, 10.5] as L.LatLngTuple,
		defaultZoom = 6,
		maxZoom = 20,
		onMapClick = undefined as ((e: L.LeafletMouseEvent) => void) | undefined,
		onMapInit = undefined as ((map: L.Map) => void) | undefined,
	} = $props<{
		defaultCenter?: L.LatLngTuple;
		defaultZoom?: number;
		maxZoom?: number;
		onMapClick?: (e: L.LeafletMouseEvent) => void;
		onMapInit?: (map: L.Map) => void;
	}>();

	// Reactive variables
	let mapContainer: HTMLDivElement | undefined;
	let map: L.Map | undefined;
	let currentTileLayer: L.TileLayer | undefined;

	// Tile servers
	const TILE_SERVERS = {
		light: `https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=${$MAP_TOKENS.JAWG}`,
		dark: `https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${$MAP_TOKENS.JAWG}`,
		satellite: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg",
	};

	// Initialize map
	function initializeMap() {
		if (!mapContainer) return;

		try {
			map = L.map(mapContainer, {
				zoomControl: false,
				attributionControl: false,
				minZoom: 3,
			}).setView(defaultCenter, defaultZoom);

			// Initial tile layer added through updateTileLayer
			updateTileLayer();

			// Attach click handler if provided
			if (onMapClick) {
				map.on("click", onMapClick);
			}

			// Notify parent of map initialization
			if (onMapInit && map) {
				onMapInit(map);
			}
		} catch (error) {
			console.error("Failed to initialize map:", error);
		}
	}

	// Function to update the tile layer
	function updateTileLayer() {
		if (!map) return;

		// Remove the current tile layer if it exists
		if (currentTileLayer) {
			map.removeLayer(currentTileLayer);
		}

		// Add the new tile layer based on current tileserver value
		const key = ($tileServer ?? "light") as keyof typeof TILE_SERVERS;
		currentTileLayer = L.tileLayer(TILE_SERVERS[key], {
			maxZoom,
		}).addTo(map);
	}

	$effect(() => {
		if ($tileServer !== undefined) {
			updateTileLayer();
		}
	});

	// Lifecycle hooks
	onMount(() => {
		initializeMap();
	});

	onDestroy(() => {
		if (map) {
			if (onMapClick) {
				map.off("click", onMapClick);
			}
			map.remove();
			map = undefined;
		}
	});
</script>

<div bind:this={mapContainer} class="w-full h-full" style="background-color: #191a1a;"></div>
