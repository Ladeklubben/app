<script lang="ts">
	let { title } = $props();
</script>

<div class="flex flex-col gap-5 p-5 rounded-2xl border border-lk-blue-800">
    <h1 class="text-lk-blue-100 text-2xl m-0">{title}</h1>
    <slot></slot>
	
</div>