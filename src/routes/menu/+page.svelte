<script lang="ts">
	import { logout } from "$lib/services/auth";
	import { currentUser } from "$lib/services/auth";
	import MenuItem from "$lib/components/ui/MenuItem.svelte";
	import MenuGroup from "$lib/components/ui/MenuGroup.svelte";
	import { onMount } from "svelte";
	import { managedChargers } from "$lib/classes/Charger.svelte";

	// Icons
	import Email from "~icons/mdi/email";
	import Document from "~icons/mdi/document";
	import BatteryCharging from "~icons/mdi/battery-charging";
	import BellRing from "~icons/mdi/bell-ring";
	import Lock from "~icons/mdi/lock";
	import { goto } from "$app/navigation";

	onMount(async () => {
		try {
			await managedChargers.initializeChargers();
			await managedChargers.loadAllChargersCardData();
		} catch (error) {
			console.error("Failed to initialize charger data:", error);
			// TODO: Show error message to the user
		}
	});
</script>

<div class="wrapper">
	<div class="p-8 text-center mb-4 rounded-2xl border-lk-blue-800 border gap-3 flex flex-col items-center">
		<div class="avatar w-20 h-20 bg-lk-blue-50 rounded-full">
			<!-- Add User SVG icon here -->
		</div>
		<p class="text-lk-blue-100">{$currentUser?.email}</p>
		<button
			class="bg-lk-blue-100 border-0 py-2 px-4 rounded-2xl text-lk-blue-800 text-sm cursor-pointer"
			onclick={logout}
		>
			Log Out
		</button>
	</div>

	<MenuGroup title="Account">
		<MenuItem
			text="Chargers"
			onclick={() => {
				goto("/menu/chargers");
			}}
		>
			<BatteryCharging />
		</MenuItem>
		<MenuItem
			text="Notifications"
			hasToggle={true}
			onclick={() => {
				console.log("Notifications clicked");
			}}
		>
			<BellRing />
		</MenuItem>
		<MenuItem
			text="Privacy"
			onclick={() => {
				console.log("Privacy clicked");
			}}
		>
			<Lock />
		</MenuItem>
	</MenuGroup>

	<MenuGroup title="Support">
		<MenuItem
			text="Documentation"
			onclick={() => {
				window.location.href = "https://wiki.ladeklubben.dk/";
			}}
		>
			<Document />
		</MenuItem>
		<MenuItem
			text="Contact Us"
			onclick={() => {
				window.location.href = "https://ladeklubben.dk/kontakt-os/";
			}}
		>
			<Email />
		</MenuItem>
	</MenuGroup>
</div>
