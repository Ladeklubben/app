<script lang="ts">
	import BaseInput from "./BaseInput.svelte";
	import CryptoJS from "crypto-js";

	let {
		id = `input-${CryptoJS.lib.WordArray.random(16).toString()}`, // Random ID if ID is not provided, 
		label,
		description,
		value = $bindable(),
		error,
		type = "text",
		disabled,
		textCenter,
		suffix,
	} = $props<{
		id?: string;
		label?: string;
		description?: string;
		value: string | number | null;
		error?: string;
		type?: "text" | "password" | "number";
		disabled?: boolean;
		textCenter?: boolean;
		suffix?: string;
	}>();
</script>

<BaseInput {id} {label} {description} {error}>
	<div class="relative mt-2">
		<input
			{id}
			name={id}
			{type}
			{disabled}
			bind:value
			class="w-full rounded-2xl border border-lk-blue-500 bg-transparent p-3 text-lg text-lk-blue-50 focus:border-lk-blue-300 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
				{textCenter ? 'text-center' : ''}
				{error ? 'border-lk-red-600' : ''}
                {disabled ? 'border-lk-blue-800' : ''}"
		/>
		{#if suffix}
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-lk-blue-50/50">
				{suffix}
			</div>
		{/if}
	</div>
</BaseInput>
