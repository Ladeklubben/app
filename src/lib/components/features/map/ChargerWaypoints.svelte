<script lang="ts">
    import type { ChargerStation } from "$lib/types/chargers";
    import WaypointCard from "./WaypointCard.svelte";
    
    export let chargers: ChargerStation[] = [];
    export let onNavigate: (id: string) => void = () => {};
</script>

<div class="flex overflow-x-auto gap-5 py-5 px-5 w-full no-scrollbar">
    {#each chargers as charger (charger.stationid)}
        <WaypointCard 
            {charger} 
            onNavigate={() => onNavigate(charger.stationid)} 
        />
    {/each}
</div>