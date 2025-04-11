<script lang="ts">
	import Map from "$lib/components/features/Map.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>
<div class="h-full flex flex-cl">
	<Map />
</div>
