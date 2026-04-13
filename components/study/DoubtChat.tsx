'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  planId: string;
  day: number;
  isPro: boolean;
}

export default function DoubtChat({ planId, day, isPro }: Props) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const res = await fetch('/api/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, day, question }),
      });
      const data = await res.json();
      if (data.answer) {
        setMessages((m) => [...m, { role: 'assistant', content: data.answer }]);
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: t('common.error') }]);
    } finally {
      setLoading(false);
    }
  }

  if (!isPro) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{t('study.doubt.pro')}</h3>
        <p className="text-gray-500 text-sm mb-5">Ask any doubt from today's lesson and get an instant AI explanation.</p>
        <Link
          href="/#pricing"
          className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-sm"
        >
          {t('study.doubt.upgrade')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-gray-900">{t('study.doubt')}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-6">{t('study.weekend.sub')}</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm">
              {t('study.doubt.thinking')}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={t('study.doubt.placeholder')}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
