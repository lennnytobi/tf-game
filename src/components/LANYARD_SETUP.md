# Lanyard Component Setup

## Required Assets

To use the 3D interactive Lanyard component, you need two asset files:

1. **card.glb** - 3D model of the badge card
2. **lanyard.png** - Texture for the lanyard strap

## Where to Get the Assets

### Option 1: Download from ReactBits Repository
Visit: https://github.com/premieroctet/react-bits/tree/main/src/assets/lanyard

Download:
- `card.glb`
- `lanyard.png`

Place them in: `src/components/`

### Option 2: Create Your Own

#### For card.glb:
1. Create a simple card model in Blender or use an online tool
2. Export as GLB format
3. Or use this online editor to customize: https://modelviewer.dev/editor/

#### For lanyard.png:
1. Create a simple texture in any image editor (e.g., Photoshop, GIMP, Figma)
2. Recommended size: 256x256px or 512x512px
3. Should be a repeating pattern for the lanyard strap
4. Save as PNG with transparency

## Current Setup

The component is already configured with:
- ✅ TypeScript declarations (`src/types/assets.d.ts`)
- ✅ Next.js webpack config for GLB files
- ✅ All required dependencies installed
- ✅ Component code ready to use

## Once You Have the Assets

1. Place `card.glb` and `lanyard.png` in `src/components/`
2. The Lanyard component will automatically work
3. Update `LanyardHeader.tsx` to use the dynamic component

## Alternative: Use Static Badge (Current)

If you prefer not to use 3D assets, the current `LanyardHeader.tsx` provides a clean, static badge design that works without any additional setup.

