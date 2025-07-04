<script lang="ts">
	import TextInput from "./TextInput.svelte";

	let {
		id,
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
		value: number;
		error?: string;
		disabled?: boolean;
		suffix?: string;
	}>();
</script>

<TextInput {id} {label} {description} {error} bind:value type="number" {disabled} textCenter={true} {suffix}></TextInput>
