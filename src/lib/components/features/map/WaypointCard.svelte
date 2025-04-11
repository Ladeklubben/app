<script lang="ts">
    import Zap from "~icons/mdi/lightning-bolt-outline";
    import Battery from "~icons/mdi/battery-charging-50";
    import type { ChargerStation } from "$lib/types/chargers";
    
    export let charger: ChargerStation;
    export let onNavigate: () => void;
</script>

<div class="flex-shrink-0 w-56 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
    <div class="p-3">      
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center text-green-600 font-bold">
                <span class="text-lg">${charger.prices.nominal}</span>
                <span class="text-xs ml-1">/kWh</span>
            </div>
            <div class="bg-blue-100 text-blue-800 rounded-md px-2 py-1 text-sm flex items-center">
                <span>10 km</span>
            </div>
        </div>
        
        <div class="flex justify-between text-xs text-gray-500 mb-3">
            <div class="flex items-center">
                <Battery style="font-size: 12px;" />
                <span>{charger.online}</span>
            </div>
            <div class="flex items-center">
                <Zap style="font-size: 12px;" />
                <span>{charger.type.power}kW</span>
            </div>
        </div>
        
        <button 
            on:click={onNavigate}
            class="w-full border border-black text-black hover:bg-black hover:text-white transition-colors py-1.5 rounded-lg text-sm font-medium"
        >
            Directions
        </button>
    </div>
</div>