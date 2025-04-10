<script lang="ts">
	let {
		id = "",
		type = "text",
		label,
		labelBold = true,
		value = $bindable(),
		error = "",
		disabled = false,
		options = [],
	} = $props();
</script>

{#if type === "checkbox"}
	<div class="flex items-center justify-between">
		<label for={id} class:font-bold={labelBold}>{label}</label>
		<input
			type="checkbox"
			{id}
			name={id}
			{disabled}
			bind:checked={value}
			class="h-6 w-6 appearance-none rounded-md border border-lk-blue-500 bg-transparent checked:before:scale-100 checked:before:bg-lk-blue-400 focus:outline-none focus:ring-2 focus:ring-lk-blue-300
                before:m-[4px] before:h-4 before:w-4 before:scale-0 before:clip-path-[polygon(14%_44%,0_65%,50%_100%,100%_20%,80%_0,43%_62%)] before:transition-transform before:duration-200 before:ease-in-out
                {error ? 'border-lk-red-600' : ''}"
		/>
	</div>
{:else if type === "toggle"}
	<div class="flex items-center justify-between">
		<label for={id} class:font-bold={labelBold}>{label}</label>
		<label class="inline-flex items-center cursor-pointer">
			<input
				type="checkbox"
				{id}
				name={id}
				{disabled}
				bind:checked={value}
				class="sr-only peer"
			/>
			<div
				class="relative w-11 h-6 bg-lk-blue-500/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lk-blue-300 rounded-full peer peer-checked:bg-lk-blue-400
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-lk-blue-500/50 after:rounded-full after:h-5 after:w-5 after:transition-all
                peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
			></div>
		</label>
	</div>
{:else if type === "dropdown"}
	<div class="flex flex-col gap-3">
		<label for={id} class="font-bold">{label}</label>
		<select
			{id}
			name={id}
			{disabled}
			bind:value
			class="rounded-2xl border border-lk-blue-500 bg-transparent p-3 text-lg text-lk-blue-50 focus:border-lk-blue-300 focus:outline-none
                {error ? 'border-lk-red-600' : ''}"
		>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
{:else}
	<div class="flex flex-col gap-3">
		<label for={id} class="font-bold">{label}</label>
		<input
			{type}
			{id}
			name={id}
			{disabled}
			bind:value
			class="rounded-2xl border border-lk-blue-500 bg-transparent p-3 text-lg text-lk-blue-50 focus:border-lk-blue-300 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                {error ? 'border-lk-red-600' : ''}"
		/>
	</div>
{/if}
{#if error}
	<span class="mt-[-16px] mb-[-22px] block text-center text-lk-red-600">
		{error}
	</span>
{/if}
