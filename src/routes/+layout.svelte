<!-- +layout.svelte -->
<script>
    import TabBar from "$lib/components/ui/TabBar.svelte";
    import { page } from "$app/stores";
    import { checkLoginStatus } from "$lib/services/auth";
    import { onMount } from "svelte";

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
        {#if $page.url.pathname !== "/login"}
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
</style>
