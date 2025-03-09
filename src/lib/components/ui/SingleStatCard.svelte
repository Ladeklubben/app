<script lang="ts">
	import { fade } from "svelte/transition";
	interface Props {
		description: string;
		stat: string;
		unit: string;
	}

	let { description, stat, unit }: Props = $props();
</script>

<div class="wrapper">
	<span in:fade={{ duration: 300 }} style="text-align: center;">
		{description}
		<!-- prettier-ignore -->
		<h2>
			{stat}<span class="unit">{unit}</span>
		</h2>
	</span>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 32px;
		align-items: center;
		border-radius: var(--border-radius);
		border: 1px solid var(--lk-blue-800);
		background: linear-gradient(to right, var(--lk-blue-400), var(--lk-blue-800));
	}

	h2 {
		font-size: 64px;
		font-weight: bold;
		color: var(--lk-blue-100);
		margin: 0;
		margin-bottom: -10px;
	}

	.unit {
		font-size: 16px;
		font-weight: normal;
	}
</style>
