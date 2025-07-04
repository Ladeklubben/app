<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import { fetchPowerCompanies, siteFormData, powerCompanies, createNewSite } from "$lib/services/site";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import DropDownInput from "$lib/components/ui/inputs/DropDownInput.svelte";

	let loading = false;

	async function handleSubmit(event: Event) {
		event.preventDefault();
		loading = true;
		await createNewSite($siteFormData);
		goto("/");
		loading = false;
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
			<DropDownInput id="company" label="Distribution Company" bind:value={$siteFormData.distributionCompany} options={$powerCompanies} />
		</Form>
	</div>
	<BottomButton activeDot={4} totalDots={4} formID="form" buttonText="Done" {loading} />
</Subpage>
