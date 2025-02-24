<script lang="ts">
    import { goto } from "$app/navigation";
    import { login } from "$lib/services/auth";
    import { showTabBar } from "$lib/services/layout";
    import { onDestroy, onMount } from "svelte";

    let fields = { email: "", password: "" };
    let errors = { email: "", password: "" };
    let valid = false;
    let loading = false;

    const submitHandler = async () => {
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
                goto("/");
            } else {
                errors.email = "Invalid email or password";
                errors.password = "Invalid email or password";
            }
        }
        loading = false;
    };

    onMount(() => {
        $showTabBar = false;
    });

    onDestroy(() => {
        $showTabBar = true;
    });
</script>

<div class="wrapper">
    <img src="/logo_white_trans.png" alt="Ladeklubben Logo" />
    <form on:submit|preventDefault={submitHandler} novalidate>
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            bind:value={fields.email}
            class:error-border={errors.email}
        />
        {#if errors.email}
            <span class="error-text">{errors.email}</span>
        {/if}
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            name="password"
            bind:value={fields.password}
            class:error-border={errors.password}
        />
        {#if errors.password}
            <span class="error-text">{errors.password}</span>
        {/if}
        <button type="submit" class:btnLoad={loading}>
            {#if loading}
                Loading...
            {:else}
                Login
            {/if}
        </button>
    </form>
</div>

<style>
    .wrapper {
        align-items: center;
    }

    img {
        width: 100px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    label {
        font-weight: bold;
        margin: 0;
    }

    input {
        padding: 0.9rem;
        font-size: 1.1rem;
        background-color: transparent;
        border: 1px solid var(--lk-blue-500);
        border-radius: var(--border-radius);
        color: var(--lk-blue-50);
    }

    input:focus {
        border-color: var(--lk-blue-300);
        outline: none;
    }

    button {
        padding: 1rem;
        font-size: 1.2rem;
        font-weight: bold;
        background-color: var(--lk-blue-500);
        border: 1px solid var(--lk-blue-500);
        border-radius: var(--border-radius);
        color: white;
        margin-top: 1rem;
        cursor: pointer;
    }

    .btnLoad {
        background-color: var(--lk-blue-800);
        border-color: var(--lk-blue-800);
        cursor: not-allowed;
    }

    .error-border {
        border-color: var(--lk-red-700);
    }

    .error-text {
        color: var(--lk-red-700);
        text-align: center;
        margin: -10px 0px;
    }
</style>
