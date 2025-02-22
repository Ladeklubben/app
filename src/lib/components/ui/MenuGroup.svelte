<script lang="ts">
    // MenuGroup.svelte
    export let title: string;
</script>

<div class="settings-group">
    <h2>{title}</h2>
    <div class="content">
        <slot />
    </div>
</div>

<style>
    .settings-group {
        border-radius: var(--border-radius);
        overflow: hidden;
        margin-bottom: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    h2 {
        font-size: 0.9rem;
        padding: 0.75rem 1rem;
        margin: 0;
        background: var(--group-header-bg, #f5f5f5);
        color: var(--group-header-color, #666);
        border-bottom: 1px solid var(--border-color, #eee);
    }
</style>
