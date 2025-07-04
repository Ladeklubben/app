<script lang="ts">
	import { goto } from "$app/navigation";
	import { forgotPasswordEmail, login } from "$lib/services/auth";
	import { showTabBar } from "$lib/services/layout";
	import { onMount } from "svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { put } from "$lib/services/api";
	import { validateEmail } from "$lib/services/forms";
	import TextInput from "$lib/components/ui/inputs/TextInput.svelte";

	let fields: { [key: string]: string } = $state({ email: "", password: "" });
	let errors = $state({ email: "", password: "" });
	let valid = false;
	let loading = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		valid = true;
		loading = true;

		// Validate email
		if (!fields.email) {
			errors.email = "Email is required";
			valid = false;
		} else {
			errors.email = "";
		}

		// Validate password
		if (!fields.password) {
			errors.password = "Password is required";
			fields.password = "";
			valid = false;
		} else {
			errors.password = "";
		}

		// Login
		// #TODO handle network errors
		if (valid) {
			if (await login(fields.email, fields.password, false)) {
				$showTabBar = true;
				goto("/");
			} else {
				errors.email = "Invalid email or password";
				errors.password = "Invalid email or password";
			}
		}
		loading = false;
	}

	async function handleForgotPassword() {
		valid = true;
		loading = true;

		// Validate email
		if (!fields.email || fields.email === "") {
			errors.email = "Email is required";
			errors.password = "";
			valid = false;
		} else if (!validateEmail(fields.email)) {
			errors.email = "Invalid email";
			errors.password = "";
			valid = false;
		} else {
			errors.email = "";
			errors.password = "";
		}

		if (valid) {
			try {
				await put("/user/reset_password", { email: fields.email });
				$forgotPasswordEmail = fields.email;
				goto("/login/reset-password");
			} catch (error) {
				errors.email = "Email not found";
				errors.password = "";
			}
		}
		loading = false;
	}

	onMount(() => {
		$showTabBar = false;
	});
</script>

<div class="wrapper items-center">
	<img src="/logo_white_trans.png" alt="Ladeklubben Logo" class="w-24" />
	<Form {handleSubmit} gap={0}>
		<TextInput id="email" label="Email" bind:value={fields.email} error={errors.email} />
		<TextInput
			id="password"
			label="Password"
			bind:value={fields.password}
			error={errors.password}
			type="password"
		/>
		<Button type="submit" {loading}>Login</Button>
	</Form>
	<button onclick={handleForgotPassword} class="bg-none text-lk-blue-500 underline border-0 p-0 cursor-pointer">
		Forgot Password
	</button>
</div>
