<script lang="ts">
    import Button from "$lib/components/ui/Button.svelte";
    import ProgressDots from "$lib/components/ui/ProgressDots.svelte";
    import { bottomButtonFixed } from "$lib/services/layout";

    let { 
        activeDot, 
        totalDots, 
        formID, 
        buttonText = "Submit",
    } = $props();
</script>

<div class="{$bottomButtonFixed ? 'fixed bottom-0 left-0 p-5' : 'mt-4'} w-full flex flex-col mb-4">
    {#if activeDot !== undefined && totalDots !== undefined}
        <ProgressDots {activeDot} {totalDots} />
    {/if}
    <Button type="submit" {formID}>{buttonText}</Button>
</div>