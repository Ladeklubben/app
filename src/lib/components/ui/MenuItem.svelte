<script lang="ts">
    import { createEventDispatcher } from "svelte";

    // MenuItem.svelte
    export let text: string;
    export let hasToggle = false;

    const dispatch = createEventDispatcher();

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="menu-item" on:click={() => dispatch("click")}>
    <div class="menu-item-content">
        <slot></slot>
        <span class="text">{text}</span>
    </div>
    {#if hasToggle}
        <label class="toggle">
            <input type="checkbox" />
            <span class="slider"></span>
        </label>
    {:else}
        <span class="chevron">›</span>
    {/if}
</div>

<style>
    .menu-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--lk-blue-800);
        cursor: pointer;
    }
    .menu-item:last-child {
        border-bottom: none;
    }
    .menu-item-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .text {
        color: var(--lk-blue-100);
    }

    .chevron {
        color: var(--lk-blue-100);
        font-size: 1.2rem;
    }

    .toggle {
        position: relative;
        display: inline-block;
        width: 3rem;
        height: 1.5rem;
    }

    .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--lk-blue-100);
        border-radius: 1rem;
        transition: 0.3s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 1.1rem;
        width: 1.1rem;
        left: 0.2rem;
        bottom: 0.2rem;
        background-color: var(--lk-blue-400);
        border-radius: 50%;
        transition: 0.3s;
    }

    input:checked + .slider {
        background-color: var(--lk-green-200);
    }

    input:checked + .slider:before {
        transform: translateX(1.5rem);
        background-color: var(--lk-green-700);
    }
</style>
