<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import { siteFormData } from "$lib/services/site";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import { goto } from "$app/navigation";

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
		const zipRegex = /^\d{4}$/;
		if (!$siteFormData.location.zip || !zipRegex.test($siteFormData.location.zip)) {
			newErrors.zip = "Please enter a valid 4-digit postcode";
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
		<Form {handleSubmit} id="form">
			<p>
				Use the map to select the location of your site, or enter the address manually. This is used to
				calculate energy tariffs automatically.
			</p>
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
			<InputField
				id="postCode"
				type="text"
				label="Postcode"
				bind:value={$siteFormData.location.zip}
				error={errors.zip}
			/>
		</Form>
	</div>
	<BottomButton activeDot={2} totalDots={4} formID="form" buttonText="Next" />
</Subpage>
