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
</div>

<style>
	.navbar {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 10px 0;
		background-color: var(--lk-blue-800);
		color: white;
		min-height: 80px;
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 1000;
	}

	.nav-element {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
</style>
