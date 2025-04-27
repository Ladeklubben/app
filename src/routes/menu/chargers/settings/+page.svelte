<script lang="ts">
	import { page } from "$app/state";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { onMount } from "svelte";
	import { ManagedCharger, ManagedChargersStore, selectedChargerStore } from "$lib/models/ManagedChargers";
	import MenuItem from "$lib/components/ui/MenuItem.svelte";
	import MenuGroup from "$lib/components/ui/MenuGroup.svelte";
	import { goto } from "$app/navigation";

	// Icons
	import BatteryCharging from "~icons/mdi/battery-charging";
	import BellRing from "~icons/mdi/bell-ring";
	import MapMarker from "~icons/mdi/map-marker";
	import Bolt from "~icons/mdi/lightning-bolt";
	import Clock from "~icons/mdi/clock-time-four-outline";
	import QRCode from "~icons/mdi/qrcode-scan";
	import Cash from "~icons/mdi/cash-multiple";
	import Star from "~icons/mdi/star";
	import Chart from "~icons/mdi/chart-box-outline";

	onMount(() => {
		if ($selectedChargerStore === null) {
			// TODO: Show error message
			goto("/menu/chargers");
		}
	});
</script>

<Subpage title="Charger Settings" backURL="/menu/chargers">
	<MenuGroup title="Personal">
		<MenuItem
			text="Location"
			onclick={() => {
				goto("/menu/chargers");
			}}
		>
			<MapMarker />
		</MenuItem>
		<MenuItem
			text="Notifications"
			onclick={() => {
				console.log("Privacy clicked");
			}}
		>
			<BellRing />
		</MenuItem>
		<MenuItem
			text="Smart Charging"
			hasToggle={true}
			onclick={() => {
				console.log("Notifications clicked");
			}}
		>
			<BatteryCharging />
		</MenuItem>
		<MenuItem
			text="Always On"
			onclick={() => {
				console.log("Privacy clicked");
			}}
		>
			<Clock />
		</MenuItem>
	</MenuGroup>

	<MenuGroup title="Public">
		<MenuItem
			text="Rental"
			onclick={() => {
				window.location.href = "https://wiki.ladeklubben.dk/";
			}}
		>
			<Star />
		</MenuItem>
		<MenuItem
			text="Pricing"
			onclick={() => {
				window.location.href = "https://ladeklubben.dk/kontakt-os/";
			}}
		>
			<Cash />
		</MenuItem>
		<MenuItem
			text="QR Code"
			onclick={() => {
				window.location.href = "https://ladeklubben.dk/kontakt-os/";
			}}
		>
			<QRCode />
		</MenuItem>
	</MenuGroup>

	<MenuGroup title="Info">
		<MenuItem
			text="Electricity"
			onclick={() => {
				window.location.href = "https://wiki.ladeklubben.dk/";
			}}
		>
			<Bolt />
		</MenuItem>
		<MenuItem
			text="Activity"
			onclick={() => {
				goto("/menu/chargers/settings/activity");
			}}
		>
			<Chart />
		</MenuItem>
	</MenuGroup>
</Subpage>
