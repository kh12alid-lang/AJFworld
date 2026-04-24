import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
}

const quickReplies = {
  ar: [
    'كيف أطلب؟',
    'متى يصل طلبي؟',
    'هل يوجد خصومات؟',
    'كيف أتواصل مع الدعم؟',
  ],
  en: [
    'How do I order?',
    'When will my order arrive?',
    'Are there any discounts?',
    'How to contact support?',
  ],
};

const botResponses: Record<string, Record<string, string>> = {
  ar: {
    'كيف أطلب؟': 'يمكنك الطلب بسهولة: 1) اختر المنتج 2) أضف للسلة 3) أكمل الدفع. هل تحتاج مساعدة في خطوة معينة؟',
    'متى يصل طلبي؟': 'التوصيل خلال 1-3 أيام عمل في دبي وأبوظبي، و3-5 أيام في باقي الإمارات.',
    'هل يوجد خصومات؟': 'نعم! استخدم كود WELCOME20 لخصم 20% على أول طلب. تفقد صفحة الكوبونات للمزيد.',
    'كيف أتواصل مع الدعم؟': 'يمكنك التواصل معنا عبر: support@ajfworld.ae أو الاتصال على رقم الدعم.',
    'default': 'شكراً لتواصلك مع AJFworld! كيف يمكنني مساعدتك اليوم؟',
  },
  en: {
    'How do I order?': 'You can order easily: 1) Select product 2) Add to cart 3) Complete payment. Need help with a specific step?',
    'When will my order arrive?': 'Delivery within 1-3 business days in Dubai & Abu Dhabi, 3-5 days in other emirates.',
    'Are there any discounts?': 'Yes! Use code WELCOME20 for 20% off your first order. Check the coupons page for more.',
    'How to contact support?': 'Contact us via: support@ajfworld.ae or call our support number.',
    'default': 'Thank you for contacting AJFworld! How can I help you today?',
  },
};

export default function LiveChat() {
  const { language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: language === 'ar' 
        ? 'مرحباً بك في AJFworld! كيف يمكنني مساعدتك؟'
        : 'Welcome to AJFworld! How can I help you?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Bot response
    setTimeout(() => {
      const responses = botResponses[language === 'ar' ? 'ar' : 'en'];
      const responseText = responses[inputText] || responses['default'];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Bot response
    setTimeout(() => {
      const responses = botResponses[language === 'ar' ? 'ar' : 'en'];
      const responseText = responses[reply] || responses['default'];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#2d5d2a] text-white rounded-full shadow-lg hover:bg-[#1e401c] transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-6 left-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2d5d2a] to-[#1e401c] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">
                  {language === 'ar' ? 'دعم AJFworld' : 'AJFworld Support'}
                </h3>
                <p className="text-white/70 text-sm">
                  {language === 'ar' ? 'متصل الآن' : 'Online now'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-[#2d5d2a] text-white rounded-tr-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-AE' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {quickReplies[language === 'ar' ? 'ar' : 'en'].map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-2 bg-white border border-[#2d5d2a] text-[#2d5d2a] rounded-full text-sm hover:bg-[#2d5d2a] hover:text-white transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'
                }
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2d5d2a] focus:border-transparent"
              />
              <Button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="w-10 h-10 p-0 rounded-full bg-[#2d5d2a] hover:bg-[#1e401c] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
