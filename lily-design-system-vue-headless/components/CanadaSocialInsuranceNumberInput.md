# CanadaSocialInsuranceNumberInput

A headless Vue 3 input for Canada's Social Insurance Number (SIN).

Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.

Companion: `CanadaSocialInsuranceNumberView`.

References: https://en.wikipedia.org/wiki/Social_Insurance_Number
