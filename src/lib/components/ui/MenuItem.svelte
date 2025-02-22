// MenuItem.svelte
<script lang="ts">
  export let icon: string;
  export let text: string;
  export let hasToggle = false;
</script>

<div class="menu-item">
  <div class="menu-item-content">
    <span class="icon">{@html icon}</span>
    <span class="text">{text}</span>
  </div>
  {#if hasToggle}
    <label class="toggle">
      <input type="checkbox">
      <span class="slider" />
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
    padding: 1rem;
    border-bottom: 1px solid var(--border-color, #eee);
    cursor: pointer;
  }

  .menu-item:hover {
    background-color: var(--hover-bg, #f5f5f5);
  }

  .menu-item-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .text {
    color: var(--text-color, #333);
  }

  .chevron {
    color: var(--chevron-color, #666);
    font-size: 1.2rem;
  }

  .toggle {
    position: relative;
    display: inline-block;
    width: 3rem;
    height: 1.5rem;
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
    background-color: #ccc;
    border-radius: 1rem;
    transition: 0.3s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.1rem;
    width: 1.1rem;
    left: 0.2rem;
    bottom: 0.2rem;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
  }

  input:checked + .slider {
    background-color: var(--accent-color, #2196F3);
  }

  input:checked + .slider:before {
    transform: translateX(1.5rem);
  }
</style>