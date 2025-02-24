<!-- ResetPassword.svelte -->
<script lang="ts">
    import Subpage from "$lib/components/ui/Subpage.svelte";
    import InputField from "$lib/components/ui/InputField.svelte";
    import Button from "$lib/components/ui/Button.svelte";

    let fields: { [key: string]: string } = {
        oldPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
    };
    let errors = { oldPassword: "", newPassword: "", newPasswordRepeat: "" };
    let valid = false;
    let loading = false;
    let success = "";

    function handleReset(event: Event) {
        event.preventDefault();
        valid = true;

        // Basic validation
        if (!fields.oldPassword) {
            errors.oldPassword = "This fields is required";
            return;
        } else {
            errors.oldPassword = "";
        }
        if (!fields.newPassword) {
            errors.newPassword = "This fields is required";
            return;
        } else {
            errors.newPassword = "";
        }
        if (!fields.newPasswordRepeat) {
            errors.newPasswordRepeat = "This fields is required";
            return;
        } else {
            errors.newPasswordRepeat = "";
        }
        if (fields.newPassword.length < 8) {
            errors.newPassword = "Password must be at least 8 characters";
            return;
        } else {
            errors.newPassword = "";
        }
        if (fields.newPassword !== fields.newPasswordRepeat) {
            errors.newPasswordRepeat = "New passwords do not match";
            return;
        } else {
            errors.newPasswordRepeat = "";
        }

        if (valid) {
            errors = {
                oldPassword: "",
                newPassword: "",
                newPasswordRepeat: "",
            };
            success = "Password reset successfully!";
            fields.oldPassword = "";
            fields.newPassword = "";
            fields.newPasswordRepeat = "";
        }
    }

    const handleInput = (field: string) => (event: Event) => {
        fields[field] = (event.target as HTMLInputElement).value;
    };
</script>

<Subpage title="Reset Password">
    <form on:submit={handleReset} novalidate>
        <InputField
            id="old-password"
            type="password"
            label="Old Password"
            value={fields.oldPassword}
            error={errors.oldPassword}
            onInput={handleInput("oldPassword")}
        />

        <InputField
            id="new-password"
            type="password"
            label="New Password"
            value={fields.newPassword}
            error={errors.newPassword}
            onInput={handleInput("newPassword")}
        />

        <InputField
            id="new-password-repeat"
            type="password"
            label="Repeat New Password"
            value={fields.newPasswordRepeat}
            error={errors.newPasswordRepeat}
            onInput={handleInput("newPasswordRepeat")}
        />

        <Button type="submit" {loading}>Reset Password</Button>

        {#if success}
            <p class="success">{success}</p>
        {/if}
    </form>
</Subpage>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
    .success {
        color: var(--lk-blue-400);
        text-align: center;
        margin-bottom: 10px;
    }
</style>
