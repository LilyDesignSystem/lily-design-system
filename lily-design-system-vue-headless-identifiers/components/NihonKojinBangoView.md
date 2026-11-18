# NihonKojinBangoView

A headless Vue 3 read-only display for Japan's Individual Number / My Number (マイナンバー).

Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).

Companion: `NihonKojinBangoInput`.

References: https://en.wikipedia.org/wiki/Individual_Number
