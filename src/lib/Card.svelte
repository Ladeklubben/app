<script lang="ts">
    export let title: string;

</script>

<div class="wrapper">
    <h1>{title}</h1>
    <slot></slot>
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        border-radius: 1.5rem;
        border: 1px solid var(--lk-blue-800);
    }

    h1 {
        color: var(--lk-blue-100);
        font-size: 1.5rem;
        margin: 0;
    }
</style>
