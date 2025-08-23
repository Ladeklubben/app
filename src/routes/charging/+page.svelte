<script lang="ts">
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { onDestroy, onMount } from "svelte";

	let power = $state(0);
	let orderstart = $state(0);
	let orderstop = $state(0);
	let consumption = $state(0);
	let orderno = $state("-");

	let price = $state(0);
	let unitprice = $state(0);
	let valuta = $state("DKK");

	let poll_interval = $state(5 * 1000);
	// let charging = $state(false);
	let pollTimer: NodeJS.Timeout | null = $state(null);

	function updateValues(ok: boolean, orderinfo: any) {
		if (!ok) return;

		try {
			orderstart = orderinfo.Started;
		} catch (exception1) {
			return;
		}

		try {
			consumption = orderinfo.consumption;
			power = orderinfo.power;
		} catch (exception1) {}

		orderno = orderinfo.orderid ?? "-";

		if ("order" in orderinfo) {
			unitprice = orderinfo.order.price / consumption;
			price = orderinfo.order.price;
			valuta = orderinfo.order.valuta;
		} else {
			unitprice = 0.0;
			price = 0.0;
			valuta = "DKK";
		}

		if ("Ended" in orderinfo) {
			// charging = false;
			orderstop = orderinfo.Ended;
			guestcharge_stopped();
			poll_interval = 5 * 1000;
		} else {
			guestcharge_started();
			poll_interval = 20 * 1000;
		}
	}

	function guestcharge_started() {
		console.log("Charge started");
	}

	function guestcharge_stopped() {
		console.log("Charge stopped");
	}

	function requestOrderinfo() {
		// console.log('Requesting order info for station:', data.stationid);
		updateValues(true, {
			Started: 1724438400,
			consumption: 10,
			power: 10,
			orderid: "1234567890",
		});
	}

	function startPolling() {
		if (pollTimer) {
			clearInterval(pollTimer);
		}
		pollTimer = setInterval(() => {
			requestOrderinfo();
		}, poll_interval);
	}

	onMount(() => {
		requestOrderinfo();
		startPolling();
	});

	onDestroy(() => {
		if (pollTimer) {
			clearInterval(pollTimer);
		}
	});
</script>

<Subpage title="Charging" backURL="/map">
	<div class="charging-content">
		<div class="charging-section">
			<h3>Elapsed Time</h3>
			<div class="charging-card">
				<p>Start: {new Date(orderstart * 1000).toLocaleString()}</p>
				<p>Stop: {orderstop ? new Date(orderstop * 1000).toLocaleString() : "In progress"}</p>
			</div>
		</div>

		<div class="charging-section">
			<h3>Consumption</h3>
			<div class="charging-card">
				<p>Power: {power} kW</p>
				<p>Consumption: {consumption} kWh</p>
			</div>
		</div>

		<div class="charging-section">
			<h3>Cost</h3>
			<div class="charging-card">
				<p>Price: {price} {valuta}</p>
				<p>Unit Price: {unitprice} {valuta}/kWh</p>
			</div>
		</div>

		<div class="charging-section">
			<h3>Order</h3>
			<div class="charging-card">
				<p>Order No: {orderno}</p>
			</div>
		</div>
	</div>
	<BottomButton buttonText="Stop Charging" formID="stop-charging" activeDot={undefined} totalDots={undefined} />
</Subpage>

<style>
	.charging-content {
		display: flex;
		flex-direction: column;
		gap: 30px;
		padding: 15px;
	}

	.charging-section h3 {
		margin: 0 0 10px 0;
		color: var(--text-primary);
	}

	.charging-card {
		background: var(--bg-secondary);
		border-radius: 8px;
		padding: 16px;
		border: 1px solid var(--border);
	}

	.charging-card p {
		margin: 8px 0;
		color: var(--text-secondary);
	}
</style>
