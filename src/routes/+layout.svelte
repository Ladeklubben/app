<!-- +layout.svelte -->
<script lang="ts">
    import { i18n } from "$lib/i18n";
    import { ParaglideJS } from "@inlang/paraglide-sveltekit";
    import TabBar from "$lib/components/ui/TabBar.svelte";
    import { checkLoginStatus } from "$lib/services/auth";
    import { onMount } from "svelte";
    import { showTabBar } from "$lib/services/layout";
    import '../app.css';
    
    let { children } = $props();
    let loginCheckDone = false;
    
    onMount(async () => {
        await checkLoginStatus();
        loginCheckDone = true;
    });
</script>

<ParaglideJS {i18n}>
    <div class="layout-container">
        {#if loginCheckDone}
            <main style="{$showTabBar ? 'padding-bottom: 70px' : ''}">
                {@render children()}
            </main>
            {#if $showTabBar}
                <TabBar />
            {/if}
        {/if}
    </div>
</ParaglideJS>

<style>
    .layout-container {
        display: flex;
        flex-direction: column;
        min-height: 100%;
    }
    main {
        flex: 1;
        overflow-y: auto;
    }
</style>