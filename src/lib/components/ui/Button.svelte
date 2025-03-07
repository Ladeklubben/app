<script lang="ts">
    export let type: "button" | "submit" | "reset" = "button";
    export let loading: boolean = false;
    export let disabled: boolean = false;
</script>

<button type={type} class:btnLoad={loading} disabled={disabled || loading}>
    {#if loading}
        Loading...
    {:else}
        <slot />
    {/if}
</button>

<style>
    button {
        padding: 16px;
        font-size: 20px;
        font-weight: bold;
        background-color: var(--lk-blue-500);
        border: 1px solid var(--lk-blue-500);
        border-radius: var(--border-radius);
        color: var(--lk-blue-50);
        margin-top: 16px;
        cursor: pointer;
    }

    .btnLoad {
        background-color: var(--lk-blue-800);
        border-color: var(--lk-blue-800);
        cursor: not-allowed;
    }
</style>