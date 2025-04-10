<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import TimePicker from "$lib/components/ui/TimePicker.svelte";

	let timeH = $state();
	let timeM = $state();

	let chargeNow = $state(false);
</script>

<Card title="Smart Charge" dotsPath="/menu">
	<p>Select when you need your car and we will charge it when electricity is cheap.</p>
	<div
		class="flex flex-row justify-center gap-4 rounded-2xl border border-lk-blue-800"
		style="background: linear-gradient(to right, #59a6b7, #2e4d59);"
	>
		<TimePicker bind:selectedTime={timeH} defaultTime={12} maxValue={24} align="right" />
		<TimePicker bind:selectedTime={timeM} defaultTime={37} maxValue={60} jump={15} align="left" />
	</div>

	<InputField label="Charge Now" labelBold={false} type="toggle" bind:value={chargeNow} />
</Card>
