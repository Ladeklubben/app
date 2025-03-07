<script lang="ts">
    export let title: string;

</script>

<div class="card">
    <h1>{title}</h1>
    <slot></slot>
</div>

<style>
    .card {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        border-radius: var(--border-radius);
        border: 1px solid var(--lk-blue-800);
    }

    h1 {
        color: var(--lk-blue-100);
        font-size: 24px;
        margin: 0;
    }
</style>
