<script lang="ts">
	import { page } from "$app/state";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { onMount } from "svelte";
	import { chargers } from "$lib/classes/Chargers.svelte";
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
	import { showError } from "$lib/services/dialog.svelte";

	onMount(async () => {
		if (chargers.selected ) {
			await chargers.selected.getAllData();
		} else {
			showError("No charger selected, please select a charger first.", false);
			goto("/menu/chargers");
		}
	});
</script>

<Subpage title="Charger Settings" backURL="/menu/chargers">
	<MenuGroup title="Personal">
		<MenuItem
			text="Location"
			onclick={() => {
				goto("/menu/chargers/settings/location");
			}}
		>
			<MapMarker />
		</MenuItem>
		<MenuItem
			text="Notifications"
			onclick={() => {
				goto("/menu/chargers/settings/notifications");
			}}
		>
			<BellRing />
		</MenuItem>
		<MenuItem
			text="Smart Charging"
			hasToggle={true}
			onclick={() => {
				goto("/menu/chargers/settings/smart-charging");
			}}
		>
			<BatteryCharging />
		</MenuItem>
		<MenuItem
			text="Always On"
			onclick={() => {
				goto("/menu/chargers/settings/always-on");
			}}
		>
			<Clock />
		</MenuItem>
	</MenuGroup>

	<MenuGroup title="Public">
		<MenuItem
			text="Rental"
			onclick={() => {
				goto("/menu/chargers/settings/rental");
			}}
		>
			<Star />
		</MenuItem>
		<MenuItem
			text="Pricing"
			onclick={() => {
				goto("/menu/chargers/settings/pricing");
			}}
		>
			<Cash />
		</MenuItem>
		<MenuItem
			text="QR Code"
			onclick={() => {
				goto("/menu/chargers/settings/qr");
			}}
		>
			<QRCode />
		</MenuItem>
	</MenuGroup>

	<MenuGroup title="Info">
		<MenuItem
			text="Electricity"
			onclick={() => {
				console.log("Clicked");
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
