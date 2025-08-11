<script lang="ts">
	import TextInput from "./TextInput.svelte";
	import { generateUUID } from "$lib/utils";
	
	let {
		id = `input-${generateUUID()}`, // Random ID if ID is not provided
		label,
		description,
		value = $bindable(),
		error,
		disabled,
		suffix,
	} = $props<{
		id?: string;
		label?: string;
		description?: string;
		value: number | null;
		error?: string;
		disabled?: boolean;
		suffix?: string;
	}>();
</script>

<TextInput {id} {label} {description} {error} bind:value type="number" {disabled} textCenter={true} {suffix}></TextInput>
