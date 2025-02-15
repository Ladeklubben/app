<!-- PhaseBar.svelte -->
<script>
  export let label = '';
  export let percentage = 0;
</script>

<div class="phase-bar">
  <div class="bar-container">
    <span class="label">{label}</span>
    <div class="progress-bar" style="width: {percentage}%"></div>
    <span class="percentage">{percentage}%</span>
  </div>
</div>

<style>
  .phase-bar {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .bar-container {
    position: relative;
    flex-grow: 1;
    background-color: var(--lk-blue-800);
    border-radius: 1rem;
    overflow: hidden;
    height: 60px;
  }

  .progress-bar {
    height: 100%;
    background-color: var(--lk-blue-500);
    border-radius: 1rem;
    transition: width 0.3s ease;
  }

  .label {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--lk-blue-100);
    font-size: 1.2rem;
    font-weight: bold;
  }

  .percentage {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--lk-blue-100);
    font-size: 1.2rem;
  }
</style>