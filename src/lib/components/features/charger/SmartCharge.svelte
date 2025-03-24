<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import TimePicker from "$lib/components/ui/TimePicker.svelte";

	let chargeNow = false;
</script>

<Card title="Smart Charge">
	<p>Select when you need your car and we will charge it when electricity is cheap.</p>
	<TimePicker />
	<InputField label="Charge Now" labelBold={false} type="toggle" bind:value={chargeNow} />
</Card>