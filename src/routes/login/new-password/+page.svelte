<!-- ResetPassword.svelte -->
<script lang="ts">
    import Subpage from "$lib/components/ui/Subpage.svelte";
    import InputField from "$lib/components/ui/InputField.svelte";
    import Form from "$lib/components/ui/Form.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { put } from "$lib/services/api";
    import { forgotPasswordEmail, login } from "$lib/services/auth";
    import { MD5 } from "crypto-js";
    import { goto } from "$app/navigation";

    let fields: { [key: string]: string } = {
        newPassword: "",
        newPasswordRepeat: "",
    };
    let errors = { newPassword: "", newPasswordRepeat: "" };
    let valid = false;
    let loading = false;
    let status = { success: true, message: "" };

    function validatePassword(password: string): string {
        if (password.length < 6) {
            return "Password must be at least 6 characters";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter";
        }
        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number";
        }
        return "";
    }

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

<Subpage title="Reset Password">
    <Form on:submit={handleSubmit}>
        <p>
            Password needs to be at least 6 characters, 1 big letter, 1 small
            letter and 1 number.
        </p>

        <InputField
            id="new-password"
            type="text"
            label="New Password"
            bind:value={fields.newPassword}
            error={errors.newPassword}
        />

        <InputField
            id="new-password-repeat"
            type="text"
            label="Repeat New Password"
            bind:value={fields.newPasswordRepeat}
            error={errors.newPasswordRepeat}
        />

        <Button type="submit" {loading}>Reset Password</Button>

        {#if status.message}
            <p
                class="status"
                style="color: {status.success
                    ? 'var(--lk-blue-400)'
                    : 'var(--lk-red-700)'}"
            >
                {status.message}
            </p>
        {/if}
        </Form>
</Subpage>

<style>
    .status {
        text-align: center;
        margin-bottom: 10px;
    }
</style>
