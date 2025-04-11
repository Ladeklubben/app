<script lang="ts">
    import type { ChargerStation } from "$lib/types/chargers";
    import WaypointCard from "./WaypointCard.svelte";
    
    export let chargers: ChargerStation[] = [];
    export let onNavigate: (id: string) => void = () => {};
</script>

<div class="flex overflow-x-auto gap-5 py-5 px-0 w-full no-scrollbar scroll-smooth snap-x snap-mandatory">
    {#each chargers as charger, index (charger.stationid)}
        <div class="snap-center w-10/12 flex-shrink-0 {index === 0 ? 'ml-10' : ''}">
            <WaypointCard 
                {charger} 
                onNavigate={() => onNavigate(charger.stationid)} 
            />
        </div>
    {/each}
</div>