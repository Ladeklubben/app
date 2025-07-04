<script lang="ts">
	import { onMount } from "svelte";
	import { CapacitorBarcodeScanner } from "@capacitor/barcode-scanner";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { chargers } from "$lib/classes/Chargers.svelte";
	import { showError } from "$lib/services/dialog.svelte";
	import TextInput from "$lib/components/ui/inputs/TextInput.svelte";

	let scannedValue = $state<string>(chargers.selected?.qrCode || "");

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
		} catch (e: any) {
			console.error("QR code scanning failed:", e);

			// Check error message if code is not available
			const errorMessage = e.message || e.description || String(e);

			if (errorMessage.includes("cancelled") || errorMessage.includes("cancel")) {
				// User cancelled - don't show error
				return;
			} else if (errorMessage.includes("camera") && errorMessage.includes("permission")) {
				showError("Camera permission is required to scan QR codes.");
			} else {
				showError("Failed to scan QR code. Please try again.");
			}
		}
	}

	async function saveQRCode(qrcode: string | null) {
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
		<a class="text-lk-blue-400 font-bold" href="mailto:info@ladeklubben.dk">info@ladeklubben.dk</a>
	</p>

	<TextInput label="QR Code" bind:value={scannedValue}></TextInput>

	<button
		class="p-3 font-bold bg-lk-blue-500 border border-lk-blue-500 rounded-xl text-lk-blue-50 cursor-pointer disabled:cursor-not-allowed w-full"
		onclick={scanQRCode}
	>
		Scan QR Code
	</button>

	<a
		class="p-3 font-bold rounded-xl text-lk-blue-400 cursor-pointer disabled:cursor-not-allowed w-full text-center"
		href="https://wiki.ladeklubben.dk/books/brug-din-lader-med-ladeklubben/page/qr-tag"
	>
		Read Guide
	</a>
</Subpage>
