<script lang="ts">
	import HomeVariant from "~icons/mdi/home-variant";
	import Menu from "~icons/mdi/menu";
	import ChartBox from "~icons/mdi/chart-box";
	import MapMarker from "~icons/mdi/map-marker";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { device, Platform } from "$lib/services/layout";
	import { Haptics, ImpactStyle } from "@capacitor/haptics";

	const ICON_SIZE = 20;

	// Handle switching pages
	// TODO: Decide if this is a gimmick or a good idea
	async function handlePageChange(link: string | URL) {
		if (link === page.url.pathname) {
			return;
		} else {
			// Trigger haptic feedback
			try {
				await Haptics.impact({ style: ImpactStyle.Light });
			} catch {
				// Do nothing if we get an error
			} finally {
				goto(link);
			}
		}
	}
</script>

<div
	class="flex justify-around items-center pt-3 fixed bottom-0 w-full z-1000 border-t border-lk-blue-800 bg-lk-blue-950 text-lk-blue-50"
	class:pb-6={$device === Platform.IOS}
	class:pb-7={$device === Platform.Android}
	class:pb-5={$device === Platform.Web}
>
	<button
		type="button"
		class="flex flex-col items-center gap-0.5 text-xs w-full bg-none border-none cursor-pointer tap-highlight-transparent"
		onclick={() => handlePageChange("/")}
		style="opacity: {page.url.pathname !== '/map' && page.url.pathname !== '/info' && page.url.pathname !== '/menu'
			? '100%'
			: '60%'};"
	>
		<HomeVariant style="font-size: {ICON_SIZE}px;" />
		Home
	</button>

	<button
		type="button"
		class="flex flex-col items-center gap-0.5 text-xs w-full bg-none border-none cursor-pointer tap-highlight-transparent"
		onclick={() => handlePageChange("/map")}
		style="opacity: {page.url.pathname === '/map' ? '100%' : '60%'};"
	>
		<MapMarker style="font-size: {ICON_SIZE}px;" />
		Map
	</button>

	<button
		type="button"
		class="flex flex-col items-center gap-0.5 text-xs w-full bg-none border-none cursor-pointer tap-highlight-transparent"
		onclick={() => handlePageChange("/info")}
		style="opacity: {page.url.pathname === '/info' ? '100%' : '60%'};"
	>
		<ChartBox style="font-size: {ICON_SIZE}px;" />
		Info
	</button>

	<button
		type="button"
		class="flex flex-col items-center gap-0.5 text-xs w-full bg-none border-none cursor-pointer tap-highlight-transparent"
		onclick={() => handlePageChange("/menu")}
		style="opacity: {page.url.pathname === '/menu' ? '100%' : '60%'};"
	>
		<Menu style="font-size: {ICON_SIZE}px;" />
		Menu
	</button>
</div>
