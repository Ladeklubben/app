<script lang="ts">
	import * as L from "leaflet";
	import BaseMap from "./BaseMap.svelte";
	import { onMount } from "svelte";
	import type { ChargerStation } from "$lib/types/charger.types";
	import { pos, getPosition } from "$lib/services/map";
	import { selectedChargerID } from "$lib/services/charger";
	import type { Position } from "@capacitor/geolocation";
	import "leaflet.markercluster/dist/leaflet.markercluster.js";
	import "leaflet.markercluster/dist/MarkerCluster.css";
	import "leaflet.markercluster/dist/MarkerCluster.Default.css";

	// Props
	let { isDark = false, chargers = [] as ChargerStation[] } = $props<{
		isDark?: boolean;
		chargers?: ChargerStation[];
	}>();

	// Variables
	let map: L.Map | undefined;
	let userMarker: L.Marker | undefined;
	let markerClusterGroup: L.MarkerClusterGroup | undefined;

	// Constants
	const DEFAULT_ZOOM = 13;

	// Charger icons
	const chargerIconGreen = L.icon({
		iconUrl: "/LK_waypoint_green.svg",
		iconSize: [48, 48],
		iconAnchor: [24, 48],
	});
	const chargerIconRed = L.icon({
		iconUrl: "/LK_waypoint_red.svg",
		iconSize: [48, 48],
		iconAnchor: [24, 48],
	});
	// TODO: Implement this for currently selected charger
	const chargerIconWhite = L.icon({
		iconUrl: "/LK_waypoint_white.svg",
		iconSize: [48, 48],
		iconAnchor: [24, 48],
	});

	// Live location icon
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

	// Initialize map and marker cluster group
	function initializeMap(initializedMap: L.Map): void {
		map = initializedMap;
		markerClusterGroup = L.markerClusterGroup({
			maxClusterRadius: 50,
			disableClusteringAtZoom: 19,
			spiderfyOnMaxZoom: false,
			showCoverageOnHover: false,
			iconCreateFunction: (cluster) => {
				const childMarkers = cluster.getAllChildMarkers();
				// Count only available chargers (green icons)
				const availableCount = childMarkers.filter((marker) => {
					const chargerID = marker.options.alt;
					const charger = chargers.find((c: ChargerStation) => c.stationid === chargerID);
					return charger && charger.connector === "Available";
				}).length;

				return new L.DivIcon({
					html: `<div><span>${availableCount}</span></div>`,
					className: "marker-cluster",
					iconSize: new L.Point(50, 50),
				});
			},
		});

		map.addLayer(markerClusterGroup);
		map.on("click", () => {
			$selectedChargerID = "";
		});
		updateChargerMarkers();
	}

	// Update charger markers
	function updateChargerMarkers(): void {
		if (!map || !markerClusterGroup) return;

		markerClusterGroup.clearLayers();

		chargers.forEach((charger: ChargerStation) => {
			// Select icon based on charger status
			let icon;
			switch (charger.connector) {
				case "Available":
					icon = chargerIconGreen;
					break;
				default:
					icon = chargerIconRed;
					break;
			}

			const marker = L.marker([charger.location.latitude, charger.location.longitude], {
				icon: icon,
				alt: charger.stationid,
			});
			marker.on("click", () => {
				$selectedChargerID = charger.stationid;
			});
			if (markerClusterGroup) {
				markerClusterGroup.addLayer(marker);
			}
		});
	}

	// Update user position on map
	function updateUserPosition(position: Position | null): void {
		if (!map || !position) return;

		const latLng: L.LatLngTuple = [position.coords.latitude, position.coords.longitude];
		map.setView(latLng, DEFAULT_ZOOM, { animate: true });

		if (userMarker) {
			userMarker.setLatLng(latLng);
		} else {
			userMarker = L.marker(latLng, { icon: liveLocationIcon }).addTo(map);
		}
	}

	// Update map view for selected charger
	function updateSelectedChargerView(): void {
		if (!$selectedChargerID || !map) return;

		const selectedCharger = chargers.find((charger: ChargerStation) => charger.stationid === $selectedChargerID);
		if (selectedCharger) {
			const latLng: L.LatLngTuple = [selectedCharger.location.latitude, selectedCharger.location.longitude];
			const currentZoom = map.getZoom();
			map.setView(latLng, currentZoom, { animate: true });
		}
	}

	// Reactive effects
	$effect(() => {
		updateChargerMarkers();
	});

	$effect(() => {
		updateUserPosition($pos);
	});

	$effect(() => {
		updateSelectedChargerView();
	});

	// Lifecycle hooks
	onMount(() => {
		getPosition();
	});
</script>

<BaseMap {isDark} defaultZoom={6} onMapInit={initializeMap} />
