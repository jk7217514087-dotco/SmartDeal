import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Mic,
  Image as ImageIcon,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Layers,
  Scale,
  CheckCircle2,
  Volume2
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendations?: {
    id: string;
    name: string;
    price: number;
    tag: string;
    dealScore: number;
    image: string;
  }[];
}

export const AIAssistantPage: React.FC = () => {
  const { products } = useApp();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Namaste! I am your SmartDeals Autonomous Shopping Intelligence Agent. I cross-analyze live pricing across top marketplaces (Amazon, Flipkart, Croma, Tata CLiQ, Reliance Digital), audit artificial MRP inflation, and calculate real payable prices including coupons and SmartCoins. How can I assist your shopping today?'
    }
  ]);

  const quickPrompts = [
    'Best phone under ₹20,000?',
    'Should I buy iPhone 15 now or wait?',
    'Find genuine deals with 90+ Deal Score',
    'Compare MacBook Air M2 vs ASUS Vivobook 15',
    'Are boAt Airdopes discounts authentic?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply: Message;
      const lower = query.toLowerCase();

      if (lower.includes('phone') || lower.includes('20,000') || lower.includes('mobile')) {
        const phone = products.find(p => p.id === 'prod-samsung-m14') || products[0];
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Deep Scan Result: For under ₹20,000, our Deal DNA engine gives highest recommendation to the Samsung Galaxy M14 5G. It scores 92/100, features a genuine 6000mAh battery, 5nm Exynos processor, and is currently selling at ₹12,490 on SmartDeals (vs ₹12,999 on Amazon and ₹12,890 on Flipkart). You save an additional ₹200 with coupon SMART200 and earn 120 SmartCoins (≈₹12 cashback).',
          recommendations: [
            {
              id: phone.id,
              name: phone.name,
              price: phone.sellingPrice,
              tag: 'Best Overall Under ₹20k',
              dealScore: phone.dealScore,
              image: phone.image
            }
          ]
        };
      } else if (lower.includes('iphone') || lower.includes('wait') || lower.includes('buy now')) {
        const iphone = products.find(p => p.id === 'prod-apple-iphone15') || products[1];
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'AI Price Forecast: BUY NOW (94% Confidence). The iPhone 15 128GB is listed at ₹65,999 on SmartDeals Partner with ₹1,500 direct coupon and 500 SmartCoins reward (equivalent to ₹50). The 90-day price trend indicates stability with minimal likelihood of drops below ₹64,990 before September festive sales.',
          recommendations: [
            {
              id: iphone.id,
              name: iphone.name,
              price: iphone.sellingPrice,
              tag: 'Lowest Effective Market Price',
              dealScore: iphone.dealScore,
              image: iphone.image
            }
          ]
        };
      } else if (lower.includes('macbook') || lower.includes('asus') || lower.includes('laptop')) {
        const mac = products.find(p => p.id === 'prod-macbook-air-m2') || products[4];
        const asus = products.find(p => p.id === 'prod-asus-vivobook') || products[4];
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Comparative Evaluation: If your workload demands MacOS ecosystem & 18h battery endurance, MacBook Air M2 at ₹84,990 is unmatched. For Windows multitasking and 16GB dual-channel RAM on a budget, ASUS Vivobook 15 at ₹48,990 is the top value pick with 1 Year accidental damage protection included.',
          recommendations: [
            {
              id: mac.id,
              name: mac.name,
              price: mac.sellingPrice,
              tag: 'Best Premium Laptop',
              dealScore: mac.dealScore,
              image: mac.image
            },
            {
              id: asus.id,
              name: asus.name,
              price: asus.sellingPrice,
              tag: 'Best Windows Multitasking',
              dealScore: asus.dealScore,
              image: asus.image
            }
          ]
        };
      } else if (lower.includes('boat') || lower.includes('fake') || lower.includes('authentic')) {
        const boat = products.find(p => p.id === 'prod-boat-airdopes') || products[2];
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Fake Discount Audit Alert ⚠️: boAt Airdopes 141 lists an MRP of ₹4,490 with a 71% discount claim. Our 18-month price tracker reveals this product has NEVER sold above ₹1,699 in the Indian market. The actual effective discount is around 24%, not 71%. Moreover, weekend sales regularly discount it to ₹1,149. Recommendation: WAIT 3-5 days unless urgent.',
          recommendations: [
            {
              id: boat.id,
              name: boat.name,
              price: boat.sellingPrice,
              tag: 'Possible Inflated MRP Alert',
              dealScore: boat.dealScore,
              image: boat.image
            }
          ]
        };
      } else {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'I analyzed our real-time price indexes across 5 marketplaces. Here are verified choices that maximize your authentic savings with 90+ Deal Scores:',
          recommendations: products.slice(0, 3).map(p => ({
            id: p.id,
            name: p.name,
            price: p.sellingPrice,
            tag: p.dealScoreBreakdown.verdict,
            dealScore: p.dealScore,
            image: p.image
          }))
        };
      }

      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1000);
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSend('Are boAt Airdopes discounts authentic?');
    }, 2200);
  };

  const handleImageUpload = () => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: '📷 [Visual Search: Uploaded product photo - scanning image features]'
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const sony = products.find(p => p.id === 'prod-sony-wh1000xm5') || products[0];
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Visual match confirmed (99.1% accuracy)! Product identified: Sony WH-1000XM5 Wireless Headphones. Current lowest verified price across all stores is ₹27,990 on Flipkart with free delivery and 350 SmartCoins cashback.',
          recommendations: [
            {
              id: sony.id,
              name: sony.name,
              price: sony.sellingPrice,
              tag: 'Visual Match Verified',
              dealScore: sony.dealScore,
              image: sony.image
            }
          ]
        }
      ]);
    }, 1400);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-400/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Autonomous Shopping Intelligence Copilot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            SmartDeals AI Shopping Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Ask complex queries, upload product photos, compare specifications, and uncover whether festive sales are genuine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-xs">
            <div className="text-slate-400">Stores Indexed</div>
            <div className="text-base font-black text-emerald-400">5 Platforms</div>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-xs">
            <div className="text-slate-400">Response Speed</div>
            <div className="text-base font-black text-amber-400">&lt; 1.2s</div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
        {/* Quick Prompts Carousel */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
            Suggested Prompts:
          </span>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="shrink-0 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 hover:text-brand-700 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300 text-slate-700 dark:text-slate-300 font-semibold px-3 py-1.5 rounded-full transition-all text-xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Conversation Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-3.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-md shadow-brand-500/20">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
              )}

              <div className={`max-w-[80%] space-y-3 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-brand-500/20'
                      : 'bg-slate-100/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  {m.text}
                </div>

                {/* Recommendations Cards */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {m.recommendations.map(rec => (
                      <div
                        key={rec.id}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 p-4 rounded-2xl shadow-xs transition-all flex items-center justify-between gap-3"
                      >
                        <img src={rec.image} alt="" className="w-14 h-14 object-contain rounded-xl bg-slate-50 dark:bg-slate-900 p-1 shrink-0" />
                        <div className="flex-1 space-y-1">
                          <span className="text-[10px] bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-black px-2 py-0.5 rounded-full border border-brand-200/50 dark:border-brand-800/50">
                            {rec.tag}
                          </span>
                          <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{rec.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-brand-600 dark:text-brand-400">₹{rec.price.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-200/50 dark:border-emerald-800/50">
                              Score {rec.dealScore}/100
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/product/${rec.id}`)}
                          className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl shadow-xs"
                          title="View Deal"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs italic pl-14">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
              <span>Scanning live price indexes and checking merchant review authenticity...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
            <button
              onClick={handleImageUpload}
              title="Visual Product Search (Barcode / Receipt / Product Image)"
              className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleVoiceInput}
              title="Voice Search"
              className={`p-1.5 rounded-xl transition-colors ${
                isRecording ? 'text-rose-600 bg-rose-100 dark:bg-rose-950/60 animate-pulse' : 'text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isRecording ? 'Listening for question...' : 'Ask AI to evaluate a deal, compare specifications, or forecast price drops...'}
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 disabled:opacity-40 text-white rounded-xl shadow-md transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[11px] text-center text-slate-400 dark:text-slate-500">
            Powered by SmartDeals multi-store crawler and 90-day price volatility engine.
          </div>
        </div>
      </div>
    </div>
  );
};
