<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";

	let chargeNow = false;
</script>

<Card title="Smart Charge">
	<p>Select when you need your car and we will charge it when electricity is cheap.</p>

	<InputField label="Charge Now" labelBold={false} type="toggle" bind:value={chargeNow} />
</Card>

{chargeNow}
