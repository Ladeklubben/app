<!-- ResetPassword.svelte -->
<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { put } from "$lib/services/api";
	import { forgotPasswordEmail } from "$lib/services/auth";
	import { goto } from "$app/navigation";
	import NumberInput from "$lib/components/ui/inputs/NumberInput.svelte";

	let code: number | null = $state(null);
	let error: string = $state("");
	let loading: boolean = $state(false);

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
			// Normalize email before use
			const email = (($forgotPasswordEmail as string | null) || "").trim().toLowerCase();
			$forgotPasswordEmail = email;
			await put("/user/validate_password_code", {
				email: email,
				code: code,
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

<Subpage title="Reset Password" backURL="/login">
	<p>Enter the code you received in your email to reset your password.</p>

	<Form {handleSubmit} gap={0}>
		<NumberInput id="code" label="Code from email" bind:value={code} {error} />

		<Button type="submit" {loading}>Reset Password</Button>
	</Form>
</Subpage>
