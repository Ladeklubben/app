<!-- Subpage.svelte -->
<script>
    import { onDestroy, onMount } from "svelte";
    import { showTabBar } from "$lib/services/layout";
    export let title = ""; // Title for the subpage header

    function goBack() {
        // Navigate back to the previous page
        history.back();
    }

    onMount(() => {
        $showTabBar = false;
    });

    onDestroy(() => {
        $showTabBar = true;
    });
</script>

<div class="sub-page">
    <header>
        <button class="back-btn" on:click={goBack}>‹</button>
        <h1>{title}</h1>
        <div class="spacer"></div>
    </header>
    <div class="wrapper">
        <slot />
    </div>
</div>

<style>
    .sub-page {
        display: flex;
        flex-direction: column;
    }
    header {
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-bottom: 1px solid var(--lk-blue-800);
        position: relative;
    }
    .back-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 10px 20px 18px 10px;
        color: var(--lk-blue-50);
        font-size: 25px;
    }
    h1 {
        margin: 0;
        font-size: 20px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .spacer {
        flex-grow: 1;
    }
</style>