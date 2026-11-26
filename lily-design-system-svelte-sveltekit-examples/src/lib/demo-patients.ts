// The synthetic patients of the find-a-patient and patient-summary examples: one list, so a search result opens the person it
// names (tasks.md P53-T1). Every name, date and number is invented; the NHS numbers pass the Modulus 11 check and belong to no
// one. Two pairs are alike on purpose (two Mary Joneses born the same day; Alexandra and Alexander EXAMPLE): only the date of
// birth and the number tell them apart.
//
// A page links to a patient by `key`, an opaque demo record key, never by a health identifier, so no NHS number reaches the
// address bar, the browser history or a server log. A real service resolves its own record key, and authorizes every lookup.

export type DemoAllergy = { substance: string; reaction: string; code: string };
export type DemoMedicine = {
    segments: { text: string; tallMan?: boolean }[];
    strength: number;
    frequency: string;
    code: string;
};
export type DemoPatient = {
    key: string;
    family: string;
    given: string;
    born: string;
    number: string;
    allergies: DemoAllergy[];
    medicines: DemoMedicine[];
    result: string;
};

export const DEMO_PATIENTS: DemoPatient[] = [
    {
        key: "r7k2",
        family: "EXAMPLE",
        given: "Alexandra",
        born: "1949-02-03",
        number: "943 476 5919",
        allergies: [
            { substance: "Penicillin", reaction: "Anaphylaxis", code: "SNOMED CT 373270004" },
        ],
        medicines: [
            {
                segments: [{ text: "metformin" }],
                strength: 500,
                frequency: "twice daily",
                code: "ATC A10BA02",
            },
            {
                segments: [{ text: "hydr" }, { text: "ALAZINE", tallMan: true }],
                strength: 25,
                frequency: "twice daily",
                code: "ATC C02DB02",
            },
            {
                segments: [{ text: "levothyroxine" }],
                strength: 0.05,
                frequency: "once daily",
                code: "ATC H03AA01",
            },
        ],
        result: "Potassium 4.6 mmol/L, 3 November 2026.",
    },
    {
        key: "q4m9",
        family: "EXAMPLE",
        given: "Alexander",
        born: "1979-02-03",
        number: "943 476 5870",
        allergies: [],
        medicines: [
            {
                segments: [{ text: "amlodipine" }],
                strength: 5,
                frequency: "once daily",
                code: "ATC C08CA01",
            },
        ],
        result: "Potassium 3.9 mmol/L, 5 November 2026.",
    },
    {
        key: "t8w3",
        family: "JONES",
        given: "Mary",
        born: "1958-03-04",
        number: "943 476 5994",
        allergies: [{ substance: "Latex", reaction: "Rash", code: "SNOMED CT 300916003" }],
        medicines: [
            {
                segments: [{ text: "ramipril" }],
                strength: 5,
                frequency: "once daily",
                code: "ATC C09AA05",
            },
        ],
        result: "Sodium 139 mmol/L, 2 November 2026.",
    },
    {
        key: "h2c6",
        family: "JONES",
        given: "Mary",
        born: "1958-03-04",
        number: "943 476 5927",
        allergies: [],
        medicines: [
            {
                segments: [{ text: "atorvastatin" }],
                strength: 20,
                frequency: "once daily",
                code: "ATC C10AA05",
            },
        ],
        result: "Cholesterol 4.1 mmol/L, 30 October 2026.",
    },
    {
        key: "m5p1",
        family: "JONES",
        given: "Martin",
        born: "1949-11-21",
        number: "943 476 5889",
        allergies: [],
        medicines: [
            {
                segments: [{ text: "omeprazole" }],
                strength: 20,
                frequency: "once daily",
                code: "ATC A02BC01",
            },
        ],
        result: "Haemoglobin 141 g/L, 4 November 2026.",
    },
    {
        key: "c9d4",
        family: "OKAFOR",
        given: "Chidi",
        born: "1990-07-12",
        number: "943 476 5897",
        allergies: [{ substance: "Peanut", reaction: "Hives", code: "SNOMED CT 91935009" }],
        medicines: [
            {
                segments: [{ text: "salbutamol" }],
                strength: 0.1,
                frequency: "when needed",
                code: "ATC R03AC02",
            },
        ],
        result: "Peak flow 480 L/min, 1 November 2026.",
    },
];

/** The patient a key names, or undefined: an unknown key never falls back to someone else. */
export const demoPatient = (key: string | null): DemoPatient | undefined =>
    DEMO_PATIENTS.find((p) => p.key === key);

/** The name as a record shows it: `FAMILY, Given`. */
export const demoPatientName = (p: DemoPatient): string => `${p.family}, ${p.given}`;
