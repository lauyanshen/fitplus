# Fit+

**Fit+ is an AI-assisted health companion that helps people—especially children, teenagers, and families—understand their everyday eating, sugar intake, exercise, and healthy routines.**

Instead of focusing only on weight, Fit+ turns daily health information into small, practical actions such as choosing a lower-sugar drink, recording a meal, drinking water, or completing 20 minutes of movement.

**Live app:** [fit-plus-health.eddielau.chatgpt.site](https://fit-plus-health.eddielau.chatgpt.site)

## Target users

Fit+ is designed for:

- Children and teenagers who are building healthier daily habits
- Parents who want a simple way to discuss food, sugar, movement, and wellbeing with their children
- Adults who want to track meals, exercise, water, weight goals, and progress
- Malaysian users who need guidance for familiar local foods and drinks
- Users who prefer English, Bahasa Melayu, or Simplified Chinese

The app adapts its guidance according to the user's age. For users under 20, it prioritises healthy growth, balanced meals, sleep, enjoyable activity, and family support instead of adult dieting or calorie-deficit targets.

## The problem

Many health apps are difficult to use consistently because they:

- Focus mainly on body weight or appearance
- Use generic food databases that may not understand Malaysian meals
- Make users manually search for calories and nutrition values
- Show numbers without explaining what action the user can take next
- Apply adult BMI categories and weight-loss advice to children
- Separate meal, sugar, exercise, water, and progress tracking across different tools

This can make health tracking confusing, time-consuming, or unsuitable for younger users. Hidden sugar in common drinks such as Milo, teh tarik, bubble tea, and canned drinks can also be difficult to notice.

## How Fit+ solves it

Fit+ combines the most useful daily health tools in one clear, mobile-friendly app:

1. **Age-aware health profile** — Uses age, sex, height, weight, activity, and goals to provide appropriate guidance.
2. **BMI and BMI-for-age guidance** — Uses adult BMI categories for adults and BMI-for-age screening for children and teenagers. Younger users are placed in a healthy-growth mode rather than an adult weight-loss programme.
3. **AI food estimation** — Users can describe one or several foods in ordinary language. Fit+ estimates each item separately, including portion, calories, protein, carbohydrates, fat, total sugar, and added/free sugar.
4. **Food balance guidance** — Each food is grouped and described as balanced, partly balanced, or less balanced, with practical guidance on how often it may fit into a healthy eating pattern.
5. **Sugar awareness** — Tracks estimated total and added/free sugar, compares it with the daily guide, and shows sugar in grams and approximate teaspoons.
6. **Meal and exercise records** — Records daily food, drinks, exercise duration, and estimated calories burned.
7. **Daily missions** — Encourages simple actions for water, lower-sugar choices, movement, and wellbeing rather than perfection.
8. **Progress dashboard** — Shows daily and weekly patterns, active minutes, meals, water, streaks, and goal progress.
9. **Multilingual experience** — The interface and AI responses support English, Bahasa Melayu, and Simplified Chinese.
10. **Works across devices** — The responsive web app is usable on phones and computers and can be installed as a Progressive Web App where supported.

## How AI is used

Fit+ uses the OpenAI API for two focused tasks.

### 1. AI food and calorie estimator

The user can enter foods naturally, for example:

```text
1 plate chicken rice
1 cup teh tarik
1 banana
```

The AI returns a structured estimate for every food item:

- Portion
- Calories
- Protein, carbohydrates, and fat
- Total sugar and added/free sugar
- Food groups
- Overall meal balance
- Suggested eating frequency
- Confidence level and a short explanation

This makes the app more useful for mixed meals and Malaysian foods that may be difficult to find in a standard calorie database.

### 2. AI health assistant

The assistant uses the user's current context—including age, BMI or BMI-for-age category, health goal, meals, sugar intake, and exercise history—to answer questions such as:

- “What should I eat next?”
- “I had nasi lemak for breakfast. What could I choose for lunch?”
- “What exercise should I do today?”
- “Am I on track today?”

The assistant is instructed to:

- Give short, practical, age-appropriate suggestions
- Avoid diagnosing medical conditions
- Avoid extreme dieting, purging, medicine changes, and unsafe weight-loss advice
- Avoid adult BMI labels and calorie-deficit targets for users under 20
- Recommend professional help for urgent symptoms, eating-disorder warning signs, pregnancy, or serious health concerns
- Answer in the language selected by the user

The AI output uses a strict structured format so the app can display information consistently and reduce malformed responses.

## Responsible health design

Fit+ is an educational habit-building tool, not a medical device. Calorie, nutrient, sugar, and exercise-burn values are estimates and may vary by recipe, brand, preparation method, and portion size.

BMI-for-age results are screening guidance, not a diagnosis. A child's growth should be reviewed with a parent and a qualified healthcare professional using appropriate growth charts and clinical context.

## Privacy and data

- Health records are stored locally in the user's browser on the current device.
- The OpenAI API key is read from a protected server-side environment variable and is not included in browser code.
- Only the information needed to answer an AI request is sent to the server-side AI endpoint.
- Users can export a backup or delete their local Fit+ records.

Because records are device-local, clearing browser data or changing devices can remove them unless a backup has been exported.

## Main features

- Responsive dashboard for phone and desktop
- Teen-focused healthy-growth mode
- BMI and BMI-for-age classification
- Malaysian food and drink guidance
- Multi-food AI calorie estimation
- Calories, macronutrients, total sugar, and added-sugar tracking
- Food-group and meal-balance feedback
- Meal, water, mood, energy, and exercise logging
- Daily missions, streaks, and weekly progress
- Age-aware AI health assistant
- English, Bahasa Melayu, and Simplified Chinese
- Local backup and data deletion
- Progressive Web App support

## Technology

- React and TypeScript
- Next.js-compatible application powered by Vinext and Vite
- Tailwind CSS
- OpenAI Responses API with JSON Schema structured outputs
- Cloudflare-compatible server deployment
- Browser local storage for device-local records

## Running the project locally

### Requirements

- Node.js 22.13 or later
- An OpenAI API key

### Setup

```bash
npm install
```

Create a local environment file and add the API configuration:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Never commit a real API key to the repository.

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Current product status

The Normal Assistant is available with a daily question allowance. Fit+ currently uses one simple assistant experience without paid or premium plans.

## Future improvements

- Secure user accounts and cross-device synchronisation
- Parent or guardian-linked profiles for younger users
- Barcode and food-photo input
- A verified Malaysian food nutrition database to complement AI estimates
- Optional reminders and native mobile packaging
- Clinician-reviewed educational content and broader BMI-for-age reference data

## Disclaimer

Fit+ provides general education and habit guidance only. It does not provide medical diagnosis, treatment, emergency assistance, or a substitute for advice from a doctor, dietitian, or other qualified healthcare professional.
