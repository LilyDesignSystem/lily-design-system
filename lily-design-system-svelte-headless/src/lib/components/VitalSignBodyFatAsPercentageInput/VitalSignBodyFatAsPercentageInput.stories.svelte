<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignBodyFatAsPercentageInput from './VitalSignBodyFatAsPercentageInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignBodyFatAsPercentageInput',
    component: VitalSignBodyFatAsPercentageInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Body Fat As Percentage Input'}}
/>
