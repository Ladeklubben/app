<script lang="ts">
	interface Props {
		type?: "button" | "submit" | "reset";
		loading?: boolean;
		disabled?: boolean;
		children?: import("svelte").Snippet;
	}

	let { type = "button", loading = false, disabled = false, children }: Props = $props();
</script>

<button {type} class:btnLoad={loading} disabled={disabled || loading}>
	{#if loading}
		Loading...
	{:else}
		{@render children?.()}
	{/if}
</button>

<style>
	button {
		padding: 16px;
		font-size: 20px;
		font-weight: bold;
		background-color: var(--lk-blue-500);
		border: 1px solid var(--lk-blue-500);
		border-radius: var(--border-radius);
		color: var(--lk-blue-50);
		margin-top: 16px;
		cursor: pointer;
	}

	.btnLoad {
		background-color: var(--lk-blue-800);
		border-color: var(--lk-blue-800);
		cursor: not-allowed;
	}
</style>
