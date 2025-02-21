<script lang="ts">
    import { logout } from "$lib/services/auth";
    import { currentUser } from "$lib/services/auth";
</script>

<h1>Settings</h1>
{$currentUser?.email}
<button on:click={logout}>Logout</button>


<style>
    h1 {
        color: var(--lk-blue-100);
    }
</style>
