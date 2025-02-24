<!-- ResetPassword.svelte -->
<script lang="ts">
    import Subpage from "$lib/components/ui/Subpage.svelte";

    let oldPassword = "";
    let newPassword = "";
    let newPasswordRepeat = "";
    let error = "";
    let success = "";

    function handleReset(event: Event) {
        event.preventDefault();

        // Basic validation
        if (!oldPassword || !newPassword || !newPasswordRepeat) {
            error = "All fields are required.";
            return;
        }
        if (newPassword !== newPasswordRepeat) {
            error = "New passwords do not match.";
            return;
        }
        if (newPassword.length < 8) {
            error = "New password must be at least 8 characters long.";
            return;
        }

        // Here you’d typically call an API to reset the password
        // For now, simulate success
        error = "";
        success = "Password reset successfully!";
        oldPassword = "";
        newPassword = "";
        newPasswordRepeat = "";
    }
</script>

<Subpage title="Reset Password">
    <form on:submit={handleReset}>
        {#if error}
            <p class="error">{error}</p>
        {/if}
        {#if success}
            <p class="success">{success}</p>
        {/if}

        <div class="field">
            <label for="old-password">Old Password</label>
            <input
                type="password"
                id="old-password"
                bind:value={oldPassword}
                placeholder="Enter your current password"
            />
        </div>

        <div class="field">
            <label for="new-password">New Password</label>
            <input
                type="password"
                id="new-password"
                bind:value={newPassword}
                placeholder="Enter your new password"
            />
        </div>

        <div class="field">
            <label for="new-password-repeat">Repeat New Password</label>
            <input
                type="password"
                id="new-password-repeat"
                bind:value={newPasswordRepeat}
                placeholder="Repeat your new password"
            />
        </div>

        <button type="submit">Reset Password</button>
    </form>
</Subpage>

<style>
    .field {
        margin-bottom: 15px;
    }
    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
    button {
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
    .error {
        color: red;
        margin-bottom: 10px;
    }
    .success {
        color: green;
        margin-bottom: 10px;
    }
</style>
