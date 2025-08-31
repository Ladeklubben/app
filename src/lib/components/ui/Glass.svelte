<script lang="ts">
	import { tileServer } from "$lib/services/map";
	let { children } = $props();
</script>

<div
	class="border border-lk-blue-800 rounded-xl overflow-hidden shadow-lg
	{$tileServer === 'dark' ? 'bg-lk-blue-950/50 backdrop-blur-md' : ''}
	{$tileServer === 'light' ? 'bg-lk-blue-900/80 backdrop-blur-sm' : ''}
	{$tileServer === 'satellite' ? 'bg-lk-blue-950/80 backdrop-blur-md' : ''}
	"
>
	{@render children?.()}
</div>
