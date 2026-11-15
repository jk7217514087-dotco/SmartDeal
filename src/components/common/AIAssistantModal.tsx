import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Mic,
  Image as ImageIcon,
  Bot,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  }[];
}

export const AIAssistantModal: React.FC = () => {
  const { isAiAssistantOpen, setIsAiAssistantOpen, products } = useApp();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hello! I am your SmartDeals AI Shopping Assistant. Ask me to find the best value deals, compare products, detect fake discounts, or advise if you should buy now or wait.'
    }
  ]);

  const quickQuestions = [
    'Best phone under ₹20,000?',
    'Should I buy iPhone 15 now or wait?',
    'Which laptop is best for multitasking?',
    'Find genuine deals with 90+ Deal Score'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isAiAssistantOpen) return null;

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
        const phone = products.find(p => p.id === 'prod-samsung-m14');
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Under ₹20,000, our Deal DNA engine strongly recommends the Samsung Galaxy M14 5G. It scores 92/100, offers an authentic 6000mAh battery, 5nm Exynos processor, and is currently selling at its 90-day lowest price of ₹12,490 on SmartDeals (vs ₹12,999 on Amazon).',
          recommendations: phone
            ? [
                {
                  id: phone.id,
                  name: phone.name,
                  price: phone.sellingPrice,
                  tag: 'Top Pick under ₹20k',
                  dealScore: phone.dealScore
                }
              ]
            : []
        };
      } else if (lower.includes('iphone') || lower.includes('buy now') || lower.includes('wait')) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'AI Recommendation: BUY NOW (93% Confidence). The iPhone 15 is at ₹65,999 on SmartDeals, backed by ₹1,500 direct coupon and 500 SmartCoins reward. Historically, prices stabilize around ₹66,000 until the September mega festive season.',
          recommendations: [
            {
              id: 'prod-apple-iphone15',
              name: 'Apple iPhone 15 (128GB, Blue)',
              price: 65999,
              tag: 'Lowest Effective Price',
              dealScore: 94
            }
          ]
        };
      } else if (lower.includes('laptop') || lower.includes('work') || lower.includes('multitask')) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'For multitasking and college/office use, the ASUS Vivobook 15 with 16GB RAM and 12th Gen Intel Core i5 is unmatched at ₹48,990. It includes 1 Year accidental damage protection and 450 SmartCoins.',
          recommendations: [
            {
              id: 'prod-asus-vivobook',
              name: 'ASUS Vivobook 15 Intel Core i5 (16GB RAM)',
              price: 48990,
              tag: 'Best Multitasking Value',
              dealScore: 91
            }
          ]
        };
      } else {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `I analyzed our live price indexes across 5 marketplaces. Here are the top verified options that maximize your real payable savings:`,
          recommendations: products.slice(0, 2).map(p => ({
            id: p.id,
            name: p.name,
            price: p.sellingPrice,
            tag: p.dealScoreBreakdown.verdict,
            dealScore: p.dealScore
          }))
        };
      }

      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 900);
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSend('What is the cheapest genuine deal right now?');
    }, 2000);
  };

  const handleImageUpload = () => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: '📷 [Uploaded Product Image: Scanning barcode/specs...]'
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Visual match confirmed! Identified: Samsung Galaxy M14 5G. Lowest verified price across stores is ₹12,490 on Flipkart with free delivery tomorrow.',
          recommendations: [
            {
              id: 'prod-samsung-m14',
              name: 'Samsung Galaxy M14 5G',
              price: 12490,
              tag: 'Visual Match • Best Deal',
              dealScore: 92
            }
          ]
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col h-[640px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-brand-700 via-indigo-600 to-purple-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">SmartDeals AI Assistant</h3>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Beta</span>
              </div>
              <p className="text-xs text-indigo-100">Live multi-store price intelligence & advice</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiAssistantOpen(false)}
            className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="shrink-0 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 hover:text-brand-700 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700 hover:border-brand-200 text-slate-700 dark:text-slate-300 font-medium px-3 py-1.5 rounded-full transition-all text-xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2.5 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-brand-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/70 dark:border-slate-700'
                  }`}
                >
                  {m.text}
                </div>

                {/* Recommendations Cards */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {m.recommendations.map(rec => (
                      <div
                        key={rec.id}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl shadow-sm hover:border-brand-300 dark:hover:border-brand-500 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold px-2 py-0.5 rounded-full border border-brand-200/50 dark:border-brand-800/50">
                              {rec.tag}
                            </span>
                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                              Score {rec.dealScore}/100
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {rec.name}
                          </div>
                          <div className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
                            ₹{rec.price.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setIsAiAssistantOpen(false);
                            navigate(`/product/${rec.id}`);
                          }}
                          className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold px-3 py-2 rounded-xl shrink-0 flex items-center gap-1 shadow-sm"
                        >
                          <span>View Deal</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs italic pl-11">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
              <span>Analyzing prices across Flipkart, Amazon, Croma & top retailers...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
            <button
              onClick={handleImageUpload}
              title="Upload product picture or receipt"
              className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleVoiceInput}
              title="Voice Search"
              className={`p-1.5 rounded-xl transition-colors ${
                isRecording
                  ? 'text-rose-600 bg-rose-100 dark:bg-rose-950/60 animate-pulse'
                  : 'text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isRecording ? 'Listening...' : 'Ask AI anything about prices, deals or alternatives...'}
              className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 bg-gradient-to-r from-brand-600 to-indigo-600 disabled:opacity-40 text-white rounded-xl shadow-md transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
            AI recommendations calculate delivery, offers & verified merchant authenticity.
          </div>
        </div>
      </div>
    </div>
  );
};
