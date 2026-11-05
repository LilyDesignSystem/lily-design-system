# NewsletterSignup

An email subscription form composition with idle, submitting, success, and error states.

See `components/newsletter-signup/index.md` for canonical documentation.

`Email` is Blazor only: the other ports read the address from the submit event, which has no form data in C#.

## Parameters

- `Label`, `EmailLabel`, `SubmitLabel`: string (required)
- `Heading`, `Description`, `EmailPlaceholder`, `SuccessMessage`, `ErrorMessage`: string
- `State`: `idle`, `submitting`, `success` or `error`, rendered as `data-state`
- `Email`, `EmailChanged`: string — two-way with `@bind-Email`
- `OnSubmit`: EventCallback<EventArgs>
- `CssClass`: string — extra CSS classes appended to `newsletter-signup`
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<NewsletterSignup Label="Newsletter" EmailLabel="Email" SubmitLabel="Join" State="@state"
                  SuccessMessage="Thank you" ErrorMessage="That did not work"
                  @bind-Email="email" OnSubmit="SubscribeAsync" />
```
