# AotearoaNationalHealthIndexInput

A headless Vue 3 input for New Zealand's National Health Index (NHI) Number.

Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.

Companion: `AotearoaNationalHealthIndexView`.

References: https://en.wikipedia.org/wiki/NHI_Number
