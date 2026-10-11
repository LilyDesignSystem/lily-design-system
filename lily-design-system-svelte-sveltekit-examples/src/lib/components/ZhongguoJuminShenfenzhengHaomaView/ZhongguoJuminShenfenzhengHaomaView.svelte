<script lang="ts">
    // ZhongguoJuminShenfenzhengHaomaView component
    //
    // A headless display component for showing China's
    // 居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ) in a read-only format.
    // Format: Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits — a value of 10 is written as the letter X.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <ZhongguoJuminShenfenzhengHaomaView label="居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Resident_Identity_Card

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ZhongguoJuminShenfenzhengHaomaView.svelte -->
<span
    class={`zhongguo-jumin-shenfenzheng-haoma-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
