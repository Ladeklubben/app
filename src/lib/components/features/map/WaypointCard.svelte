<script lang="ts">
    import Zap from "~icons/mdi/lightning-bolt-outline";
    import Battery from "~icons/mdi/battery-charging-50";
    import type { ChargerStation } from "$lib/types/chargers";
    import Glass from "$lib/components/ui/Glass.svelte";

    export let charger: ChargerStation;
    export let onNavigate: () => void;
    export let distance: number = 0; // Distance in kilometers, default to 0
</script>

<Glass>
    <div class="p-4">
        <div class="flex items-center justify-between mb-3 pb-2">
            <div class="flex items-end text-lk-blue-50 font-bold">
                <span class="text-3xl">{charger.prices.nominal}</span>
                <span class="text-lg font-light ml-2">
                    <span class="font-bold">DKK</span>/kWh
                </span>
            </div>
            <div class="bg-lk-green-400 text-lk-green-900 font-bold rounded-md px-2 py-1 text-sm flex items-center backdrop-blur-sm">
                <span>{distance.toFixed(1)} km</span>
            </div>
        </div>

        <!-- <div class="flex justify-between text-xs text-lk-blue-50 mb-3">
            <div class="flex items-center gap-1">
                <Zap style="font-size: 14px;" />
                <span>{charger.type.power}kW</span>
            </div>

            <div class="flex items-center gap-1">
                <Battery style="font-size: 14px;" />
                <span>{charger.online?.[1]}</span>
            </div>
        </div> -->

        <button
            on:click={onNavigate}
            class="w-full bg-lk-blue-200 backdrop-blur-sm border border-lk-blue-800 text-gray-800 transition-all py-2 rounded-2xl text-md font-medium shadow-sm"
        >
            Directions
        </button>
    </div>
</Glass>