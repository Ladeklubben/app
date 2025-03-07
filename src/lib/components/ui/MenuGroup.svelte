<script lang="ts">
	
	interface Props {
		// MenuGroup.svelte
		title: string;
		children?: import('svelte').Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="menu-group">
	<h2>{title}</h2>
	<div class="content">
		{@render children?.()}
	</div>
</div>

<style>
	.menu-group {
		border: 1px solid var(--lk-blue-800);
		border-radius: var(--border-radius);
		overflow: hidden;
		margin-bottom: 16px;
	}

	h2 {
		font-size: 16px;
		padding: 12px 16px;
		margin: 0;
		color: var(--lk-blue-100);
		border-bottom: 1px solid var(--lk-blue-800);
	}
</style>
