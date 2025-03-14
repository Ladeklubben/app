<script lang="ts">
    import Button from "$lib/components/ui/Button.svelte";
    import ProgressDots from "$lib/components/ui/ProgressDots.svelte";

    let { activeDot, totalDots, formID, buttonText="Submit" } = $$props;

</script>

<div class="fixed bottom-2 left-0 w-full flex flex-col p-4">
    {#if activeDot !== undefined && totalDots !== undefined}
        <ProgressDots {activeDot} {totalDots} />
    {/if}
    <Button type="submit" {formID}>{buttonText}</Button>
</div>