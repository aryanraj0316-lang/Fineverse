"""
Rebuilds app/fonts/Archivo-Fineverse.woff2 from the full Archivo variable font.

    pip install fonttools brotli
    python scripts/build-font.py path/to/Archivo[wdth,wght].ttf

Source font: https://github.com/google/fonts/tree/main/ofl/archivo (SIL OFL 1.1).
Add code points to UNICODES if the site starts using new characters.
"""
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

UNICODES = (
    list(range(0x20, 0x7F))            # Basic Latin
    + list(range(0xA0, 0x100))         # Latin-1 (×, °, é, ©…)
    + [0x131, 0x152, 0x153, 0x2C6, 0x2DA, 0x2DC]
    + list(range(0x2009, 0x200C))      # thin and hair spaces
    + [0x202F]                         # narrow no-break space
    + list(range(0x2010, 0x2016))      # dashes
    + list(range(0x2018, 0x2023))      # quotes, daggers, bullet
    + [0x2026, 0x2030, 0x2032, 0x2033, 0x2039, 0x203A, 0x2044]
    + [0x20B9]                         # ₹
    + [0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2212]
)

source = Path(sys.argv[1])
target = Path(__file__).resolve().parent.parent / "app" / "fonts" / "Archivo-Fineverse.woff2"

font = instancer.instantiateVariableFont(TTFont(source), {"wght": (400, 900), "wdth": (62, 100)})
options = subset.Options()
options.flavor = "woff2"
options.layout_features = ["*"]
options.name_IDs = ["*"]
options.notdef_outline = True
options.hinting = False
options.desubroutinize = True
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=UNICODES)
subsetter.subset(font)
subset.save_font(font, target, options)
print(f"wrote {target} ({target.stat().st_size / 1024:.1f} KB)")
