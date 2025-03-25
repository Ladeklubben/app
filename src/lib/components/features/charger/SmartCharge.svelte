<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import TimePicker from "$lib/components/ui/TimePicker.svelte";

	let chargeNow = false;
</script>

<Card title="Smart Charge">
	<p>Select when you need your car and we will charge it when electricity is cheap.</p>
	<div class="flex flex-row justify-center gap-4">
		<TimePicker maxValue={24} align="right"/>
		<TimePicker maxValue={60} jump={15} align="left"/>
	</div>
	
	<InputField label="Charge Now" labelBold={false} type="toggle" bind:value={chargeNow} />
</Card>