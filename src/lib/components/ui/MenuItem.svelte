<script lang="ts">
	let { text, hasToggle = false, children, onclick } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="flex justify-between items-center p-3 border-b border-lk-blue-800 cursor-pointer last:border-b-0" {onclick}>
	<div class="flex items-center gap-4">
		{@render children?.()}
		<span class="text-lk-blue-100">{text}</span>
	</div>
	<span class="text-lk-blue-100 text-xl">›</span>
</div>
