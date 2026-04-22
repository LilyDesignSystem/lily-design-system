<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignVo2MaxAsMlPerKgPerMinuteView from './VitalSignVo2MaxAsMlPerKgPerMinuteView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignVo2MaxAsMlPerKgPerMinuteView',
    component: VitalSignVo2MaxAsMlPerKgPerMinuteView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Vo2 Max As Ml Per Kg Per Minute View'}}
/>
