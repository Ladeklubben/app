<script lang="ts">
	import * as L from "leaflet";
	import BaseMap from "./BaseMap.svelte";
	import { onMount, onDestroy } from "svelte";
	import type { ChargerStation } from "$lib/types/chargers";
	import { pos, getPosition, selectedChargerID } from "$lib/services/map";
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
				const childCount = cluster.getChildCount();
				return new L.DivIcon({
					html: `<div><span>${childCount}</span></div>`,
					className: "marker-cluster",
					iconSize: new L.Point(50, 50),
				});
			},
		});

		map.addLayer(markerClusterGroup);
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

<style>
	:global(.marker-cluster) {
		background-color: #5cf62866;
		border-radius: 40px;
	}
	:global(.marker-cluster div) {
		background-color: #5cf628;
		width: 40px;
		height: 40px;
		margin-left: 5px;
		margin-top: 5px;
		text-align: center;
		border-radius: 40px;
		font-size: 18px;
		font-weight: 800;
		color: #182b34;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
