<script>
	import HomeVariant from "~icons/mdi/home-variant";
	import HomeVariantOutlined from "~icons/mdi/home-variant-outline";
	import Menu from "~icons/mdi/menu";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
</script>

<div class="tabbar">
	<button
		type="button"
		class="tab-element"
		on:click={() => goto("/")}
		style="opacity: {$page.url.pathname === '/' ? '100%' : '60%'};"
	>
		<HomeVariant style="font-size: 25px;" />
		Home
	</button>

	<button
		type="button"
		class="tab-element"
		on:click={() => goto("/meter")}
		style="opacity: {$page.url.pathname === '/meter' ? '100%' : '60%'};"
	>
		<Menu style="font-size: 25px;" />
		Meter
	</button>

	<button
		type="button"
		class="tab-element"
		on:click={() => goto("/settings")}
		style="opacity: {$page.url.pathname === '/settings' ? '100%' : '60%'};"
	>
		<Menu style="font-size: 25px;" />
		Settings
	</button>
</div>

<style>
	.tabbar {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 10px 0 10px 0;
		background-color: var(--lk-blue-950);
		color: white;
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 1000;
		border-top: 1px solid var(--lk-blue-800);
	}

	.tab-element {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		font-size: 10px;
		width: 100%;
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
</style>
