<script lang="ts">
    import { onMount } from 'svelte';
    import { prices, isLoading, error, fetchPrices } from '$lib/stores/prices';
    import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
    
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
    
    let chart: Chart | null = null;
    let chartCanvas: HTMLCanvasElement;
    
    onMount(() => {
      fetchPrices().then(() => {
        if (chart) {
          chart.destroy();
        }
    
        const ctx = chartCanvas.getContext('2d');
        chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: $prices.map(price => {
              const date = new Date(price.Timestamp * 1000);
              return date.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });
            }),
            datasets: [{
              label: 'Cost Price (VAT)',
              data: $prices.map(price => price.Costprice_VAT / 100),
              borderColor: '#5cf628',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  maxRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 6,
                  color: '#dceef1',
                  font: {
                    size: 12
                  }
                },
                border: {
                  display: false
                }
              },
              y: {
                position: 'right',
                grid: {
                  color: 'rgba(156, 163, 175, 0.1)',
                },
                ticks: {
                  padding: 8,
                  color: '#dceef1',
                  font: {
                    size: 12
                  }
                },
                border: {
                  display: false
                }
              }
            }
          }
        });
      });
    });
</script>

<div class="chart-container">
  {#if $isLoading}
    <p>Loading...</p>
  {:else if $error}
    <p>Error: {$error}</p>
  {:else}
    <canvas bind:this={chartCanvas}></canvas>
  {/if}
</div>

<style>
  .chart-container {
    position: relative;
    height: 400px;
    width: 100%;
  }
</style>