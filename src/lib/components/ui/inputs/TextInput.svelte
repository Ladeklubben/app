<script lang="ts">
	import { bind } from "leaflet";
	import BaseInput from "./BaseInput.svelte";

	let { id, label, description, value = $bindable(), error, password, disabled, textCenter, suffix } = $props<{
		id?: string;
		label?: string;
		description?: string;
		value: string;
		error?: string;
		password?: boolean;
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
			type={password ? "password" : "text"}
			{disabled}
			bind:value
			class="w-full rounded-2xl border border-lk-blue-500 bg-transparent p-3 text-lg text-lk-blue-50 focus:border-lk-blue-300 focus:outline-none
				{textCenter ? 'text-center' : ''}
				{error ? 'border-lk-red-600' : ''}
                {disabled ? "border-lk-blue-800" : ""}"
		/>
		{#if suffix}
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-lk-blue-50/50">
				{suffix}
			</div>
		{/if}
	</div>
</BaseInput>
