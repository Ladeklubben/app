<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { prices } from "$lib/services/prices";
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		Title,
		CategoryScale,
		Filler,
		Tooltip,
	} from "chart.js";

	Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler, Tooltip);

	// Use let with type annotation instead of $state
	let chartCanvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	// Using regular variables instead of $state
	let width: number;
	let height: number;
	let gradient: CanvasGradient;
	let fillGradient: CanvasGradient;

	function getGradient(ctx: CanvasRenderingContext2D, chartArea: any) {
		const chartWidth = chartArea.right - chartArea.left;
		const chartHeight = chartArea.bottom - chartArea.top;
		if (!gradient || width !== chartWidth || height !== chartHeight) {
			width = chartWidth;
			height = chartHeight;
			gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
			gradient.addColorStop(0, "#5cf628");
			gradient.addColorStop(1, "#e0227f");

			// Create a separate gradient for the fill
			fillGradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
			fillGradient.addColorStop(0, "rgba(92, 246, 40, 0.1)");
			fillGradient.addColorStop(1, "rgba(224, 34, 127, 0.1)");
		}
		return gradient;
	}

	function getFillGradient(ctx: CanvasRenderingContext2D, chartArea: any) {
		getGradient(ctx, chartArea); // Ensure both gradients are created
		return fillGradient;
	}

	// Create a function to initialize or update the chart
	function initializeChart() {
		if (!chartCanvas) return;

		if (chart) {
			chart.destroy();
		}

		const ctx = chartCanvas.getContext("2d");
		if (!ctx) return;

		const now = Date.now();
		const oneDayInMillis = 24 * 60 * 60 * 1000;
		const filteredPrices = $prices.filter(
			(price) => price.Timestamp * 1000 >= now && price.Timestamp * 1000 <= now + oneDayInMillis,
		);

		chart = new Chart(ctx, {
			type: "line",
			data: {
				labels: filteredPrices.map((price) => {
					const date = new Date(price.Timestamp * 1000);
					return date.toLocaleTimeString("default", {
						hour: "2-digit",
						minute: "2-digit",
						hour12: false,
					});
				}),
				datasets: [
					{
						label: "Cost Price (VAT)",
						data: filteredPrices.map((price) => price.Costprice_VAT / 100),
						borderColor: function (context) {
							const chart = context.chart;
							const { ctx, chartArea } = chart;
							if (!chartArea) {
								return;
							}
							return getGradient(ctx, chartArea);
						},
						backgroundColor: function (context) {
							const chart = context.chart;
							const { ctx, chartArea } = chart;
							if (!chartArea) {
								return;
							}
							return getFillGradient(ctx, chartArea);
						},
						fill: "origin",
						pointRadius: 0,
						stepped: true,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					tooltip: {
						mode: "index",
						intersect: false,
						backgroundColor: "rgba(0, 0, 0, 0.8)",
						padding: 12,
						titleColor: "#ffffff",
						titleFont: {
							size: 14,
							weight: "normal",
						},
						bodyColor: "#ffffff",
						bodyFont: {
							size: 14,
						},
						displayColors: false,
						callbacks: {
							label: function (context) {
								return `${context.parsed.y.toFixed(2)} kr.`;
							},
						},
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
							maxTicksLimit: 5,
							color: "#dceef1",
							font: {
								size: 12,
							},
							align: "inner",
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
							padding: -34,
							color: "#dceef1",
							maxTicksLimit: 6,
							z: 1,
							font: {
								size: 12,
							},
							callback: function (value, index, values) {
								if (index === 0 || index === values.length - 1) {
									return "";
								}
								return typeof value === "number" ? value.toFixed(2) : value;
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

	// Add effect to update chart when prices change
	$effect(() => {
		// Only run after component is mounted and canvas is available
		if (chartCanvas && $prices) {
			initializeChart();
		}
	});

	onMount(() => {
		// Initial chart setup if canvas is already available
		if (chartCanvas && $prices) {
			initializeChart();
		}
	});

	onDestroy(() => {
		// Clean up the chart when component is destroyed
		if (chart) {
			chart.destroy();
			chart = null;
		}
	});
</script>

<div class="relative h-48 w-full">
	<canvas bind:this={chartCanvas}></canvas>
</div>
