# PopconfirmDialog

A popover dialog with confirm and cancel buttons.

See `components/popconfirm-dialog/index.md` for canonical documentation.

A non-modal `popover="manual"`: the page stays live, and Escape and an outside click do nothing unless the consumer adds them. Name the trigger with `position-anchor`; the themes need it to place the dialog. Use `AlertDialog` for a confirmation that must block.

## Parameters

- `Title`, `ConfirmLabel`, `CancelLabel`: string (required)
- `Description`: string
- `Open`: bool — the consumer owns it
- `OnConfirm`, `OnCancel`: EventCallback<MouseEventArgs>
- `CssClass`: string — extra CSS classes appended to `popconfirm-dialog`
- `AdditionalAttributes`: catches unmatched HTML attributes on the root

## Usage

```razor
<button type="button" style="anchor-name: --delete" @onclick="@(() => open = true)">Delete</button>
<PopconfirmDialog Open="open" Title="Delete it?" ConfirmLabel="Yes" CancelLabel="No"
                  OnConfirm="Delete" OnCancel="@(() => open = false)" style="position-anchor: --delete" />
```
