import React, { useState } from 'react';
import { PurchaseItem } from '../types';
import { 
  ShoppingBag, 
  Plus, 
  IndianRupee, 
  CheckCircle2, 
  ExternalLink, 
  Trash2, 
  Tag, 
  Calendar, 
  Clock, 
  Sparkles,
  Filter,
  Check
} from 'lucide-react';

interface PurchasePlannerProps {
  purchases: PurchaseItem[];
  onAddPurchase: (item: Omit<PurchaseItem, 'id' | 'createdAt'>) => void;
  onUpdatePurchaseStatus: (id: string, status: PurchaseItem['status']) => void;
  onDeletePurchase: (id: string) => void;
}

export const PurchasePlanner: React.FC<PurchasePlannerProps> = ({
  purchases,
  onAddPurchase,
  onUpdatePurchaseStatus,
  onDeletePurchase,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PurchaseItem['category']>('tech');
  const [priority, setPriority] = useState<PurchaseItem['priority']>('high');
  const [estimatedCost, setEstimatedCost] = useState<number>(100);
  const [targetDate, setTargetDate] = useState('2026-09-01');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddPurchase({
      name,
      category,
      priority,
      estimatedCost: Number(estimatedCost) || 0,
      targetDate,
      status: 'planned',
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setName('');
    setUrl('');
    setNotes('');
    setShowAddForm(false);
  };

  const filteredItems = purchases.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterPriority !== 'all' && p.priority !== filterPriority) return false;
    return true;
  });

  const totalPlannedCost = purchases
    .filter((p) => p.status !== 'purchased' && p.status !== 'canceled')
    .reduce((sum, item) => sum + item.estimatedCost, 0);

  const totalSpentCost = purchases
    .filter((p) => p.status === 'purchased')
    .reduce((sum, item) => sum + item.estimatedCost, 0);

  return (
    <div className="space-y-6">

      {/* Simple Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            What is the Purchase Item?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Plan, budget, and prioritize future items you want to buy.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0 text-xs">
          <div>
            <span className="text-slate-500 block">Planned Cost</span>
            <strong className="text-indigo-600 font-mono text-sm">₹{totalPlannedCost.toLocaleString('en-IN')}</strong>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-500 block">Purchased Total</span>
            <strong className="text-emerald-600 font-mono text-sm">₹{totalSpentCost.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filter:</span>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 p-2 rounded-xl focus:border-indigo-500 focus:outline-none capitalize font-medium"
          >
            <option value="all">All Categories</option>
            <option value="tech">💻 Tech & Devices</option>
            <option value="health">🌱 Health & Gut</option>
            <option value="home">🏠 Home & Ergonomics</option>
            <option value="study">📚 Study & Books</option>
            <option value="fitness">🏋️ Fitness & Gear</option>
            <option value="clothing">👕 Apparel & Wear</option>
            <option value="other">📦 Other</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 p-2 rounded-xl focus:border-indigo-500 focus:outline-none capitalize font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="must_have">🔴 Must Have</option>
            <option value="high">🟠 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Close Form' : 'Add Future Purchase'}
        </button>
      </div>

      {/* Add New Purchase Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            Add Item to Purchase List
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-slate-600 font-medium block mb-1">Item Name</label>
              <input
                type="text"
                placeholder="e.g. Ergonomic Standing Desk, Cold Press Juicer, Monitor..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl text-xs font-semibold focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="tech">💻 Tech & Devices</option>
                <option value="health">🌱 Health & Gut</option>
                <option value="home">🏠 Home & Ergonomics</option>
                <option value="study">📚 Study & Books</option>
                <option value="fitness">🏋️ Fitness & Gear</option>
                <option value="clothing">👕 Apparel & Wear</option>
                <option value="other">📦 Other</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="must_have">🔴 Must Have</option>
                <option value="high">🟠 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Estimated Cost (₹ Rupees)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-mono focus:border-indigo-500 focus:outline-none"
                min={0}
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Target Buy Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Store Link / URL (Optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 font-medium block mb-1">Notes / Why Needed</label>
            <input
              type="text"
              placeholder="e.g. Essential for posture during long study sessions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
            >
              Save Purchase Item
            </button>
          </div>
        </form>
      )}

      {/* Purchase Item List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
            No purchase items found matching current filter. Click 'Add Future Purchase' to create your shopping list!
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between transition-all ${
                item.status === 'purchased'
                  ? 'bg-slate-50 border-slate-200 opacity-70'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.priority === 'must_have' ? 'bg-red-50 text-red-700 border border-red-200' :
                    item.priority === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    item.priority === 'medium' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {item.priority.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => onDeletePurchase(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className={`font-bold text-base ${item.status === 'purchased' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {item.name}
                  </h3>
                  <div className="text-xs text-slate-500 capitalize pt-0.5">{item.category} category</div>
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {item.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xl font-mono font-bold text-indigo-600">₹{item.estimatedCost.toLocaleString('en-IN')}</span>
                  {item.targetDate && (
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.targetDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Selector & External Link */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2 text-xs">
                <select
                  value={item.status}
                  onChange={(e) => onUpdatePurchaseStatus(item.id, e.target.value as any)}
                  className="bg-white border border-slate-200 text-slate-800 p-1.5 rounded-lg text-xs capitalize focus:border-indigo-500 focus:outline-none font-medium"
                >
                  <option value="planned">📅 Planned</option>
                  <option value="saved_for">💰 Saving For</option>
                  <option value="purchased">✅ Purchased</option>
                  <option value="canceled">❌ Canceled</option>
                </select>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-lg border border-indigo-100 transition-colors flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Store
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
