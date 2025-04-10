<script lang="ts">
	let { id = "form", children, handleSubmit } = $props();
</script>

<form onsubmit={handleSubmit} {id} novalidate class="flex flex-col gap-5 w-full">
	{@render children?.()}
</form>
