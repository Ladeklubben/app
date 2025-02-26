<!-- ResetPassword.svelte -->
<script lang="ts">
    import Subpage from "$lib/components/ui/Subpage.svelte";
    import InputField from "$lib/components/ui/InputField.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { put } from "$lib/services/api";
    import { forgotPasswordEmail } from "$lib/services/auth";
    import { goto } from "$app/navigation";

    let code = "";
    let error = "";
    let loading = false;

    async function handleSubmit(event: Event) {
        loading = true;

        if (!code) {
            error = "Code is required";
            return;
        } else {
            error = "";
        }

        try {
            loading = true;
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

    <form on:submit|preventDefault={handleSubmit} novalidate>
        <InputField
            id="code"
            type="number"
            label="Code from email"
            bind:value={code}
            {error}
        />

        <Button type="submit" {loading}>Reset Password</Button>
    </form>
</Subpage>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
</style>
