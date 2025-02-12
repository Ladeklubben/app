<script>
	import HomeVariant from "~icons/mdi/home-variant";
	import Menu from "~icons/mdi/menu";
</script>

<div class="navbar">
	<div class="nav-element">
		<HomeVariant style="font-size: 25px;" />
		Home
	</div>

	<div class="nav-element">
		<Menu style="font-size: 25px;" />
		Menu
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
