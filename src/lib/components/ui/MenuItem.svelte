<script lang="ts">
	let { text, hasToggle = false, children } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="menu-item">
	<div class="menu-item-content">
		{@render children?.()}
		<span class="text">{text}</span>
	</div>
	{#if hasToggle}
		<label class="toggle">
			<input type="checkbox" />
			<span class="slider"></span>
		</label>
	{:else}
		<span class="chevron">›</span>
	{/if}
</div>

<style>
	.menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
		border-bottom: 1px solid var(--lk-blue-800);
		cursor: pointer;
	}
	.menu-item:last-child {
		border-bottom: none;
	}
	.menu-item-content {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.text {
		color: var(--lk-blue-100);
	}

	.chevron {
		color: var(--lk-blue-100);
		font-size: 20px;
	}

	.toggle {
		position: relative;
		display: inline-block;
		width: 48px;
		height: 24px;
	}

	.toggle input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--lk-blue-100);
		border-radius: 16px;
		transition: 0.3s;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 18px;
		width: 18px;
		left: 4px;
		bottom: 4px;
		background-color: var(--lk-blue-400);
		border-radius: 50%;
		transition: 0.3s;
	}

	input:checked + .slider {
		background-color: var(--lk-green-200);
	}

	input:checked + .slider:before {
		transform: translateX(24px);
		background-color: var(--lk-green-700);
	}
</style>
