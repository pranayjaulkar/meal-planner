# User Health Profile

The health profile is stored as an embedded `healthProfile` object on the user document.

Fields:

- `age`: whole number from 13 to 120.
- `gender`: `male` or `female`.
- `height`: centimeters from 100 to 250.
- `weight`: kilograms from 30 to 300.

Validation lives in `lib/schemas/health-profile.schema.ts` and is reused by the service layer and server action.

Calorie calculations live in `lib/profile/calories.ts`. BMR uses the Mifflin-St Jeor formula:

- Male: `10 * weightKg + 6.25 * heightCm - 5 * age + 5`
- Female: `10 * weightKg + 6.25 * heightCm - 5 * age - 161`

Maintenance calories are estimated as `BMR * 1.2`. The multiplier is documented in code because the current profile inputs do not include activity level.
