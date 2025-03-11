<!-- ResetPassword.svelte -->
<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { put } from "$lib/services/api";
	import { forgotPasswordEmail } from "$lib/services/auth";
	import { goto } from "$app/navigation";

	let code = $state("");
	let error = $state("");
	let loading = $state(false);

	async function handleSubmit(event: Event) {
		loading = true;

		if (!code) {
			error = "Code is required";
			loading = false;
			return;
		} else {
			error = "";
		}

		try {
			await put("/user/validate_password_code", {
				email: $forgotPasswordEmail,
				code: parseInt(code, 10),
			});
			goto("/login/new-password");
		} catch (e: any) {
			console.error(e);
			error = "Invalid code";
		} finally {
			loading = false;
		}
	}
</script>

<Subpage title="Reset Password">
	<p>Enter the code you received in your email to reset your password.</p>

	<Form {handleSubmit}>
		<InputField id="code" type="number" label="Code from email" bind:value={code} {error} />

		<Button type="submit" {loading}>Reset Password</Button>
	</Form>
</Subpage>
