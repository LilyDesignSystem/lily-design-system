<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignVo2MaxAsMlPerKgPerMinuteInput from './VitalSignVo2MaxAsMlPerKgPerMinuteInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignVo2MaxAsMlPerKgPerMinuteInput',
    component: VitalSignVo2MaxAsMlPerKgPerMinuteInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Vo2 Max As Ml Per Kg Per Minute Input'}}
/>
