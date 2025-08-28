<script lang="ts">
	import { goto } from "$app/navigation";
	import { selectedCharger } from "$lib/classes/PublicCharger.svelte";
	import BottomButton from "$lib/components/ui/BottomButton.svelte";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import { bottomButtonFixed } from "$lib/services/layout";
	import { onDestroy, onMount } from "svelte";
	import { getRandomFunFact } from "$lib/services/funFacts";

	let power = $state(0);
	let orderstart = $state(0);
	let orderstop = $state(0);
	let consumption = $state(54.3);
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
			consumption: 15,
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

	function stopCharging(event: Event) {
		event.preventDefault();
		selectedCharger.charger?.stopCharge();
		goto("/map");
	}

	onMount(() => {
		// requestOrderinfo();
		// startPolling();
		console.log("Charging", selectedCharger.charger?.stationid);
		$bottomButtonFixed = true;
	});

	onDestroy(() => {
		if (pollTimer) {
			clearInterval(pollTimer);
		}
		$bottomButtonFixed = false;
	});
</script>

<Subpage title="Charging" backURL="/map">
	<div class="flex flex-col gap-5">
		<div class="flex flex-col rounded-2xl overflow-hidden border border-lk-green-500">
			<div
				class="flex flex-row rounded-xl overflow-hidden border border-lk-green-500 bg-lk-green-500 w-full p-6 justify-between items-center"
			>
				<div class="text-lk-blue-950">Energy</div>
				<div class="text-lk-blue-800 text-3xl font-bold">
					{consumption}
					<span class="text-sm font-light">kWh</span>
				</div>
			</div>
			<div class="text-lk-blue-300 text-sm p-4 text-center">
				{getRandomFunFact(consumption)}
			</div>
		</div>

		<div
			class="flex flex-row rounded-2xl overflow-hidden border border-lk-blue-800 w-full p-6 justify-between items-center"
		>
			<div class="text-lk-blue-300">Duration</div>
			<div class="text-lk-blue-50 text-3xl font-bold">0:15:32</div>
		</div>

		<div
			class="flex flex-row rounded-2xl overflow-hidden border border-lk-blue-800 w-full p-6 justify-between items-center"
		>
			<div class="text-lk-blue-300">Cost</div>
			<div class="text-lk-blue-50 text-3xl font-bold">
				37.50
				<span class="text-sm font-light">DKK</span>
			</div>
		</div>

		<form id="stop-charging" onsubmit={stopCharging}>
			<BottomButton
				buttonText="Stop Charging"
				formID="stop-charging"
				activeDot={undefined}
				totalDots={undefined}
			/>
		</form>
	</div>
</Subpage>
