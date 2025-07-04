<script lang="ts">
	let {
		id,
		label,
		description,
		error,
		removeError = false,
		children,
	} = $props<{
		id?: string;
		label?: string;
		description?: string;
		error?: string;
		removeError?: boolean;
		children: import("svelte").Snippet;
	}>();
</script>

<div class="flex flex-col gap-1">
	{#if label}
		<label for={id} class="font-bold">{label}</label>
	{/if}
	{#if description}
		<p>{description}</p>
	{/if}
	{@render children?.()}
	{#if !removeError}
		<span class="text-center text-lk-red-600">
			{#if error}
				{error}
			{:else}
				&nbsp;
			{/if}
		</span>
	{/if}
</div>
