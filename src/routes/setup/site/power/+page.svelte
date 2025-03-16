<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import { fetchPowerCompanies, siteFormData, powerCompanies } from "$lib/services/site";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	async function handleSubmit(event: Event) {
		event.preventDefault();
	}

	onMount(() => {
		fetchPowerCompanies();
	});

</script>

<Subpage title="Power Company" backURL="/setup/site/rebate">
	<div id="height-check">
		<Form {handleSubmit} id="form">
			<p>
				To calculate your live electricity prices, and therefore charge your car in a price-efficient manner,
				please select the power company you use.
			</p>

			<InputField
				id="company"
				type="dropdown"
				label="Power Company"
				value={$siteFormData.powerCompany}
				options={$powerCompanies}
				error=""
			/>
		</Form>
	</div>
	<BottomButton activeDot={4} totalDots={4} formID="form" buttonText="Done" />
</Subpage>
