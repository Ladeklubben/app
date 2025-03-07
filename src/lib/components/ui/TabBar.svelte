<script lang="ts">
	import HomeVariant from "~icons/mdi/home-variant";
	import Menu from "~icons/mdi/menu";
	import ChartBox from "~icons/mdi/chart-box";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
</script>

<div
	class="flex justify-around items-center pt-2 pb-[env(safe-area-inset-bottom,40px)] fixed bottom-0 w-full z-1000 border-t border-lk-blue-800 bg-lk-blue-950 text-lk-blue-50"
>
	<button
		type="button"
		class="flex flex-col items-center gap-0.5 text-xs w-full bg-none border-none cursor-pointer tap-highlight-transparent"
		onclick={() => goto("/")}
		style="opacity: {$page.url.pathname !== '/prices' && $page.url.pathname !== '/menu' ? '100%' : '60%'};"
	>
		<HomeVariant style="font-size: 25px;" />
		Home
	</button>

	<button
		type="button"
		class="flex flex-col items-center gap-0.5 text-xs w-full bg-none border-none cursor-pointer tap-highlight-transparent"
		onclick={() => goto("/prices")}
		style="opacity: {$page.url.pathname === '/prices' ? '100%' : '60%'};"
	>
		<ChartBox style="font-size: 25px;" />
		Prices
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
