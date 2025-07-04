<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import ToggleInput from "$lib/components/ui/inputs/ToggleInput.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import { siteFormData } from "$lib/services/site";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import { goto } from "$app/navigation";

	const isEligible = $derived(
		!(
			$siteFormData.taxRebate.solarPanels ||
			$siteFormData.taxRebate.heatPump ||
			$siteFormData.taxRebate.electricHeating
		),
	);

	$effect(() => {
		if (!isEligible) {
			$siteFormData.taxRebate.noneOfTheAbove = false;
		} else {
			$siteFormData.taxRebate.noneOfTheAbove = true;
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		goto("/setup/site/distribution");
	}
</script>

<Subpage title="Electricity Rebate" backURL="/setup/site/location">
	<div id="height-check">
		<Form {handleSubmit} id="form">
			<p>
				Select whether you have any of the following items at this site. This information is used to evaluate if
				you are eligible for the Danish electricty tax rebate.
			</p>

			<ToggleInput
				id="solarPanels"
				label="Solar Panels"
				bind:value={$siteFormData.taxRebate.solarPanels}
			/>
			<ToggleInput
				id="heatPump"
				label="Heat Pump"
				bind:value={$siteFormData.taxRebate.heatPump}
			/>
			<ToggleInput
				id="electricHeating"
				label="Electric Heating"
				bind:value={$siteFormData.taxRebate.electricHeating}
			/>
			<ToggleInput
				id="noneOfTheAbove"
				label="None of the above"
				bind:value={$siteFormData.taxRebate.noneOfTheAbove}
				disabled={true}
			/>

			{#if !isEligible}
				<div class="w-full p-4 bg-lk-red-600 rounded-2xl mt-5">
					<p class="text-lk-blue-50">
						Sorry, you don't qualify for the rebate due to your setup. However, you can still enjoy all the
						benefits of Ladeklubben. Click Next to continue the setup.
					</p>
				</div>
			{/if}
		</Form>
	</div>
	<BottomButton activeDot={3} totalDots={4} formID="form" buttonText="Next" />
</Subpage>
