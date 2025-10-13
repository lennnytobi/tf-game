# Download Lanyard Assets - Quick Guide

## Step-by-Step Instructions

### 1. Download the Required Files

Visit these direct links to download the assets:

**card.glb:**
https://raw.githubusercontent.com/premieroctet/react-bits/main/src/assets/lanyard/card.glb

**lanyard.png:**
https://raw.githubusercontent.com/premieroctet/react-bits/main/src/assets/lanyard/lanyard.png

### 2. Save the Files

Place both downloaded files in this directory:
```
src/components/
```

Your structure should look like:
```
src/
  components/
    ├── card.glb          ← Place here
    ├── lanyard.png       ← Place here
    ├── Lanyard.jsx
    ├── Lanyard.css
    └── ...
```

### 3. Update the Page

Once the assets are in place, update `src/app/page.tsx`:

Replace:
```tsx
import LanyardHeader from '@/components/LanyardHeader'
```

With:
```tsx
import DynamicLanyardHeader from '@/components/DynamicLanyardHeader'
```

And replace:
```tsx
<LanyardHeader />
```

With:
```tsx
<DynamicLanyardHeader />
```

### 4. Test

Run `npm run dev` and you should see the interactive 3D lanyard!

## Alternative: Download via Browser

1. Go to: https://github.com/premieroctet/react-bits/tree/main/src/assets/lanyard
2. Click on `card.glb` → Click "Download" button
3. Click on `lanyard.png` → Click "Download" button  
4. Move both files to `src/components/`

## Troubleshooting

If the 3D lanyard doesn't appear:
- Check browser console for errors
- Verify both files are in `src/components/`
- Try clearing `.next` folder and rebuilding: `rm -rf .next && npm run dev`
- The component will fallback to the static badge if assets are missing

## Customizing Your Card

To customize the badge text/design on the 3D card:
1. Visit https://modelviewer.dev/editor/
2. Upload your `card.glb`
3. Edit the texture/materials
4. Download and replace the file

