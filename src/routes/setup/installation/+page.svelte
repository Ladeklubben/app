<script lang="ts">
    import Subpage from "$lib/components/ui/Subpage.svelte";
    import InputField from "$lib/components/ui/InputField.svelte";
    import Button from "$lib/components/ui/Button.svelte";

    let fields = {
        installationName: "",
        address: "",
        city: "",
        zip: "",
        rebate: false,
        solarPanels: false,
    };

    let errors = {
        installationName: "",
        address: "",
        city: "",
        zip: "",
    };

    async function handleSubmit(event: Event) {
        console.log("submit");
    }
</script>

<Subpage title="Add installation">
    <form on:submit|preventDefault={handleSubmit} novalidate>
        <p>
            An installation is a physical location, like a home, summer house or
            office, where you have a power meter installed.
        </p>

        <InputField
            id="installationName"
            type="text"
            label="Installation Name"
            bind:value={fields.installationName}
            error={errors.installationName}
        />

        <InputField
            id="address"
            type="text"
            label="Address"
            bind:value={fields.address}
            error={errors.address}
        />

        <InputField
            id="city"
            type="text"
            label="City"
            bind:value={fields.city}
            error={errors.city}
        />

        <InputField
            id="zip"
            type="text"
            label="Zip"
            bind:value={fields.zip}
            error={errors.zip}
        />

        <!-- <InputField
            id="rebate"
            type="checkbox"
            label="Rebate"
            bind:value={fields.rebate}
        />

        <InputField
            id="solarPanels"
            type="checkbox"
            label="Solar Panels"
            bind:value={fields.solarPanels}
        /> -->

        <!-- <Button type="submit" {loading}>Reset Password</Button>

        {#if status.message}
            <p
                class="status"
                style="color: {status.success
                    ? 'var(--lk-blue-400)'
                    : 'var(--lk-red-700)'}"
            >
                {status.message}
            </p>
        {/if} -->
    </form>
</Subpage>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
    .status {
        text-align: center;
        margin-bottom: 10px;
    }
</style>
