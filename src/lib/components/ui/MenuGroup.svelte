<script lang="ts">
	interface Props {
		// MenuGroup.svelte
		title: string;
		children?: import("svelte").Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="border border-lk-blue-800 rounded-2xl mb-4">
	<h2 class="py-3 px-4 m-0 text-lk-blue-100 border-b border-b-lk-blue-800 font-bold">{title}</h2>
	<div class="content">
		{@render children?.()}
	</div>
</div>
