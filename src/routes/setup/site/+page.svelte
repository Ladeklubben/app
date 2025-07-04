<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import { siteFormData, resetSiteFormData } from "$lib/services/site";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import TextInput from "$lib/components/ui/inputs/TextInput.svelte";

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

<Subpage title="Add Site" backURL="/">
	<div id="height-check">
		<Form {handleSubmit} id="form">
			<p>
				A site is a physical location, like a home, summer house, office or other property, where you have a
				power meter installed. You can add multiple sites to your account.
			</p>
			<TextInput id="name" label="Site Name" bind:value={$siteFormData.name} error={errors.name} /> 
		</Form>
	</div>
	<BottomButton activeDot={1} totalDots={4} formID="form" buttonText="Next" />
</Subpage>
