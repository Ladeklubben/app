<script lang="ts">
	import Form from "$lib/components/ui/Form.svelte";
    import InputField from "$lib/components/ui/InputField.svelte";
    import Button from "$lib/components/ui/Button.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { managedChargers } from "$lib/models/ManagedChargers.svelte";
	import { onMount } from "svelte";
	import Email from "~icons/mdi/email";
	import Trashcan from "~icons/mdi/trash-can-outline";
	import { validateEmail } from "$lib/services/forms";

    let charger = managedChargers.selectedCharger;
    let notifcations = $derived(charger?.notificationSetupFormatted);

    async function handleDelete(email: string) {
        try {
            console.log("Deleting notification for email:", email);
            await charger?.deleteNotification(email);
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    }

    // Add new notification email
    let inputEmail = $state("");
	let error = $state("");
    let loading = $state(false);

    async function handleSubmit(event: Event) {
        event.preventDefault();
        loading = true;
        error = "";
        if (!validateEmail(inputEmail)) {
            error = "Invalid email";
            loading = false;
            return;
        }
        try {
            await charger?.addOrUpdateNotification(inputEmail, false, false);
            inputEmail = "";
        } catch (e: any) {
            console.error(e);
            error = "Invalid email";
        } finally {
            loading = false;
        }
    }

    const gap = $derived(error ? 5 : 0);

    onMount(async() => {
        charger?.getNotificationSetup();
    })
</script>

<Subpage title="Notifications" backURL="/menu/chargers/settings">
    <Form {handleSubmit} gap={gap}>
        <InputField id="email" type="text" label="New notification email" bind:value={inputEmail} {error} />
		<Button type="submit" {loading}>Add Email</Button>
    </Form>
	{#if notifcations && notifcations.length > 0}
		{#each notifcations as card}
			<div class="flex flex-col border border-lk-blue-800 rounded-2xl mt-5 overflow-hidden">
				<div class="flex gap-5 items-center font-bold p-5  bg-lk-blue-900">
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
                            onclick={() => {
                                card.onBeginEnabled = !card.onBeginEnabled;
                                charger?.addOrUpdateNotification(card.email, card.onBeginEnabled, card.onEndEnabled);
                            }}
                        />
                    </label>

					<label class="flex items-center justify-between gap-2 w-full">
                        <span>Charging Ends</span>
                        <input
                            type="checkbox"
                            checked={card.onEndEnabled}
                            class="h-6 w-6 appearance-none rounded-md border border-lk-blue-500 bg-transparent focus:ring-lk-blue-300"
                            onclick={() => {
                                card.onEndEnabled = !card.onEndEnabled;
                                charger?.addOrUpdateNotification(card.email, card.onBeginEnabled, card.onEndEnabled);
                            }}
                        />
                    </label>
				</div>
			</div>
		{/each}
	{:else}
		<div class="w-full text-center mt-5">No notifications set up. Add an email above to receive updates when charger starts and/or ends.</div>
	{/if}
</Subpage>
