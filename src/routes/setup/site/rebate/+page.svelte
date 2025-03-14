<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import { siteFormData } from "$lib/services/site";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import { goto } from "$app/navigation";

	let formData = $state({
		solarPanels: false,
		heatPump: false,
		electricHeating: false,
	});

	let isEligible = $state(true);
	$effect(() => {
		if (formData.solarPanels || formData.heatPump || formData.electricHeating) {
			isEligible = false;
		} else {
			isEligible = true;
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (formData.solarPanels || formData.heatPump || formData.electricHeating) {
			console.log($siteFormData);
		}
	}
</script>

<Subpage title="Electricity Rebate">
	<div id="height-check">
		<Form {handleSubmit} id="form">
			<p>
				Select whether you have any of the following items at this site. This information is used to evaluate if
				you are eligible for the Danish electricty tax rebate.
			</p>

			<InputField
				id="solarPanels"
				type="checkbox"
				label="Solar Panels"
				bind:value={formData.solarPanels}
				error={""}
			/>
			<InputField id="heatPump" type="checkbox" label="Heat Pump" bind:value={formData.heatPump} error={""} />
			<InputField
				id="electricHeating"
				type="checkbox"
				label="Electric Heating"
				bind:value={formData.electricHeating}
				error={""}
			/>

			{#if !isEligible}
				<div class="w-full p-4 bg-lk-red-700 rounded-2xl mt-5">
					<p class="text-lk-blue-50">
						Sorry, you don't qualify for the rebate due to your setup. However, you can still enjoy all the
						benefits of Ladeklubben. Click Next to continue the setup.
					</p>
				</div>
			{/if}
		</Form>
	</div>
	<BottomButton activeDot={2} totalDots={4} formID="form" buttonText="Next" />
</Subpage>
