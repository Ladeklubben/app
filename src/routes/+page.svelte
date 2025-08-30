<script lang="ts">
	import { goto } from "$app/navigation";
	import SmartCharge from "$lib/components/features/charger/SmartCharge.svelte";
	import UnlockCharger from "$lib/components/features/charger/UnlockCharger.svelte";
</script>

<div class="wrapper">
	<div class=" flex justify-between items-center">
		<h1>Home</h1>
		<button
			class="flex flex-col justify-center items-center cursor-pointer bg-lk-blue-300 text-4xl border-0 rounded-4xl w-8 h-8"
			onclick={() => goto("/setup/site")}
		>
			<span class="add-icon">+</span>
		</button>
	</div>
	<h1 class="text-lk-blue-50 text-2xl font-bold h-80 flex items-center justify-center">Work In Progress</h1>
	<!-- <SmartCharge />
	<UnlockCharger /> -->
</div>
