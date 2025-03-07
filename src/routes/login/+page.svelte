<script lang="ts">
	import { goto } from "$app/navigation";
	import { forgotPasswordEmail, login } from "$lib/services/auth";
	import { showTabBar } from "$lib/services/layout";
	import { onDestroy, onMount } from "svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import Form from "$lib/components/ui/Form.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { put } from "$lib/services/api";

	let fields: { [key: string]: string } = { email: "", password: "" };
	let errors = { email: "", password: "" };
	let valid = false;
	let loading = false;

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
		if (!fields.email) {
			errors.email = "Email is required";
			valid = false;
		} else {
			errors.email = "";
		}

		if (valid) {
			try {
				await put("/user/reset_password", { email: fields.email });
				$forgotPasswordEmail = fields.email;
				goto("/login/reset-password");
			} catch (error) {
				errors.email = "Email not found";
			}
		}
		loading = false;
	}

	onMount(() => {
		$showTabBar = false;
	});
</script>

<div class="wrapper">
	<img src="/logo_white_trans.png" alt="Ladeklubben Logo" />
	<Form on:submit={handleSubmit}>
		<InputField id="email" type="email" label="Email" bind:value={fields.email} error={errors.email} />
		<InputField
			id="password"
			type="password"
			label="Password"
			bind:value={fields.password}
			error={errors.password}
		/>
		<Button type="submit" {loading}>Login</Button>
	</Form>
	<button on:click={handleForgotPassword} class="link-button">Forgot Password</button>
</div>

<style>
	.wrapper {
		align-items: center;
	}

	img {
		width: 100px;
	}

	.link-button {
		background: none;
		color: var(--lk-blue-500);
		text-decoration: underline;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
	}
</style>
