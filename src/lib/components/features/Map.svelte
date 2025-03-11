<script lang="ts">
	import { onMount } from "svelte";
	import * as L from "leaflet";
	import "leaflet/dist/leaflet.css";

	let mapContainer: HTMLDivElement;
	let map: L.Map | undefined;

	onMount(() => {
		// Initialize the map
		map = L.map(mapContainer, {
			center: [56, 10.5], // Default center (London)
			zoom: 6,
			zoomControl: true,
		});

		map.attributionControl.setPrefix(""); // Remove default Leaflet attribution
		map.zoomControl.remove(); // Remove default Leaflet zoom control

		// Add dark tile layer from CartoDB
		L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
			subdomains: "abcd",
			maxZoom: 19,
		}).addTo(map);

		// Clean up on component unmount
		return () => {
			if (map) {
				map.remove();
			}
		};
	});
</script>

<div bind:this={mapContainer} class="w-full h-100 border border-lk-blue-800 rounded-2xl"></div>
