<script lang="ts">
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import TimePicker from "$lib/components/ui/TimePicker.svelte";

	let timeH = $state();
	let timeM = $state();
</script>

<Subpage title="Smart Charging" backURL="/menu/chargers">
	<div class="flex flex-col gap-8">
		<div class="flex flex-col gap-3">
			<span class="font-bold">Earliest Start</span>
			<p class="mb-2">This is the earliest possible time you want to start charging your car.</p>
			<div
				class="flex flex-row justify-center gap-4 rounded-2xl border border-lk-blue-800"
				style="background: linear-gradient(to right, #59a6b7, #2e4d59);"
			>
				<TimePicker bind:selectedTime={timeH} defaultTime={12} maxValue={24} align="right" small={true} />
				<TimePicker
					bind:selectedTime={timeM}
					defaultTime={37}
					maxValue={60}
					jump={15}
					align="left"
					small={true}
				/>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<span class="font-bold">Ready Time</span>
			<p class="mb-2">
				This is the usually when you need to use your car. It will be fully charged by this time.
			</p>
			<div
				class="flex flex-row justify-center gap-4 rounded-2xl border border-lk-blue-800"
				style="background: linear-gradient(to right, #59a6b7, #2e4d59);"
			>
				<TimePicker bind:selectedTime={timeH} defaultTime={12} maxValue={24} align="right" small={true} />
				<TimePicker
					bind:selectedTime={timeM}
					defaultTime={37}
					maxValue={60}
					jump={15}
					align="left"
					small={true}
				/>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<span class="font-bold">Prewarming</span>
			<p class="mb-2">
				This is the usually when you need to use your car. It will be fully charged by this time.
			</p>
			<div
				class="flex flex-row justify-center gap-4 rounded-2xl border border-lk-blue-800"
				style="background: linear-gradient(to right, #59a6b7, #2e4d59);"
			>
				<TimePicker bind:selectedTime={timeH} defaultTime={12} maxValue={24} align="right" small={true} />
				<TimePicker
					bind:selectedTime={timeM}
					defaultTime={37}
					maxValue={60}
					jump={15}
					align="left"
					small={true}
				/>
			</div>
		</div>
	</div>
</Subpage>
