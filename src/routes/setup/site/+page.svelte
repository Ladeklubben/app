<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import { siteFormData, resetSiteFormData } from "$lib/services/site";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	let errors = {
		name: "",
	};

	async function handleSubmit(event: Event) {
		event.preventDefault();
		console.log($siteFormData);
		goto("/setup/site/location");
	}

	onMount(() => {
		resetSiteFormData();
	});
</script>

<Subpage title="Add Site">
	<Form {handleSubmit} id="siteForm">
		<p>
			A site is a physical location, like a home, summer house, office or other property, where you have a power
			meter installed. You can add multiple sites to your account.
		</p>

		<InputField id="name" type="text" label="Site Name" bind:value={$siteFormData.name} error={errors.name} />
	</Form>

	<BottomButton formID="siteForm" buttonText="Next" />
</Subpage>
