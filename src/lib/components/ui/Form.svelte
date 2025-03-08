<script lang="ts">
	let { children, handleSubmit } = $props();
</script>

<form onsubmit={handleSubmit} novalidate>
	{@render children?.()}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
	}
</style>
