<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignWeightAsKgInput from './VitalSignWeightAsKgInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignWeightAsKgInput',
    component: VitalSignWeightAsKgInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Weight As Kg Input'}}
/>
