<script lang="ts">
	interface Props {
		// MenuGroup.svelte
		title: string;
		children?: import("svelte").Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="border border-lk-blue-800 rounded-2xl mb-0">
	<h2 class="bg-lk-blue-900 py-3 px-4 m-0 text-lk-blue-100 border-b border-b-lk-blue-800 font-bold rounded-t-2xl">{title}</h2>
	<div class="content">
		{@render children?.()}
	</div>
</div>
