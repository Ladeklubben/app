<script lang="ts">
    import { logout } from "$lib/services/auth";
    import { currentUser } from "$lib/services/auth";
    import MenuItem from "$lib/components/ui/MenuItem.svelte";
    import MenuGroup from "$lib/components/ui/MenuGroup.svelte";
</script>

<div class="wrapper">
    <div class="profile-section">
        <div class="avatar">
            <!-- Add User SVG icon here -->
        </div>
        <p class="email">{$currentUser?.email}</p>
        <button class="logout-btn" on:click={logout}>Log Out</button>
    </div>

    <div class="settings-container">
        <MenuGroup title="Account">
            <MenuItem icon="📍" text="My Stores" />
            <MenuItem icon="🔔" text="Notifications" hasToggle={true} />
            <MenuItem icon="🔒" text="Security" />
        </MenuGroup>

        <MenuGroup title="Support">
            <MenuItem icon="❓" text="Help Center" />
            <MenuItem icon="✉️" text="Contact Us" />
        </MenuGroup>
    </div>
</div>

<style>
    .profile-section {
        padding: 2rem;
        text-align: center;
        margin-bottom: 1rem;
        border-radius: var(--border-radius);
        border: 1px solid var(--lk-blue-800);
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        align-items: center;
    }

    .avatar {
        width: 5rem;
        height: 5rem;
        background: var(--avatar-bg, #e0e0e0);
        border-radius: 50%;
        margin: 0 auto 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .email {
        color: var(--lk-blue-100);
        margin: 0.5rem 0;
    }

    .logout-btn {
        background: var(--lk-blue-100);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 0.9rem;
    }
</style>
