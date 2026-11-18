# SchweizAhvNummerView

A headless Vue 3 read-only display for Switzerland's AHV-Nummer / Numéro AVS.

Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.

Companion: `SchweizAhvNummerInput`.

References: https://en.wikipedia.org/wiki/Data_codes_for_Switzerland
