<script lang="ts">
	let { id = "form", children, handleSubmit, gap=5 } = $props();
</script>

<form onsubmit={handleSubmit} {id} novalidate class="flex flex-col gap-{gap} w-full">
	{@render children?.()}
</form>
