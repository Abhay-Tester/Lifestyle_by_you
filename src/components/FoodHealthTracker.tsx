import React, { useState } from 'react';
import { MealLog, DailyLog } from '../types';
import { 
  Utensils, 
  Droplets, 
  HeartPulse, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  Smile, 
  Flame, 
  Info,
  ShieldCheck,
  Leaf,
  Trash2
} from 'lucide-react';

interface FoodHealthTrackerProps {
  selectedDate: string;
  mealLogs: MealLog[];
  dailyLog: DailyLog;
  onAddMealLog: (meal: Omit<MealLog, 'id'>) => void;
  onUpdateDailyLog: (date: string, partial: Partial<DailyLog>) => void;
  onDeleteMealLog?: (id: string) => void;
}

export const FoodHealthTracker: React.FC<FoodHealthTrackerProps> = ({
  selectedDate,
  mealLogs,
  dailyLog,
  onAddMealLog,
  onUpdateDailyLog,
  onDeleteMealLog,
}) => {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [mealTime, setMealTime] = useState('12:30');
  const [foodItems, setFoodItems] = useState('');
  const [digestionImpact, setDigestionImpact] = useState<'easy' | 'neutral' | 'heavy' | 'irritating'>('easy');
  const [fiberRich, setFiberRich] = useState(true);
  const [mealNotes, setMealNotes] = useState('');

  const todayMeals = mealLogs.filter((m) => m.date === selectedDate);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItems.trim()) return;
    onAddMealLog({
      date: selectedDate,
      time: mealTime,
      mealType,
      foodItems,
      digestionImpact,
      fiberRich,
      notes: mealNotes,
    });
    setFoodItems('');
    setMealNotes('');
  };

  const waterMl = dailyLog.waterIntakeMl || 0;
  const waterGoal = dailyLog.waterGoalMl || 3000;
  const waterPercent = Math.min(100, Math.round((waterMl / waterGoal) * 100));

  const addWater = (amount: number) => {
    onUpdateDailyLog(selectedDate, { waterIntakeMl: Math.max(0, waterMl + amount) });
  };

  return (
    <div className="space-y-6">

      {/* Simple Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-600" />
            Food & Health Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Log your daily meals, water intake, and digestion comfort.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0 text-xs">
          <div>
            <span className="text-slate-500 block">Meals Today</span>
            <strong className="text-emerald-600 text-sm font-bold">{todayMeals.length} logged</strong>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-500 block">Water Intake</span>
            <strong className="text-cyan-600 font-mono text-sm">{waterMl} / {waterGoal} ml</strong>
          </div>
        </div>
      </div>

      {/* Grid: 2 Main Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1 & 2: Meal Logging & Meal History */}
        <div className="lg:col-span-2 space-y-6">

          {/* Create Meal Entry Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
              <h3 className="font-bold text-slate-900 text-base">Log Meal & Digestion Impact</h3>
            </div>

            <form onSubmit={handleAddMeal} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="breakfast">🍳 Breakfast</option>
                    <option value="lunch">🥗 Lunch</option>
                    <option value="dinner">🍲 Dinner</option>
                    <option value="snack">🍏 Snack / Healthy Bite</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Time Eaten</label>
                  <input
                    type="time"
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Digestion Impact</label>
                  <select
                    value={digestionImpact}
                    onChange={(e) => setDigestionImpact(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="easy">🌱 Easy on Stomach (Gentle)</option>
                    <option value="neutral">👍 Neutral / Balanced</option>
                    <option value="heavy">🍟 Heavy / Full Feeling</option>
                    <option value="irritating">⚠️ Irritating / Acidic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Food Items & Ingredients</label>
                <input
                  type="text"
                  placeholder="e.g. Oatmeal with chia seeds, blueberries, walnuts & green tea"
                  value={foodItems}
                  onChange={(e) => setFoodItems(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={fiberRich}
                    onChange={(e) => setFiberRich(e.target.checked)}
                    className="w-4 h-4 rounded bg-white border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>High Fiber / Probiotic Rich (Good for gut microbiome)</span>
                </label>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Save Meal
                </button>
              </div>
            </form>
          </div>

          {/* Meal Log List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Today's Meals Log ({selectedDate})
            </h3>

            {todayMeals.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No meals recorded for {selectedDate}. Use the form above to log your breakfast, lunch, dinner or snacks.</p>
            ) : (
              <div className="space-y-3">
                {todayMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {meal.mealType}
                        </span>
                        <span className="font-mono text-slate-500">{meal.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {meal.fiberRich && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                            🌱 High Fiber
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
                          meal.digestionImpact === 'easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          meal.digestionImpact === 'neutral' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          meal.digestionImpact === 'heavy' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {meal.digestionImpact} digestion
                        </span>
                        {onDeleteMealLog && (
                          <button
                            type="button"
                            onClick={() => onDeleteMealLog(meal.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                            title="Delete meal log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-slate-900">{meal.foodItems}</div>

                    {meal.notes && (
                      <div className="text-xs text-slate-500">{meal.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Column 3: Water Hydration & Gut Comfort System */}
        <div className="space-y-6">

          {/* Water Hydration Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                <h3 className="font-bold text-slate-900 text-sm">Water Hydration System</h3>
              </div>
              <span className="text-xs font-mono text-blue-600 font-bold">{waterPercent}%</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <span>Consumed: {waterMl} ml</span>
                <span className="text-slate-500">Target: {waterGoal} ml</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                onClick={() => addWater(250)}
                className="py-2 bg-slate-50 hover:bg-blue-50 text-blue-700 rounded-xl border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-center gap-1 font-semibold"
              >
                +250ml (1 Glass)
              </button>
              <button
                onClick={() => addWater(500)}
                className="py-2 bg-slate-50 hover:bg-blue-50 text-blue-700 rounded-xl border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-center gap-1 font-semibold"
              >
                +500ml (1 Bottle)
              </button>
            </div>
          </div>

          {/* Overall Digestion & Gut Comfort Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
              <h3 className="font-bold text-slate-900 text-sm">Daily Gut Health & Comfort Log</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Digestion Status</label>
                <select
                  value={dailyLog.digestionStatus}
                  onChange={(e) => onUpdateDailyLog(selectedDate, { digestionStatus: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                >
                  <option value="great">🌱 Great (Optimal & Energetic)</option>
                  <option value="normal">👍 Normal (Comfortable)</option>
                  <option value="bloated">🎈 Bloated (Heavy Meal)</option>
                  <option value="sluggish">🐢 Sluggish (Slow Digestion)</option>
                  <option value="acidic">🔥 Acidic (Irritated)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Gut Comfort Rating (1-5)</label>
                <div className="flex justify-between gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => onUpdateDailyLog(selectedDate, { gutComfortRating: score })}
                      className={`flex-1 py-1.5 rounded-lg text-center font-bold text-xs transition-all ${
                        dailyLog.gutComfortRating === score
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Gut Health & Stool Notes</label>
                <textarea
                  rows={3}
                  value={dailyLog.digestionNotes || ''}
                  onChange={(e) => onUpdateDailyLog(selectedDate, { digestionNotes: e.target.value })}
                  placeholder="Record dietary observations, probiotics taken, or gut comfort..."
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
