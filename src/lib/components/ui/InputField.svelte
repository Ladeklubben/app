<script lang="ts">
	let { id, type = "text", label, value = $bindable(), error } = $props();
</script>

{#if type === "checkbox"}
	<div class="flex items-center justify-between">
		<label for={id} class="font-bold">{label}</label>
		<input
			type="checkbox"
			{id}
			name={id}
			bind:checked={value}
			class="h-6 w-6 appearance-none rounded-md border border-lk-blue-500 bg-transparent checked:before:scale-100 checked:before:bg-lk-blue-400 focus:outline-none focus:ring-2 focus:ring-lk-blue-300
				before:m-[4px] before:h-4 before:w-4 before:scale-0 before:clip-path-[polygon(14%_44%,0_65%,50%_100%,100%_20%,80%_0,43%_62%)] before:transition-transform before:duration-200 before:ease-in-out
				{error ? 'border-lk-red-700' : ''}"
		/>
	</div>
{:else}
	<div class="flex flex-col gap-3">
		<label for={id} class="font-bold">{label}</label>
		<input
			{type}
			{id}
			name={id}
			bind:value
			class="rounded-2xl border border-lk-blue-500 bg-transparent p-3 text-lg text-lk-blue-50 focus:border-lk-blue-300 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
				{error ? 'border-lk-red-700' : ''}"
		/>
	</div>
{/if}
{#if error}
	<span class="mt-[-10px] block text-center text-lk-red-700">{error}</span>
{/if}
