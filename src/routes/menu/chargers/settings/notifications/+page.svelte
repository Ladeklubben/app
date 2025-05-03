<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { selectedChargerStore } from "$lib/models/ManagedChargers";
	import Email from "~icons/mdi/email";
	import Trashcan from "~icons/mdi/trash-can-outline";

	const notifcations = $derived($selectedChargerStore?.getFormattedNotificationSetup());

    async function handleDelete(email: string) {
        try {
            console.log("Deleting notification for email:", email);
            await $selectedChargerStore?.deleteNotification(email);
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    }
</script>

<Subpage title="Notifications" backURL="/menu/chargers/settings">
	{#if notifcations}
		{#each notifcations as card}
			<div class="flex flex-col border border-lk-blue-800 rounded-2xl">
				<div class="flex gap-5 items-center font-bold p-5  bg-lk-blue-900 rounded-t-2xl">
					<Email />
					{card.email}
					<Trashcan class="ml-auto" onclick={() => handleDelete(card.email)}/>
				</div>

                <div class="flex flex-col gap-4 w-full p-5">
                    <label class="flex items-center justify-between gap-2 w-full">
                        <span>Charging Start</span>
                        <input
                            type="checkbox"
                            checked={card.onBeginEnabled}
                            class="h-6 w-6 appearance-none rounded-md border border-lk-blue-500 bg-transparent focus:ring-lk-blue-300"
                        />
                    </label>

					<label class="flex items-center justify-between gap-2 w-full">
                        <span>Charging Ends</span>
                        <input
                            type="checkbox"
                            checked={card.onEndEnabled}
                            class="h-6 w-6 appearance-none rounded-md border border-lk-blue-500 bg-transparent focus:ring-lk-blue-300"
                        />
                    </label>
				</div>
			</div>
		{/each}
	{:else}
		<div>No notifications available</div>
	{/if}
</Subpage>
