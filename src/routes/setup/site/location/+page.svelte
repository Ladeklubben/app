<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import TextInput from "$lib/components/ui/inputs/TextInput.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import { siteFormData } from "$lib/services/site";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import { goto } from "$app/navigation";
	import { validateZip } from "$lib/services/forms";

	let errors = {
		address: "",
		city: "",
		zip: "",
	};

	// Validation function
	function validateForm() {
		let isValid = true;
		const newErrors = {
			address: "",
			city: "",
			zip: "",
		};

		// Address validation
		if (!$siteFormData.location.address || $siteFormData.location.address.trim() === "") {
			newErrors.address = "Address is required";
			isValid = false;
		}

		// City validation
		if (!$siteFormData.location.city || $siteFormData.location.city.trim() === "") {
			newErrors.city = "City is required";
			isValid = false;
		}

		// Cost code validation (basic 4-digit DK postCode code check)
		if (!$siteFormData.location.zip || !validateZip($siteFormData.location.zip)) {
			newErrors.zip = "Not a valid 4-digit postcode";
			isValid = false;
		}

		errors = newErrors;
		return isValid;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		// Only proceed if validation passes
		if (validateForm()) {
			console.log($siteFormData);
			goto("/setup/site/rebate");
		}
	}
</script>

<Subpage title="Site Location" backURL="/setup/site">
	<div id="height-check">
		<Form {handleSubmit} id="form" gap={0}>
			<p class="mb-4">
				Use the map to select the location of your site, or enter the address manually. This is used to
				calculate energy tariffs automatically.
			</p>
			<TextInput
				id="address"
				label="Address"
				bind:value={$siteFormData.location.address}
				error={errors.address}
			/>
			<TextInput
				id="city"
				label="City"
				bind:value={$siteFormData.location.city}
				error={errors.city}
			/>
			<TextInput
				id="postCode"
				label="Postcode"
				bind:value={$siteFormData.location.zip}
				error={errors.zip}
			/>
		</Form>
	</div>
	<BottomButton activeDot={2} totalDots={4} formID="form" buttonText="Next" />
</Subpage>
