<script lang="ts">
    import { onMount } from "svelte";
    import { prices, isLoading, error, fetchPrices } from "$lib/stores/prices";
    import {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Title,
        CategoryScale,
    } from "chart.js";

    Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Title,
        CategoryScale,
    );

    let chart: Chart | null = null;
    let chartCanvas: HTMLCanvasElement;
    let width: number, height: number, gradient: CanvasGradient;

    function getGradient(ctx: CanvasRenderingContext2D, chartArea: any) {
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;
        if (!gradient || width !== chartWidth || height !== chartHeight) {
            width = chartWidth;
            height = chartHeight;
            gradient = ctx.createLinearGradient(
                0,
                chartArea.bottom,
                0,
                chartArea.top,
            );
            gradient.addColorStop(0, "#5cf628");
            gradient.addColorStop(0.5, "#59a6b7");
            gradient.addColorStop(1, "#e0227f");
        }
        return gradient;
    }

    onMount(() => {
        fetchPrices().then(() => {
            if (chart) {
                chart.destroy();
            }

            const ctx = chartCanvas.getContext("2d");
            const now = Date.now();
            const oneDayInMillis = 24 * 60 * 60 * 1000;
            const filteredPrices = $prices.filter(
                (price) =>
                    price.Timestamp * 1000 >= now &&
                    price.Timestamp * 1000 <= now + oneDayInMillis,
            );

            if (ctx) {
                chart = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: filteredPrices.map((price) => {
                            const date = new Date(price.Timestamp * 1000);
                            return date.toLocaleTimeString("default", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });
                        }),
                        datasets: [
                            {
                                label: "Cost Price (VAT)",
                                data: filteredPrices.map(
                                    (price) => price.Costprice_VAT / 100,
                                ),
                                borderColor: function (context) {
                                    const chart = context.chart;
                                    const { ctx, chartArea } = chart;
                                    if (!chartArea) {
                                        return;
                                    }
                                    return getGradient(ctx, chartArea);
                                },
                                fill: true,
                                tension: 0.4,
                                pointRadius: 0,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false,
                                },
                                ticks: {
                                    maxRotation: 0,
                                    autoSkip: true,
                                    maxTicksLimit: 4,
                                    color: "#dceef1",
                                    font: {
                                        size: 12,
                                    },
                                },
                                border: {
                                    display: false,
                                },
                            },
                            y: {
                                position: "right",
                                grid: {
                                    color: "rgba(156, 163, 175, 0.1)",
                                },
                                ticks: {
                                    padding: -40, // Adjust this value to move labels closer to the chart
                                    color: "#dceef1",
                                    maxTicksLimit: 8,
                                    font: {
                                        size: 12,
                                    },
                                },
                                border: {
                                    display: false,
                                },
                            },
                        },
                    },
                });
            }
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
