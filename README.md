# 🏋️ APEX 3D ATHLETICS & PERFORMANCE GYM

A high-end, 3D animated, full-stack fitness center platform built with **React**, **Three.js / React Three Fiber**, **Tailwind CSS**, **Framer Motion**, and an **Express.js API Server**.

---

## ⚡ Quick Start Instructions

### 1. Run the Development Frontend
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 2. Run the Express Backend API
```bash
npm run server
```
Server runs on `http://localhost:5000`.

---

## ⚙️ How & Where to Change Gym Details (Single Central Config)

All gym details, branding, location, owner credentials, trainer profiles, gym photos, and transformation sliders are driven from a **single global configuration file**:

📍 **`src/config/gymConfig.js`**

### 1. Changing Total Gym Name & Branding
Open `src/config/gymConfig.js` and edit line 12:
```javascript
export const GYM_CONFIG = {
  GYM_NAME: "YOUR NEW GYM NAME HERE", // <-- Edit this line once to change the total gym name across the entire site!
  GYM_SHORT_NAME: "SHORT NAME",
  TAGLINE: "Transform Your Body in 3D Dimension",
  ...
};
```

### 2. Changing Owner Details & Contact
In `src/config/gymConfig.js`:
```javascript
OWNER: {
  name: "Amrit Dwivedi",
  role: "Founder & Master Fitness Coach",
  phone: "8889990012", // <-- Change contact number here
  whatsapp: "918889990012",
  photo: "https://your-custom-photo-url.com/owner.jpg", // <-- Change profile photo here
}
```

### 3. Changing the 3 Personal Trainers
In `src/config/gymConfig.js`:
```javascript
TRAINERS: [
  {
    id: "trainer-1",
    name: "Trainer 1", // <-- Rename Trainer 1 (e.g. "Vikram Sharma")
    photo: "https://your-custom-photo-url.com/trainer1.jpg",
    ...
  },
  {
    id: "trainer-2",
    name: "Trainer 2", // <-- Rename Trainer 2
    ...
  },
  {
    id: "trainer-3",
    name: "Trainer 3", // <-- Rename Trainer 3
    ...
  }
]
```

### 4. Changing Gym Facility Photos
In `src/config/gymConfig.js`:
- `photo1`: `https://raw.githubusercontent.com/amritdwivedi1/gym/main/gym1.png`
- `photo2`: `https://raw.githubusercontent.com/amritdwivedi1/gym/main/gym2.png`
- `photo3`: `https://raw.githubusercontent.com/amritdwivedi1/gym/main/gym3.png`
- `photo4`: `https://raw.githubusercontent.com/amritdwivedi1/gym/main/gym4.png`

### 5. Changing Before & After Transformation Photos
In `src/config/gymConfig.js`:
- `before`: `https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformbefore1.png`
- `after1`: `https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformafter1.png`
- `after2`: `https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformafter2.png`
- `after3`: `https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformafter3.png`

---

## 🗄️ Connecting Your Real Database (MongoDB / PostgreSQL)

Open **`server/index.js`** and locate the sections marked with:
`--> CHANGE HERE FOR DATABASE CONNECTION`

Un-comment the Mongoose connection code:
```javascript
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error(err));
```

---

## 🌟 Key Features Included

1. **3D Interactive Hero Canvas**: Rotating metallic dumbbell mesh, particle field & light reflections.
2. **3D Equipment Viewer**: Interactive 3D Kettlebell & Calibrated Bumper plate shaders.
3. **Interactive Before & After Slider**: Side-by-side drag reveal for After 1, After 2, After 3 transformations.
4. **Interactive Gym Lightbox Gallery**: 4 gym photos with 3D hover effects.
5. **AI Workout & Nutrition Generator**: Algorithmic 7-day split and macro nutrition generator.
6. **Owner & 3 Trainers Section**: Profiles for Amrit Dwivedi (8889990012) and 3 customizable trainers with booking modal.
7. **Online Membership & Payment Modal**: UPI QR Code & Card payment options with digital pass generation.
8. **Member Dashboard & Expiry Alert**: Workout & PR tracker, check-ins, and membership expiry warning banner.
9. **Interactive Location Map Section**: Centered on New Delhi `(28.61614192367146, 77.08783089985045)` with direct Google Maps route button (`https://maps.app.goo.gl/WX2LfU52egpWxYfr8`).
10. **Floating WhatsApp Chat Widget**: Direct message trigger to `8889990012`.
11. **Dark & Light Mode Switch**: Smooth theme toggling across all components.
