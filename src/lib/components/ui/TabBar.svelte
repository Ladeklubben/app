<script lang="ts">
	import HomeVariant from "~icons/mdi/home-variant";
	import Menu from "~icons/mdi/menu";
	import ChartBox from "~icons/mdi/chart-box";
	import MapMarker from "~icons/mdi/map-marker";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { device, Platform } from "$lib/services/layout";
</script>

<div
	class="flex justify-around items-center pt-2 fixed bottom-0 w-full z-1000 border-t border-lk-blue-800 bg-lk-blue-950 text-lk-blue-50"
	class:pb-[env(safe-area-inset-bottom,40px)]={$device === Platform.IOS}
	class:pb-2={$device === Platform.Android}
	class:pb-4={$device === Platform.Web}
>
	<button
		type="button"
		class="flex flex-col items-center gap-0.5 text-xs w-full bg-none border-none cursor-pointer tap-highlight-transparent"
		onclick={() => goto("/")}
		style="opacity: {$page.url.pathname !== '/map' &&
		$page.url.pathname !== '/info' &&
		$page.url.pathname !== '/menu'
			? '100%'
			: '60%'};"
	>
		<HomeVariant style="font-size: 25px;" />
		Home
	</button>

	<button
		type="button"
		class="flex flex-col items-center gap-0.5 text-xs w-full bg-none border-none cursor-pointer tap-highlight-transparent"
		onclick={() => goto("/map")}
		style="opacity: {$page.url.pathname === '/map' ? '100%' : '60%'};"
	>
		<MapMarker style="font-size: 25px;" />
		Map
	</button>

	<button
		type="button"
		class="flex flex-col items-center gap-0.5 text-xs w-full bg-none border-none cursor-pointer tap-highlight-transparent"
		onclick={() => goto("/info")}
		style="opacity: {$page.url.pathname === '/info' ? '100%' : '60%'};"
	>
		<ChartBox style="font-size: 25px;" />
		Info
	</button>

	<button
		type="button"
		class="flex flex-col items-center gap-0.5 text-xs w-full bg-none border-none cursor-pointer tap-highlight-transparent"
		onclick={() => goto("/menu")}
		style="opacity: {$page.url.pathname === '/menu' ? '100%' : '60%'};"
	>
		<Menu style="font-size: 25px;" />
		Menu
	</button>
</div>
