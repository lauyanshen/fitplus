// Isolated presentation records; never merge them into saved personal data.
export function createPresentationWeek(now = new Date()) {
  const profile = {
    name: "Alex", age: 16, sex: "male" as const,
    height: 165, weight: 56, goalWeight: 56,
    goal: "maintain" as const, activity: "moderate" as const,
    schoolDay: "school" as const, teenFocus: "energy" as const,
  };
  const menus = [
    [["Oats, milk and banana", 420], ["Chicken rice with vegetables", 640], ["Grilled fish, rice and vegetables", 650], ["Yogurt and fruit", 240]],
    [["Egg sandwich and milk", 450], ["Chicken noodle soup", 590], ["Tofu, rice and stir-fried vegetables", 690], ["Banana and nuts", 250]],
    [["Wholemeal toast, eggs and milk", 470], ["Nasi campur with fish and vegetables", 720], ["Chicken soup and rice", 620], ["Yogurt and apple", 230]],
    [["Oats, yogurt and berries", 430], ["Tuna sandwich and fruit", 610], ["Chicken, rice and mixed vegetables", 760], ["Milk and banana", 260]],
    [["Egg wrap and milk", 480], ["Fish noodle soup", 670], ["Rice, tofu and vegetables", 700], ["Fruit and nuts", 280]],
    [["Wholemeal toast and omelette", 440], ["Chicken rice and cucumber", 680], ["Grilled fish and sweet potato", 730], ["Yogurt and fruit", 250]],
    [["Oats, milk and banana", 460], ["Rice, chicken and vegetables", 700], ["Tofu noodle soup", 660], ["Milk, fruit and nuts", 300]],
  ] as const;
  const activities = ["Brisk walk", "Cycling", "Swimming", "Brisk walk", "Cycling", "Home strength", "Swimming"];
  const minutes = [30, 45, 40, 30, 60, 35, 45];
  const meals = [];
  const exercises = [];
  const water: Record<string, number> = {};
  const checkIns: Record<string, { mood: "okay" | "great"; energy: number }> = {};
  for (let i = 0; i < 7; i++) {
    const day = new Date(now);
    day.setDate(day.getDate() - 6 + i);
    const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    menus[i].forEach(([name, calories], mealIndex) => meals.push({
      id: `presentation-meal-${date}-${mealIndex}`, date, name,
      portion: "1 serving", calories,
      protein: Math.round(calories * 0.2 / 4),
      carbs: Math.round(calories * 0.5 / 4),
      fat: Math.round(calories * 0.3 / 9),
      totalSugar: [12, 6, 7, 16][mealIndex],
      addedSugar: [4, 3, 2, 5][mealIndex], confidence: "medium",
    }));
    exercises.push({ id: `presentation-exercise-${date}`, date,
      name: activities[i], minutes: minutes[i], calories: 0 });
    water[date] = [6, 7, 6, 8, 7, 8, 8][i];
    checkIns[date] = { mood: i < 2 ? "okay" : "great", energy: i < 2 ? 3 : 4 };
  }
  return { profile, meals, exercises, water, checkIns, started: true };
}
