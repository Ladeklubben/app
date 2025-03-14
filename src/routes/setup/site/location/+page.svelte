<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import Map from "$lib/components/features/Map.svelte";
	import { siteFormData } from "$lib/services/site";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import { goto } from "$app/navigation";

	let errors = {
		address: "",
		city: "",
		zip: "",
	};

	async function handleSubmit(event: Event) {
		event.preventDefault();
		console.log($siteFormData);
		goto("/setup/site/rebate");
	}
</script>

<Subpage title="Add Installation">
	<div id="height-check">
		<Form {handleSubmit} id="form">
			<p>
				Use the map to select the location of your site, or enter the address manually. This is used to
				calculate energy tariffs automatically.
			</p>

			<Map isSatellite={true} height={300} />
			<InputField
				id="address"
				type="text"
				label="Address"
				bind:value={$siteFormData.location.address}
				error={errors.address}
			/>
			<InputField
				id="city"
				type="text"
				label="City"
				bind:value={$siteFormData.location.city}
				error={errors.city}
			/>
			<InputField id="zip" type="text" label="Zip" bind:value={$siteFormData.location.zip} error={errors.zip} />
		</Form>
	</div>
	<BottomButton activeDot={2} totalDots={4} formID="form" buttonText="Next" />
</Subpage>
