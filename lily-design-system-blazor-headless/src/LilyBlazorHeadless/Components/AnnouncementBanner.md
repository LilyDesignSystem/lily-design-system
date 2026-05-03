# AnnouncementBanner

A banner highlighting important messages for all users.

See `components/announcement-banner/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `announcement-banner`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<AnnouncementBanner Label="...">
    Content
</AnnouncementBanner>
```
