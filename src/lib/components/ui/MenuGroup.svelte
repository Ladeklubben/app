<script lang="ts">
    // MenuGroup.svelte
    export let title: string;
</script>

<div class="menu-group">
    <h2>{title}</h2>
    <div class="content">
        <slot />
    </div>
</div>

<style>
    .menu-group {
        border: 1px solid var(--lk-blue-800);
        border-radius: var(--border-radius);
        overflow: hidden;
        margin-bottom: 1rem;
    }

    h2 {
        font-size: 0.9rem;
        padding: 0.75rem 1rem;
        margin: 0;
        color: var(--lk-blue-100);
        border-bottom: 1px solid var(--lk-blue-800);
    }
</style>
