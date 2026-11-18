# HangukJuminDeungnokBeonhoView

A headless Vue 3 read-only display for South Korea's Resident Registration Number (주민등록번호).

Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.

Companion: `HangukJuminDeungnokBeonhoInput`.

References: https://en.wikipedia.org/wiki/Resident_registration_number
