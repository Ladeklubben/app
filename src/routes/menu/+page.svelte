<script lang="ts">
    import { logout } from "$lib/services/auth";
    import { currentUser } from "$lib/services/auth";
    import MenuItem from "$lib/components/ui/MenuItem.svelte";
    import MenuGroup from "$lib/components/ui/MenuGroup.svelte";
</script>

<div class="menu-page">
    <div class="profile-section">
        <div class="avatar">
            <!-- Add User SVG icon here -->
        </div>
        <p class="email">{$currentUser?.email}</p>
        <button class="edit-profile">Edit Profile</button>
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

        <button class="logout-button" on:click={logout}>
            <span class="icon">🚪</span>
            <span>Log out</span>
        </button>
    </div>
</div>

<style>
    .menu-page {
        max-width: 600px;
        margin: 0 auto;
        padding: 1rem;
    }

    .profile-section {
        background: white;
        padding: 2rem;
        text-align: center;
        margin-bottom: 1rem;
        border-radius: var(--border-radius);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .avatar {
        width: 5rem;
        height: 5rem;
        background: var(--avatar-bg, #e0e0e0);
        border-radius: 50%;
        margin: 0 auto 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .email {
        color: var(--text-color, #666);
        margin: 0.5rem 0;
    }

    .edit-profile {
        background: var(--button-bg, #f5f5f5);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 0.9rem;
    }

    .edit-profile:hover {
        background: var(--button-hover-bg, #e0e0e0);
    }

    .settings-container {
        margin-top: 2rem;
    }

    .logout-button {
        width: 100%;
        background: white;
        border: none;
        padding: 1rem;
        margin-top: 1rem;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: var(--danger-color, #dc3545);
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .logout-button:hover {
        background: var(--danger-hover-bg, #fff5f5);
    }
</style>
