<!-- +layout.svelte -->
<script>
    import TabBar from "$lib/components/ui/TabBar.svelte";
    import { page } from "$app/stores";
    import { checkLoginStatus } from "$lib/services/auth";
    import { onMount } from "svelte";
    import { showTabBar } from "$lib/services/layout";
    import "$lib/styles.css";

    let loginCheckDone = false;
    onMount(async () => {
        await checkLoginStatus();
        loginCheckDone = true;
    });

</script>

<div class="layout-container">
    {#if loginCheckDone}
        <main>
            <slot />
        </main>
        {#if $showTabBar}
            <TabBar />
        {/if}
    {/if}
</div>

<style>
    .layout-container {
        display: flex;
        flex-direction: column;
        min-height: 100%;
    }

    main {
        flex: 1;
        overflow-y: auto;
        padding-bottom: 70px;
    }
</style>
