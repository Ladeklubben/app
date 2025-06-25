<script lang="ts">
	import { onMount } from "svelte";
	import { CapacitorBarcodeScanner } from "@capacitor/barcode-scanner";
    import type { CapacitorBarcodeScannerScanResult } from "@capacitor/barcode-scanner";
	import Subpage from "$lib/components/ui/Subpage.svelte";

    let scannedValue = $state<CapacitorBarcodeScannerScanResult | null>(null);

	onMount(async () => {
		try {
			const result = await CapacitorBarcodeScanner.scanBarcode({
				hint: 17,
				cameraDirection: 1,
				scanOrientation: 1,
			});

			if (result) {
				console.log(result.ScanResult);
				scannedValue = result;
			}
		} catch (e) {
			throw e;
		}
	});
</script>
<Subpage title="QR Code Scanner" backURL="/menu/chargers/settings">
	{scannedValue}
</Subpage>