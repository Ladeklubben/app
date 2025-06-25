<script lang="ts">
	import { onMount } from "svelte";
	import { CapacitorBarcodeScanner } from "@capacitor/barcode-scanner";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import InputField from "$lib/components/ui/InputField.svelte";
	import { chargers } from "$lib/classes/Chargers.svelte";
	import { showError } from "$lib/services/dialog.svelte";

	let scannedValue = $state<string | null>(chargers.selected?.qrCode || null);

	async function scanQRCode() {
		try {
			const result = await CapacitorBarcodeScanner.scanBarcode({
				hint: 0,
				cameraDirection: 1,
				scanOrientation: 1,
			});

			if (result) {
				console.info("QR scanned: ", result.ScanResult);
				scannedValue = result.ScanResult;
			}
		} catch (e) {
			throw e;
		}
	}

    async function saveQRCode(qrcode: string | null ) {
        if (!chargers.selected) {
            showError("No charger selected, so the QR code was not saved.");
            return;
        }
        if (!qrcode) {
            qrcode = "";
        }
        await chargers.selected.putQRCode(qrcode);
        console.info("QR saved:", qrcode);
    }


    let initialized = false;
    onMount(() => {
        initialized = false;

        // Workaround to ensure that the effect is not triggered immediately
		setTimeout(() => {
			initialized = true;
		}, 0);
    });

    $effect(() => {
        if (initialized) {
            // TODO: Implement a debounce function to avoid rapid updates
            saveQRCode(scannedValue);
        } else {
            // Ensures the variable is a dependency of the effect
            void scannedValue;
        }
    });
</script>

<Subpage title="QR Code Scanner" backURL="/menu/chargers/settings">
	<p>
		Scan the QR code on your charger to link it for easier access by other users. Need a QR code? Contact us at
		<a class="text-lk-blue-500" href="mailto:info@ladeklubben.dk">info@ladeklubben.dk</a>
	</p>

    <InputField label="QR Code" bind:value={scannedValue}></InputField>

	<button
		class="p-3 font-bold bg-lk-blue-500 border border-lk-blue-500 rounded-xl text-lk-blue-50
	mt-4 cursor-pointer disabled:cursor-not-allowed w-full"
        onclick={scanQRCode}
	>
		Scan QR Code
	</button>
</Subpage>
