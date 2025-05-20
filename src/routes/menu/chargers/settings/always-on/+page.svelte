<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { managedChargers } from "$lib/models/ManagedChargers.svelte";
    import Trashcan from "~icons/mdi/trash-can-outline";
    import PlusClock from "~icons/mdi/clock-plus-outline";


	const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

</script>

<Subpage title="Always On" backURL="/menu/chargers/settings">
	{#each weekdays as day}
		<div class="w-full flex flex-col gap-4 p-4 border border-lk-blue-800 rounded-2xl">
            <div class="flex flex-row justify-between items-center">
                <span class="font-bold">{day}</span>
                <button class="bg-lk-blue-800 text-white rounded-full p-2">
                    <PlusClock onclick={() => console.log("Delete")}/>
                </button>
            </div>
			
            <div class="w-full flex flex-row gap-4 items-center">
                <div class="flex-1 text-center p-2 border border-lk-blue-800 rounded-2xl">13:00</div>
                <span>to</span>
                <div class="flex-1 text-center p-2 border border-lk-blue-800 rounded-2xl">17:00</div>
                <Trashcan onclick={() => console.log("Delete")}/>
                
            </div>
		</div>
	{/each}
</Subpage>
