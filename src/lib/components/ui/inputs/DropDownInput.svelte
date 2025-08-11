<script lang="ts">
	import BaseInput from "./BaseInput.svelte";
	import { generateUUID } from "$lib/utils";

	let {
		id = `input-${generateUUID()}`, // Random ID if ID is not provided
		label,
		value = $bindable(),
		error,
		options = [],
		disabled,
	} = $props<{
		id?: string;
		label?: string;
		description?: string;
		value: number;
		options?: { value: string; label: string }[];
		error?: string;
		disabled?: boolean;
	}>();
</script>

<BaseInput {id} removeError={true}>
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
</BaseInput>
