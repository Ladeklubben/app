<script lang="ts">
	let { children, handleSubmit } = $props();
</script>

<form onsubmit={handleSubmit} novalidate class="flex flex-col gap-4 w-full">
	{@render children?.()}
</form>
