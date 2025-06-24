<script lang="ts">
	import { dialogState, closeDialog } from "$lib/services/dialog";
	import { fade, scale } from "svelte/transition";

	// Color classes for different dialog types
	const titleColors = {
		error: "text-lk-red-600",
		success: "text-lk-blue-500",
		warning: "text-amber-600",
		info: "text-blue-600",
	};

	const borderColors = {
		error: "border-lk-red-600",
		success: "border-lk-blue-500",
		warning: "border-amber-600",
		info: "border-blue-600",
	};

	const buttonColors = {
		error: "bg-lk-red-600 hover:bg-lk-red-700 focus:ring-lk-red-500",
		success: "bg-lk-blue-500 hover:bg-lk-blue-700 focus:ring-lk-blue-500",
		warning: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
		info: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
	};

	// Handle keyboard events
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			closeDialog();
		}
	}
</script>

<!-- Global Dialog -->
{#if dialogState.isOpen}
	<div
		class="fixed inset-0 bg-black/25 flex items-center justify-center z-50 p-4"
		role="button"
		tabindex="0"
		aria-label="Close dialog"
		onclick={closeDialog}
		onkeydown={handleKeydown}
		transition:fade={{ duration: 200 }}
	>
		<div
			class="flex flex-col gap-4 p-8 bg-white rounded-2xl max-w-md w-full transform border-4 {borderColors[dialogState.type]}"
			role="dialog"
			tabindex="-1"
			aria-labelledby="dialog-title"
			aria-describedby="dialog-content"
			onclick={(e) => e.stopPropagation()}
			onkeydown={handleKeydown}
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<!-- Dialog Header -->
			<div class="flex items-center">
				<h3 id="dialog-title" class="font-bold text-xl {titleColors[dialogState.type]}">
					{dialogState.title}
				</h3>
			</div>

			<!-- Dialog Content -->
			<p id="dialog-content" class="pb-2 text-lk-blue-950">
				{dialogState.message}
			</p>

			<!-- Dialog Footer -->
			<div class="flex w-full">
				<button
					class="px-4 py-2 w-full text-white font-bold rounded-xl {buttonColors[dialogState.type]}"
					onclick={closeDialog}
				>
					OK
				</button>
			</div>
		</div>
	</div>
{/if}
