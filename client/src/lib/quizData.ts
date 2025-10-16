export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface FillInBlankQuestion {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  hint?: string;
}

export const multipleChoiceQuestions: MultipleChoiceQuestion[] = [
  {
    id: "mc1",
    question: "During which phase do chromosomes align at the cell's equator?",
    options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
    correctAnswer: "Metaphase",
    explanation: "In Metaphase, chromosomes line up at the metaphase plate (cell's equator) with spindle fibers attached to each chromatid, ready for separation."
  },
  {
    id: "mc2",
    question: "What happens to the nuclear envelope during Prophase?",
    options: [
      "It remains intact throughout",
      "It begins to break down",
      "It forms around chromosomes",
      "It duplicates into two"
    ],
    correctAnswer: "It begins to break down",
    explanation: "During Prophase, the nuclear envelope dissolves to allow spindle fibers to attach to chromosomes. It completely disappears by the end of this phase."
  },
  {
    id: "mc3",
    question: "Sister chromatids are separated during which phase?",
    options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
    correctAnswer: "Anaphase",
    explanation: "Anaphase is when sister chromatids are pulled apart by spindle fibers and move to opposite poles of the cell."
  },
  {
    id: "mc4",
    question: "What structures pull chromosomes to opposite poles of the cell?",
    options: ["Centrioles", "Spindle fibers", "Nuclear envelope", "Cell membrane"],
    correctAnswer: "Spindle fibers",
    explanation: "Spindle fibers are microtubules that attach to chromosomes at their centromeres and pull sister chromatids apart during cell division."
  },
  {
    id: "mc5",
    question: "During which phase does cytokinesis typically begin?",
    options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
    correctAnswer: "Telophase",
    explanation: "Cytokinesis (the physical division of the cell) typically begins during Telophase as new nuclear envelopes form and the cell membrane starts to pinch inward."
  },
  {
    id: "mc6",
    question: "What are the X-shaped structures visible during mitosis?",
    options: ["Centromeres", "Chromosomes", "Spindle fibers", "Centrioles"],
    correctAnswer: "Chromosomes",
    explanation: "Chromosomes appear as X-shaped structures because they consist of two sister chromatids joined at the centromere."
  },
  {
    id: "mc7",
    question: "In what order do the phases of mitosis occur?",
    options: [
      "Prophase → Metaphase → Anaphase → Telophase",
      "Metaphase → Prophase → Telophase → Anaphase",
      "Prophase → Anaphase → Metaphase → Telophase",
      "Telophase → Prophase → Metaphase → Anaphase"
    ],
    correctAnswer: "Prophase → Metaphase → Anaphase → Telophase",
    explanation: "Mitosis always follows this order: Prophase (preparation), Metaphase (alignment), Anaphase (separation), and Telophase (division)."
  },
  {
    id: "mc8",
    question: "What happens to chromosomes during Telophase?",
    options: [
      "They condense and become visible",
      "They align at the cell center",
      "They move to opposite poles",
      "They begin to decondense"
    ],
    correctAnswer: "They begin to decondense",
    explanation: "During Telophase, chromosomes start to unwind and decondense back into chromatin as the cell prepares to return to interphase."
  },
  {
    id: "mc9",
    question: "Where are spindle fibers attached to chromosomes?",
    options: ["At the ends", "At the centromere", "Along the chromatids", "At the nuclear envelope"],
    correctAnswer: "At the centromere",
    explanation: "Spindle fibers attach to chromosomes at specialized protein structures called kinetochores, which are located at the centromere."
  },
  {
    id: "mc10",
    question: "How many daughter cells result from mitosis?",
    options: ["One", "Two", "Three", "Four"],
    correctAnswer: "Two",
    explanation: "Mitosis produces two genetically identical daughter cells, each with the same number of chromosomes as the parent cell."
  }
];

export const fillInBlankQuestions: FillInBlankQuestion[] = [
  {
    id: "fb1",
    question: "The phase where chromosomes align at the cell's equator is called _______.",
    answer: "metaphase",
    explanation: "Metaphase is characterized by chromosomes lining up at the metaphase plate in the center of the cell.",
    hint: "Starts with 'meta'"
  },
  {
    id: "fb2",
    question: "During _______, sister chromatids are pulled to opposite poles of the cell.",
    answer: "anaphase",
    explanation: "Anaphase is the phase where sister chromatids separate and move to opposite ends of the cell.",
    hint: "Starts with 'ana'"
  },
  {
    id: "fb3",
    question: "_______ are the structures that pull chromosomes apart during cell division.",
    answer: "spindle fibers",
    explanation: "Spindle fibers (microtubules) attach to chromosomes and pull sister chromatids to opposite poles.",
    hint: "Two words, think of threads"
  },
  {
    id: "fb4",
    question: "The first phase of mitosis where chromosomes become visible is _______.",
    answer: "prophase",
    explanation: "Prophase is when chromatin condenses into visible chromosomes and the nuclear envelope begins to break down.",
    hint: "Starts with 'pro'"
  },
  {
    id: "fb5",
    question: "_______ is the final phase where new nuclear envelopes form around each set of chromosomes.",
    answer: "telophase",
    explanation: "Telophase is the final phase where nuclear envelopes reform, chromosomes decondense, and cytokinesis begins.",
    hint: "Starts with 'telo'"
  },
  {
    id: "fb6",
    question: "The point where sister chromatids are joined together is called the _______.",
    answer: "centromere",
    explanation: "The centromere is the region where two sister chromatids are most closely attached and where spindle fibers attach.",
    hint: "Starts with 'centro'"
  },
  {
    id: "fb7",
    question: "The physical division of the cytoplasm is called _______.",
    answer: "cytokinesis",
    explanation: "Cytokinesis is the process where the cell's cytoplasm divides, creating two separate daughter cells.",
    hint: "Starts with 'cyto'"
  },
  {
    id: "fb8",
    question: "Mitosis produces _______ (number) genetically identical daughter cells.",
    answer: "two",
    explanation: "Mitosis results in two daughter cells, each with the same genetic information as the parent cell.",
    hint: "A number"
  }
];
