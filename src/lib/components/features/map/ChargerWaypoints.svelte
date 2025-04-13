<script lang="ts">
    import type { ChargerStation } from "$lib/types/chargers";
    import WaypointCard from "./WaypointCard.svelte";
    import { pos, calculateDistance } from "$lib/services/map";
    
    export let chargers: ChargerStation[] = [];
    export let onNavigate: (id: string) => void = () => {};
    
    function getChargerDistance(charger: ChargerStation): number {
        if (!$pos) return 0;
        
        return calculateDistance(
            $pos.coords.latitude,
            $pos.coords.longitude,
            charger.location.latitude,
            charger.location.longitude
        );
    }
</script>

<div class="flex overflow-x-auto gap-5 py-5 px-0 w-full no-scrollbar scroll-smooth snap-x snap-mandatory">
    {#each chargers as charger, index (charger.stationid)}
        <div class="snap-center w-3/4 flex-shrink-0 {index === 0 ? 'ml-10' : ''} max-w-lg">
            <WaypointCard 
                {charger} 
                onNavigate={() => onNavigate(charger.stationid)}
                distance={getChargerDistance(charger)}
            />
        </div>
    {/each}
</div>