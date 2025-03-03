<script lang="ts">
    import Subpage from "$lib/components/ui/Subpage.svelte";
    import InputField from "$lib/components/ui/InputField.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Form from "$lib/components/ui/Form.svelte";

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
        rebate: "",
        solarPanels: "",
    };

    async function handleSubmit(event: Event) {
        console.log("submit");
    }
</script>

<Subpage title="Add installation">
    <Form on:submit={handleSubmit} >
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

        <InputField
            id="rebate"
            type="checkbox"
            label="Rebate"
            bind:value={fields.rebate}
            error={errors.rebate}
        />

        <InputField
            id="solarPanels"
            type="checkbox"
            label="Solar Panels"
            bind:value={fields.solarPanels}
            error={errors.solarPanels}
        />

        <Button type="submit">Add Installation</Button>

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
    </Form>
</Subpage>

<style>
    .status {
        text-align: center;
        margin-bottom: 10px;
    }
</style>
