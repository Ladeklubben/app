<script>
	import HomeVariant from "~icons/mdi/home-variant";
	import Menu from "~icons/mdi/menu";
	import { goto } from "$app/navigation";
</script>

<div class="navbar">
	<div class="nav-element" on:click={() => goto("/")}>
		<HomeVariant style="font-size: 25px;" />
		Home
	</div>

	<div class="nav-element" on:click={() => goto("/settings")}>
		<Menu style="font-size: 25px;" />
		Settings
	</div>

	<div class="nav-element" on:click={() => goto("/settings")}>
		<Menu style="font-size: 25px;" />
		Settings
	</div>
</div>

<style>
	.navbar {
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

	.nav-element {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		font-size: 10px;
	}
</style>
