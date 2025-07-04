<!-- ResetPassword.svelte -->
<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import TextInput from "$lib/components/ui/inputs/TextInput.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { put } from "$lib/services/api";
	import { forgotPasswordEmail, login } from "$lib/services/auth";
	import { MD5 } from "crypto-js";
	import { goto } from "$app/navigation";
	import { validatePassword } from "$lib/services/forms";

	let fields: { [key: string]: string } = $state({
		newPassword: "",
		newPasswordRepeat: "",
	});
	let errors = $state({ newPassword: "", newPasswordRepeat: "" });
	let valid = false;
	let loading = $state(false);
	let status = $state({ success: true, message: "" });

	async function handleSubmit(event: Event) {
		event.preventDefault();
		valid = true;
		loading = true;

		// Basic validation
		errors.newPassword = validatePassword(fields.newPassword);
		if (errors.newPassword) {
			valid = false;
		}

		if (!fields.newPasswordRepeat) {
			errors.newPasswordRepeat = "This field is required";
			valid = false;
		} else if (fields.newPassword !== fields.newPasswordRepeat) {
			errors.newPasswordRepeat = "New passwords do not match";
			valid = false;
		} else {
			errors.newPasswordRepeat = "";
		}

		if (valid) {
			try {
				if ($forgotPasswordEmail) {
					await put("/user/set_new_password", {
						email: $forgotPasswordEmail,
						password: MD5(fields.newPassword).toString(),
					});
					await login($forgotPasswordEmail, fields.newPassword, false);
					goto("/");
				} else {
					throw new Error("Email not provided");
				}
			} catch (error: any) {
				console.log("Error occurred:", error.message);
				status = { success: false, message: error.message };
			} finally {
				loading = false;
				errors = {
					newPassword: "",
					newPasswordRepeat: "",
				};
				fields.newPassword = "";
				fields.newPasswordRepeat = "";
			}
		}
		loading = false;
	}
</script>

<Subpage title="Reset Password" backURL="/login/reset-password">
	<Form {handleSubmit} gap={0}>
		<p class="mb-4">Password needs to be at least 6 characters, 1 big letter, 1 small letter and 1 number.</p>

		<TextInput
			id="new-password"
			label="New Password"
			bind:value={fields.newPassword}
			error={errors.newPassword}
		/>

		<TextInput
			id="new-password-repeat"
			label="Repeat New Password"
			bind:value={fields.newPasswordRepeat}
			error={errors.newPasswordRepeat}
		/>

		<Button type="submit" {loading}>Reset Password</Button>

		{#if status.message}
			<p class=" text-center mb-0 {status.success ? 'text-lk-blue-400' : 'text-lk-red-600'}">
				{status.message}
			</p>
		{/if}
	</Form>
</Subpage>
