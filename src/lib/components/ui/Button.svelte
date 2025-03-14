<script lang="ts">
	interface Props {
		type?: "button" | "submit" | "reset";
		loading?: boolean;
		disabled?: boolean;
		formID?: string;
		children?: import("svelte").Snippet;
	}

	let { type = "button", loading = false, disabled = false, formID, children }: Props = $props();
</script>

<button
	{type}
	form={formID}
	disabled={disabled || loading}
	class="p-3 font-bold bg-lk-blue-500 border border-lk-blue-500 rounded-xl text-lk-blue-50
	mt-4 cursor-pointer disabled:cursor-not-allowed
	{loading ? 'bg-lk-blue-800 border-lk-blue-800' : ''}"
>
	{#if loading}
		Loading...
	{:else}
		{@render children?.()}
	{/if}
</button>
