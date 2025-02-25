<script lang="ts">
    export let id: string;
    export let type: string = "text";
    export let label: string;
    export let value: string;
    export let error: string;
</script>

<label for={id}>{label}</label>
<input
    {type}
    {id}
    name={id}
    bind:value
    class:error-border={error}
/>
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
</style>
