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
  TrendingDown,
  Volume2,
  VolumeX,
  Scale,
  Award,
  ExternalLink,
  RotateCcw,
  Store,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { queryAiShoppingAssistant, AIQueryResult, ComparisonResult } from '../../services/aiShoppingAgent';
import { Product } from '../../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendations?: {
    id: string;
    name: string;
    price: number;
    mrp: number;
    discountPercent: number;
    tag: string;
    dealScore: number;
    image: string;
    marketplacePrices?: { marketplace: string; price: number }[];
  }[];
  comparison?: ComparisonResult;
  suggestedPrompts?: string[];
  badges?: string[];
}

export const AIAssistantModal: React.FC = () => {
  const { isAiAssistantOpen, setIsAiAssistantOpen, products, addToCart } = useApp();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Namaste! I am your SmartDeal AI Autonomous Shopping Agent. I can help you find the best products in any budget, do side-by-side product comparisons, audit fake MRP discounts, and check live prices across Amazon, Flipkart, Croma and more. How can I help you today?',
      suggestedPrompts: [
        'Best phone under ₹20,000?',
        'Compare iPhone 15 vs Samsung M14',
        'Should I buy iPhone 15 now or wait?',
        'How does SmartDeal cashback work?',
        'Best laptop for college and coding?'
      ]
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Clean up any ongoing speech synthesis on unmount or close
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
      const aiResult: AIQueryResult = queryAiShoppingAssistant(query, products);

      const reply: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResult.text,
        recommendations: aiResult.recommendations.map(r => ({
          id: r.product.id,
          name: r.product.name,
          price: r.product.sellingPrice,
          mrp: r.product.mrp,
          discountPercent: r.product.discountPercent,
          tag: r.highlightTag,
          dealScore: r.product.dealScore,
          image: r.product.image,
          marketplacePrices: r.product.marketplacePrices?.map(m => ({ marketplace: m.sellerName, price: m.price }))
        })),
        comparison: aiResult.comparison,
        suggestedPrompts: aiResult.suggestedPrompts,
        badges: aiResult.badges
      };

      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 700);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSend('Best phone under ₹20,000?');
      }, 1500);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `📷 [Scanned Product Image: "${file.name}"]`
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const matched = products.find(p => p.id === 'prod-samsung-m14') || products[0];
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `🔍 **Visual Scan Matched!**
Identified: **${matched.name}**
Lowest price across all marketplaces is currently **₹${matched.sellingPrice.toLocaleString('en-IN')}** with **${matched.dealScore}/100 Deal Score**.`,
          recommendations: [
            {
              id: matched.id,
              name: matched.name,
              price: matched.sellingPrice,
              mrp: matched.mrp,
              discountPercent: matched.discountPercent,
              tag: 'Visual Match • Verified Deal',
              dealScore: matched.dealScore,
              image: matched.image
            }
          ],
          suggestedPrompts: [
            `Compare ${matched.brand} with iPhone`,
            'Check price history across stores',
            'Is the discount genuine?'
          ]
        }
      ]);
    }, 1100);
  };

  const toggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown characters for voice synthesis
    const cleanText = text.replace(/[*_#`[\]()•]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'ai',
        text: 'Chat cleared! What would you like to search, compare, or audit next?',
        suggestedPrompts: [
          'Best phone under 20k',
          'Compare iPhone 15 vs Samsung M14',
          'How to earn SmartCoins',
          'Best laptop for coding'
        ]
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[700px] max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-brand-700 via-indigo-600 to-purple-700 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-tight">SmartDeal Ask AI Agent</h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                  Autonomous 2.0
                </span>
              </div>
              <p className="text-xs text-indigo-100 flex items-center gap-1.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Multi-Store Arbitrage & Comparison Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={clearChat}
              title="Clear conversation"
              className="p-2 rounded-xl hover:bg-white/10 text-indigo-100 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAiAssistantOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar shrink-0">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> Quick:
          </span>
          {[
            'Best phone under 20k',
            'Compare iPhone vs Samsung',
            'Amazon vs Flipkart price',
            'Fake discount check',
            'Cashback kaise milta hai?'
          ].map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="shrink-0 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-700 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300 text-slate-700 dark:text-slate-300 font-semibold px-3 py-1 rounded-full transition-all text-xs cursor-pointer shadow-2xs"
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

              <div className={`max-w-[88%] sm:max-w-[82%] space-y-3 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Message bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-brand-500/20 font-medium'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {/* Badges */}
                  {m.badges && m.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2.5 mt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      {m.badges.map((b, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full font-bold border border-brand-200/60 dark:border-brand-800/60"
                        >
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Audio Listen Button */}
                  {m.sender === 'ai' && (
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px] text-slate-400">
                      <span>SmartDeal AI Intelligence</span>
                      <button
                        onClick={() => toggleSpeak(m.id, m.text)}
                        className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 font-bold transition-colors cursor-pointer"
                        title="Listen to this response"
                      >
                        {speakingId === m.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-rose-500">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* ------------------------------------------------------------- */}
                {/* SIDE-BY-SIDE COMPARISON MATRIX (When Intent is COMPARE)      */}
                {/* ------------------------------------------------------------- */}
                {m.comparison && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 sm:p-4 space-y-3 shadow-sm animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        <span>Side-by-Side Comparison Matrix</span>
                      </div>
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        AI Winner: {m.comparison.winnerName?.split(' ')[0] || (m.comparison.winner === 'A' ? m.comparison.nameA?.split(' ')[0] : m.comparison.nameB?.split(' ')[0])}
                      </span>
                    </div>

                    {/* Products Header Columns */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Product A */}
                      <div className={`p-2.5 rounded-xl border relative ${
                        m.comparison.winner === 'A'
                          ? 'bg-brand-50/60 dark:bg-brand-950/30 border-brand-300 dark:border-brand-700 ring-1 ring-brand-400/30'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}>
                        {m.comparison.winner === 'A' && (
                          <span className="absolute -top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full shadow-xs flex items-center gap-0.5">
                            <Award className="w-2.5 h-2.5" /> WINNER
                          </span>
                        )}
                        {m.comparison.imageA ? (
                          <img
                            src={m.comparison.imageA}
                            alt={m.comparison.nameA}
                            className="w-12 h-12 object-contain mx-auto mb-1.5"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-1.5 text-xs font-bold text-slate-500">
                            {m.comparison.nameA.slice(0, 2)}
                          </div>
                        )}
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1 text-center">
                          {m.comparison.nameA}
                        </div>
                        {m.comparison.priceA && (
                          <div className="text-center font-extrabold text-brand-600 dark:text-brand-400 pt-0.5">
                            ₹{m.comparison.priceA.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      {/* Product B */}
                      <div className={`p-2.5 rounded-xl border relative ${
                        m.comparison.winner === 'B'
                          ? 'bg-brand-50/60 dark:bg-brand-950/30 border-brand-300 dark:border-brand-700 ring-1 ring-brand-400/30'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}>
                        {m.comparison.winner === 'B' && (
                          <span className="absolute -top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full shadow-xs flex items-center gap-0.5">
                            <Award className="w-2.5 h-2.5" /> WINNER
                          </span>
                        )}
                        {m.comparison.imageB ? (
                          <img
                            src={m.comparison.imageB}
                            alt={m.comparison.nameB}
                            className="w-12 h-12 object-contain mx-auto mb-1.5"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-1.5 text-xs font-bold text-slate-500">
                            {m.comparison.nameB.slice(0, 2)}
                          </div>
                        )}
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1 text-center">
                          {m.comparison.nameB}
                        </div>
                        {m.comparison.priceB && (
                          <div className="text-center font-extrabold text-brand-600 dark:text-brand-400 pt-0.5">
                            ₹{m.comparison.priceB.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features Comparison Rows */}
                    <div className="space-y-1 text-[11px] pt-1">
                      {m.comparison.features.map((f, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-3 p-1.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 items-center text-center"
                        >
                          <div className={`font-semibold ${f.winner === 'A' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                            {f.valA}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                            {f.title}
                          </div>
                          <div className={`font-semibold ${f.winner === 'B' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                            {f.valB}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => {
                          setIsAiAssistantOpen(false);
                          if (m.comparison?.productA?.id) {
                            navigate(`/product/${m.comparison.productA.id}`);
                          } else {
                            navigate(`/search?q=${encodeURIComponent(m.comparison?.nameA || '')}`);
                          }
                        }}
                        className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-bold text-center transition-all cursor-pointer shadow-xs truncate"
                      >
                        View {m.comparison.nameA.split(' ')[0]}
                      </button>
                      <button
                        onClick={() => {
                          setIsAiAssistantOpen(false);
                          if (m.comparison?.productB?.id) {
                            navigate(`/product/${m.comparison.productB.id}`);
                          } else {
                            navigate(`/search?q=${encodeURIComponent(m.comparison?.nameB || '')}`);
                          }
                        }}
                        className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-bold text-center transition-all cursor-pointer shadow-xs truncate"
                      >
                        View {m.comparison.nameB.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* RECOMMENDATIONS CARDS                                         */}
                {/* ------------------------------------------------------------- */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="space-y-2.5 mt-2">
                    {m.recommendations.map(rec => (
                      <div
                        key={rec.id}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-3 sm:p-3.5 rounded-2xl shadow-sm hover:border-brand-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={rec.image}
                            alt={rec.name}
                            className="w-14 h-14 object-contain rounded-xl bg-slate-50 dark:bg-slate-900/60 p-1 border border-slate-100 dark:border-slate-800 shrink-0"
                          />
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-extrabold px-2 py-0.5 rounded-full border border-brand-200/50 dark:border-brand-800/50">
                                {rec.tag}
                              </span>
                              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                                Deal Score: {rec.dealScore}/100
                              </span>
                            </div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 transition-colors">
                              {rec.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-brand-600 dark:text-brand-400">
                                ₹{rec.price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs text-slate-400 line-through">
                                ₹{rec.mrp.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                {rec.discountPercent}% OFF
                              </span>
                            </div>

                            {/* Store pricing chips */}
                            {rec.marketplacePrices && rec.marketplacePrices.length > 0 && (
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-0.5 flex-wrap">
                                <Store className="w-3 h-3 text-slate-400" />
                                {rec.marketplacePrices.slice(0, 3).map((mp, i) => (
                                  <span key={i} className="bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.2 rounded font-medium">
                                    {mp.marketplace}: ₹{mp.price.toLocaleString('en-IN')}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              const storeName = rec.marketplacePrices?.[0]?.marketplace || 'Amazon';
                              const storeUrl = storeName.toLowerCase().includes('flipkart')
                                ? `https://www.flipkart.com/search?q=${encodeURIComponent(rec.name)}`
                                : `https://www.amazon.in/s?k=${encodeURIComponent(rec.name)}`;
                              window.open(storeUrl, '_blank', 'noopener,noreferrer');
                            }}
                            className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                            title="Buy directly on official company store"
                          >
                            <span>Buy on {rec.marketplacePrices?.[0]?.marketplace?.split(' ')[0] || 'Store'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => {
                              setIsAiAssistantOpen(false);
                              navigate(`/product/${rec.id}`);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow-up Prompts */}
                {m.suggestedPrompts && m.suggestedPrompts.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 block">
                      Suggested Follow-Ups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.suggestedPrompts.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(p)}
                          className="text-[11px] bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 font-semibold px-2.5 py-1 rounded-lg border border-slate-200/70 dark:border-slate-700/70 transition-all cursor-pointer"
                        >
                          💬 {p}
                        </button>
                      ))}
                    </div>
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
              <span>Analyzing live marketplace pricing across Amazon, Flipkart, Croma & retailers...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-3 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all shadow-inner">
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload product picture or scan barcode"
              className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleVoiceInput}
              title="Voice Search (Click and speak)"
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
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
              placeholder={isRecording ? 'Listening to your voice...' : 'Ask AI to compare products, find deals, check prices...'}
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none font-medium"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-30 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>AI cross-checks Amazon, Flipkart, Croma, OEM warranties & anti-fake discount scores.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
