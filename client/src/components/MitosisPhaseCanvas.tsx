import { useEffect, useRef } from "react";
import { MitosisPhase } from "@/lib/mitosisData";

interface MitosisPhaseCanvasProps {
  phase: MitosisPhase;
}

export default function MitosisPhaseCanvas({ phase }: MitosisPhaseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw cell membrane (outer boundary)
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    switch (phase.id) {
      case "prophase":
        drawProphase(ctx, width, height);
        break;
      case "metaphase":
        drawMetaphase(ctx, width, height);
        break;
      case "anaphase":
        drawAnaphase(ctx, width, height);
        break;
      case "telophase":
        drawTelophase(ctx, width, height);
        break;
    }

  }, [phase]);

  const drawProphase = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Cell membrane
    ctx.ellipse(width/2, height/2, width*0.45, height*0.45, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Nuclear membrane (dissolving - dashed line)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(width/2, height/2, width*0.25, height*0.25, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Chromosomes condensing (thick, visible)
    ctx.fillStyle = "#dc2626";
    ctx.strokeStyle = "#991b1b";
    ctx.lineWidth = 1;
    
    // Draw several chromosome pairs
    const chromosomes = [
      { x: width*0.4, y: height*0.35 },
      { x: width*0.6, y: height*0.4 },
      { x: width*0.35, y: height*0.55 },
      { x: width*0.65, y: height*0.6 },
      { x: width*0.5, y: height*0.3 },
      { x: width*0.45, y: height*0.65 }
    ];

    chromosomes.forEach(chr => {
      // Sister chromatids joined at centromere
      ctx.beginPath();
      ctx.ellipse(chr.x - 3, chr.y, 4, 12, Math.PI/6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.ellipse(chr.x + 3, chr.y, 4, 12, -Math.PI/6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Centromere
      ctx.fillStyle = "#7c2d12";
      ctx.beginPath();
      ctx.arc(chr.x, chr.y, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#dc2626";
    });

    // Spindle apparatus forming (from centrosomes)
    drawSpindleFibers(ctx, width, height, "forming");
  };

  const drawMetaphase = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Cell membrane
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(width/2, height/2, width*0.45, height*0.45, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // No nuclear membrane (completely dissolved)

    // Chromosomes aligned at metaphase plate (center)
    ctx.fillStyle = "#dc2626";
    ctx.strokeStyle = "#991b1b";
    ctx.lineWidth = 1;
    
    const centerY = height/2;
    const chromosomePositions = [
      width*0.35, width*0.42, width*0.5, width*0.58, width*0.65
    ];

    chromosomePositions.forEach(x => {
      // Sister chromatids
      ctx.beginPath();
      ctx.ellipse(x, centerY - 6, 3, 8, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.ellipse(x, centerY + 6, 3, 8, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Centromere
      ctx.fillStyle = "#7c2d12";
      ctx.beginPath();
      ctx.arc(x, centerY, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#dc2626";
    });

    // Full spindle apparatus
    drawSpindleFibers(ctx, width, height, "complete");
  };

  const drawAnaphase = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Cell membrane starting to elongate
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(width/2, height/2, width*0.48, height*0.4, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Chromosomes moving to opposite poles
    ctx.fillStyle = "#dc2626";
    ctx.strokeStyle = "#991b1b";
    ctx.lineWidth = 1;
    
    const topY = height*0.3;
    const bottomY = height*0.7;
    const chromosomeXPositions = [
      width*0.35, width*0.42, width*0.5, width*0.58, width*0.65
    ];

    // Top set of chromatids
    chromosomeXPositions.forEach(x => {
      ctx.beginPath();
      ctx.ellipse(x, topY, 3, 8, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });

    // Bottom set of chromatids
    chromosomeXPositions.forEach(x => {
      ctx.beginPath();
      ctx.ellipse(x, bottomY, 3, 8, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });

    // Spindle fibers pulling chromosomes
    drawSpindleFibers(ctx, width, height, "pulling");
  };

  const drawTelophase = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Cell membrane constricting (cytokinesis beginning)
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Draw figure-8 shape for dividing cell
    ctx.ellipse(width/2, height*0.3, width*0.3, height*0.25, 0, 0, 2 * Math.PI);
    ctx.moveTo(width*0.2, height*0.5);
    ctx.lineTo(width*0.8, height*0.5);
    ctx.ellipse(width/2, height*0.7, width*0.3, height*0.25, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // New nuclear membranes forming
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(width/2, height*0.3, width*0.2, height*0.15, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.ellipse(width/2, height*0.7, width*0.2, height*0.15, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Chromosomes decondensing (less visible)
    ctx.fillStyle = "#f87171";
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 1;
    
    const topChromosomes = [
      { x: width*0.45, y: height*0.27 },
      { x: width*0.55, y: height*0.3 },
      { x: width*0.5, y: height*0.35 }
    ];

    const bottomChromosomes = [
      { x: width*0.45, y: height*0.67 },
      { x: width*0.55, y: height*0.7 },
      { x: width*0.5, y: height*0.75 }
    ];

    [...topChromosomes, ...bottomChromosomes].forEach(chr => {
      ctx.beginPath();
      ctx.ellipse(chr.x, chr.y, 2, 6, Math.random() * Math.PI, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });

    // Spindle apparatus disassembling
    drawSpindleFibers(ctx, width, height, "disassembling");
  };

  const drawSpindleFibers = (ctx: CanvasRenderingContext2D, width: number, height: number, stage: string) => {
    ctx.strokeStyle = "#059669";
    ctx.lineWidth = 1;

    const centerX = width / 2;
    const topPole = { x: centerX, y: height * 0.15 };
    const bottomPole = { x: centerX, y: height * 0.85 };

    switch (stage) {
      case "forming":
        // Short fibers from centrosomes
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const length = 20;
          ctx.moveTo(topPole.x, topPole.y);
          ctx.lineTo(topPole.x + Math.cos(angle) * length, topPole.y + Math.sin(angle) * length);
          ctx.moveTo(bottomPole.x, bottomPole.y);
          ctx.lineTo(bottomPole.x + Math.cos(angle) * length, bottomPole.y + Math.sin(angle) * length);
        }
        ctx.stroke();
        break;

      case "complete":
        // Full spindle with fibers to chromosomes
        ctx.beginPath();
        const chromosomeY = height / 2;
        const chromosomeXs = [width*0.35, width*0.42, width*0.5, width*0.58, width*0.65];
        
        chromosomeXs.forEach(x => {
          ctx.moveTo(topPole.x, topPole.y);
          ctx.lineTo(x, chromosomeY);
          ctx.moveTo(bottomPole.x, bottomPole.y);
          ctx.lineTo(x, chromosomeY);
        });
        ctx.stroke();
        break;

      case "pulling":
        // Fibers pulling chromosomes apart
        const topChromosomeY = height * 0.3;
        const bottomChromosomeY = height * 0.7;
        const chrXs = [width*0.35, width*0.42, width*0.5, width*0.58, width*0.65];
        
        ctx.beginPath();
        chrXs.forEach(x => {
          ctx.moveTo(topPole.x, topPole.y);
          ctx.lineTo(x, topChromosomeY);
          ctx.moveTo(bottomPole.x, bottomPole.y);
          ctx.lineTo(x, bottomChromosomeY);
        });
        ctx.stroke();
        break;

      case "disassembling":
        // Fragmenting fibers
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI;
          const length = 15;
          ctx.moveTo(centerX, height * 0.3);
          ctx.lineTo(centerX + Math.cos(angle) * length, height * 0.3 + Math.sin(angle) * length);
          ctx.moveTo(centerX, height * 0.7);
          ctx.lineTo(centerX + Math.cos(angle) * length, height * 0.7 + Math.sin(angle) * length);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        break;
    }

    // Draw centrosomes
    ctx.fillStyle = "#065f46";
    ctx.beginPath();
    ctx.arc(topPole.x, topPole.y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bottomPole.x, bottomPole.y, 3, 0, 2 * Math.PI);
    ctx.fill();
  };

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
