<script lang="ts">
	import BaseInput from "./BaseInput.svelte";

	let {
		id = `input-${crypto.randomUUID()}`, // Random ID if ID is not provided
		label,
		value = $bindable(),
		disabled,
	} = $props<{
		id?: string;
		label?: string;
		value: boolean;
		disabled?: boolean;
	}>();
</script>

<BaseInput {id} removeError={true} >
	<div class="flex items-center justify-between">
		<label for={id} class="font-bold">{label}</label>
		<label class="inline-flex items-center cursor-pointer">
			<input type="checkbox" {id} name={id} {disabled} bind:checked={value} class="sr-only peer" />
			<div
				class="relative w-11 h-6 bg-lk-blue-500/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lk-blue-300 rounded-full peer peer-checked:bg-lk-blue-400
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-lk-blue-500/50 after:rounded-full after:h-5 after:w-5 after:transition-all
                peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
			></div>
		</label>
	</div>
</BaseInput>
