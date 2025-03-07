<script>
	let { label = "", percentage = 0 } = $props();
</script>

<div class="flex items-center gap-5">
	<div class="relative flex-grow overflow-hidden h-10 bg-lk-blue-800 rounded-2xl">
		<span class="absolute left-5 top-1/2 transform -translate-y-1/2 text-lk-blue-100 text-lg font-bold">
			{label}
		</span>
		<div
			class="h-full bg-lk-blue-500 rounded-2xl transition-width duration-300 ease"
			style="width: {percentage}%"
		></div>
		<span class="absolute right-5 top-1/2 transform -translate-y-1/2 text-lk-blue-100 text-lg">
			{percentage}%
		</span>
	</div>
</div>
