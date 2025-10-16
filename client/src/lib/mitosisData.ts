export interface MitosisPhase {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
}

export const mitosisPhases: MitosisPhase[] = [
  {
    id: "prophase",
    name: "Prophase",
    description: "Chromatin condenses into visible chromosomes, nuclear envelope begins to break down, and spindle apparatus starts forming.",
    characteristics: [
      "Chromosomes become visible and condense",
      "Nuclear envelope dissolves",
      "Centrosomes move to opposite poles",
      "Spindle fibers begin to form"
    ]
  },
  {
    id: "metaphase", 
    name: "Metaphase",
    description: "Chromosomes align at the cell's equator (metaphase plate), with spindle fibers attached to each chromatid.",
    characteristics: [
      "Chromosomes align at the metaphase plate",
      "Spindle apparatus fully formed", 
      "Each chromatid attached to spindle fibers",
      "Nuclear envelope completely gone"
    ]
  },
  {
    id: "anaphase",
    name: "Anaphase", 
    description: "Sister chromatids separate and move to opposite poles of the cell, pulled by spindle fibers.",
    characteristics: [
      "Sister chromatids separate",
      "Chromatids move to opposite cell poles",
      "Spindle fibers pull chromosomes apart",
      "Cell begins to elongate"
    ]
  },
  {
    id: "telophase",
    name: "Telophase",
    description: "New nuclear envelopes form around each set of chromosomes, and the cell begins to divide (cytokinesis).",
    characteristics: [
      "Nuclear envelopes reform around chromosome sets",
      "Chromosomes begin to decondense",
      "Spindle apparatus disassembles", 
      "Cytokinesis begins - cell membrane pinches"
    ]
  }
];
