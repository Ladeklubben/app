<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import { fetchPowerCompanies, siteFormData, powerCompanies, createNewSite } from "$lib/services/site";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	let loading = false;

	async function handleSubmit(event: Event) {
		event.preventDefault();
		loading = true;
		try {
			await createNewSite($siteFormData);
			goto("/");
		} catch (error) {
			console.error("Failed to create new site", error);
			//TODO: Show error in UI
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		fetchPowerCompanies();
	});
</script>

<Subpage title="Distribution Company" backURL="/setup/site/rebate">
	<div id="height-check">
		<Form {handleSubmit} id="form">
			<p>
				To calculate your live electricity prices, and therefore charge your car in a price-efficient manner,
				please select the power distribution company you use.
			</p>

			<InputField
				id="company"
				type="dropdown"
				label="Distribution Company"
				bind:value={$siteFormData.distributionCompany}
				options={$powerCompanies}
				error=""
			/>
		</Form>
	</div>
	<BottomButton activeDot={4} totalDots={4} formID="form" buttonText="Done" {loading} />
</Subpage>
