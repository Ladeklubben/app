<script lang="ts">
    export let id: string;
    export let type: string = "text";
    export let label: string;
    export let value: string | boolean;
    export let error: string;

    // Type guard to ensure value is boolean for checkboxes
    let isChecked: boolean | null = null;
    if (type === "checkbox" && typeof value === "boolean") {
        isChecked = value;
    }
</script>

{#if type === "checkbox"}
    <div class="check-wrapper">
        <label for={id}>{label}</label>
        <input
            type="checkbox"
            {id}
            name={id}
            bind:checked={isChecked}
            class:error-border={error}
        />
    </div>
{:else}
    <label for={id}>{label}</label>
    <input {type} {id} name={id} bind:value class:error-border={error} />
{/if}
{#if error}
    <span class="error-text">{error}</span>
{/if}

<style>
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

    .error-border {
        border-color: var(--lk-red-700);
    }

    .error-text {
        color: var(--lk-red-700);
        text-align: center;
        margin: -10px 0px;
    }

    /* Hide the up and down arrows in the number input field */
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .check-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .check-wrapper input[type="checkbox"] {
        width: 1.5rem;
        height: 1.5rem;
        appearance: none;
        background-color: transparent;
        border: 1px solid var(--lk-blue-500);
        border-radius: 0.25rem;
        display: grid;
        place-content: center;
    }

    .check-wrapper input[type="checkbox"]::before {
        content: "";
        width: 1rem;
        height: 1rem;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 20%, 80% 0, 43% 62%);
        background-color: var(--lk-blue-400);
        transform: scale(0);
        transition: transform 0.2s ease-in-out;
    }

    .check-wrapper input[type="checkbox"]:checked::before {
        transform: scale(1);
    }

    .check-wrapper input[type="checkbox"]:focus {
        outline: 2px solid var(--lk-blue-300);
    }
</style>
