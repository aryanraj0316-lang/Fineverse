import type { AnatomyPart } from "@/components/product/product-anatomy";

export const headphoneAnatomy: AnatomyPart[] = [
  { id: "headband", name: "Headband", spec: "Padded support · adjustable fit", description: "The curved headband supports the headset, while the adjustment yokes help position the earcups comfortably.", x: 29, y: 27, width: 50, height: 43, labelX: 16, labelY: 10, anchorX: 28, anchorY: 13 },
  { id: "cushion", name: "Ear cushion", spec: "Memory foam · protein leather", description: "Soft padding sits around the ear, providing a comfortable contact surface and helping create an acoustic seal.", x: 27, y: 63, width: 22, height: 33, labelX: 14, labelY: 85, anchorX: 22, anchorY: 64 },
  { id: "driver", name: "Dynamic driver", spec: "40 mm dynamic driver", description: "The driver converts the audio signal into sound. Its diaphragm moves to reproduce your music inside the earcup.", x: 45, y: 59, width: 19, height: 28, labelX: 41, labelY: 84 },
  { id: "board", name: "ANC electronics", spec: "Adaptive noise cancelling", description: "The electronics coordinate audio playback and noise cancellation, working with the headset's microphones to manage surrounding sound.", x: 63, y: 54, width: 18, height: 24, labelX: 65, labelY: 82 },
  { id: "battery", name: "Battery module", spec: "Up to 40 hours with ANC", description: "Rechargeable power supports long listening sessions. USB-C quick charging provides four hours of playback from a five-minute charge.", x: 77, y: 47, width: 15, height: 22, labelX: 88, labelY: 72 },
  { id: "shell", name: "Outer housing", spec: "Graphite finish · tactile controls", description: "The outer shell protects the earcup assembly and provides access to the charging port and physical controls.", x: 86, y: 30, width: 23, height: 32, labelX: 84, labelY: 10, anchorX: 90, anchorY: 29 },
];

export const watchAnatomy: AnatomyPart[] = [
  { id: "glass", name: "Sapphire crystal", spec: "Sapphire glass", description: "The protective crystal sits above the display. Its polished surface keeps the watch face clearly visible while providing a durable outer layer.", x: 67, y: 17, width: 20, height: 14, labelX: 84, labelY: 8, anchorX: 72, anchorY: 15 },
  { id: "display", name: "AMOLED display", spec: "1.4-inch AMOLED · 466 × 466", description: "The circular display brings watch faces, workout information and notifications into view with rich contrast.", x: 60, y: 31, width: 19.5, height: 14, labelX: 86, labelY: 31, anchorX: 67, anchorY: 31 },
  { id: "board", name: "Logic board", spec: "Connected control electronics", description: "The compact electronics coordinate the display, connectivity, workout tracking and information from the watch's sensors.", x: 53, y: 45, width: 19, height: 13.5, labelX: 18, labelY: 31 },
  { id: "battery", name: "Battery module", spec: "Up to 14 days per charge", description: "Rechargeable power supports everyday use, with battery life depending on display settings and the features you use.", x: 46, y: 58, width: 18, height: 13, labelX: 82, labelY: 59 },
  { id: "case", name: "Case & strap", spec: "Aluminium · fluoroelastomer", description: "The case supports the internal assembly, with a side crown for control and a soft quick-release strap for everyday wear.", x: 36, y: 68, width: 67, height: 60, labelX: 13, labelY: 68, anchorX: 28, anchorY: 69 },
  { id: "sensor", name: "Sensor back", spec: "Heart rate · SpO₂ tracking", description: "The optical sensor windows face the wrist, supporting the watch's heart-rate, blood-oxygen and activity features.", x: 29, y: 87, width: 20, height: 14.5, labelX: 62, labelY: 88 },
];
