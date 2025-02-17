<script lang="ts">
    import { logout } from "$lib/stores/auth";
    import { currentUser } from "$lib/stores/auth";
</script>

<h1>Settings</h1>
{$currentUser?.email}
<button on:click={logout}>Logout</button>


<style>
    h1 {
        color: var(--lk-blue-100);
    }
</style>
