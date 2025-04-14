<script lang="ts">
	let { children } = $props();
</script>

<div class="backdrop-blur-sm bg-lk-blue-950/50 border border-lk-blue-800 rounded-xl overflow-hidden shadow-lg">
	{@render children?.()}
</div>
