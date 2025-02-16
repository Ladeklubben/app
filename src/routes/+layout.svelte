<!-- +layout.svelte -->
<script>
    import TabBar from "$lib/TabBar.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { checkLoginStatus } from "$lib/stores/auth";
    import { onMount } from "svelte";

    let loginCheckDone = false;
    onMount(async () => {
        const isLoggedIn = await checkLoginStatus();
        if (!isLoggedIn) {
            goto("/login");
        }
        loginCheckDone = true;
    });
</script>

<div class="layout-container">
    {#if loginCheckDone}
        <main>
            <slot />
        </main>
        {#if $page.url.pathname !== "/login"}
            <TabBar />
        {/if}
    {/if}
</div>

<style>
    .layout-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        /* Add padding-bottom to prevent content from being hidden behind tabbar */
        padding-bottom: 60px; /* Adjust based on your tabbar height */
    }
</style>
