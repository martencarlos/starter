'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';

import { SearchIcon } from 'lucide-react';

// Define the FAQ data
const faqData = [
    {
        id: 'account-1',
        category: 'account',
        question: 'How do I reset my password?',
        answer: 'To reset your password, click on the "Forgot password?" link on the login page. You will receive an email with instructions to create a new password. If you don\'t receive the email, check your spam folder or contact support.'
    },
    {
        id: 'account-2',
        category: 'account',
        question: 'How do I update my email address?',
        answer: 'You can update your email address in your profile settings. Go to your profile page, click on the "Account Info" tab, and update your email. You\'ll need to verify your new email address before the change takes effect.'
    },
    {
        id: 'account-3',
        category: 'account',
        question: 'Can I delete my account?',
        answer: 'Yes, you can delete your account from your profile settings. Go to your profile, find the account deletion option, and follow the instructions. Please note that account deletion is permanent and all your data will be removed.'
    },
    {
        id: 'billing-1',
        category: 'billing',
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for some plans. The available payment methods will be shown during the checkout process.'
    },
    {
        id: 'billing-2',
        category: 'billing',
        question: 'How do I update my billing information?',
        answer: 'You can update your billing information in your account settings under the "Billing" section. There you can change your payment method, update card details, or modify your billing address.'
    },
    {
        id: 'billing-3',
        category: 'billing',
        question: 'When will I be charged for my subscription?',
        answer: "Your subscription is charged at the beginning of each billing cycle. For monthly plans, this is the same day each month. For annual plans, it's the same day each year. You'll receive an email receipt for each payment."
    },
    {
        id: 'technical-1',
        category: 'technical',
        question: 'Why am I getting an "Access Denied" error?',
        answer: 'You may see an "Access Denied" error if you don\'t have the necessary permissions for the page you\'re trying to access, or if your session has expired. Try logging out and back in, or contact your administrator if you believe you should have access.'
    },
    {
        id: 'technical-2',
        category: 'technical',
        question: 'Which browsers are supported?',
        answer: 'Our application supports the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience and security.'
    },
    {
        id: 'technical-3',
        category: 'technical',
        question: 'Is there a mobile app available?',
        answer: 'Yes, we offer mobile apps for iOS and Android devices. You can download them from the App Store or Google Play Store. Our web application is also fully responsive and works well on mobile browsers.'
    }
];

// Categories for filtering
const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'account', name: 'Account' },
    { id: 'billing', name: 'Billing & Payments' },
    { id: 'technical', name: 'Technical' }
];

export function SupportFAQ() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    // Filter FAQs based on category and search query
    const filteredFaqs = faqData.filter((faq) => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch =
            searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Toggle FAQ item expansion
    const toggleItem = (id: string) => {
        setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    return (
        <div className='space-y-6'>
            {/* Search and filter */}
            <div className='space-y-4'>
                <div className='relative'>
                    <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                    <Input
                        type='search'
                        placeholder='Search FAQs...'
                        className='pl-10'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className='flex flex-wrap gap-2'>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                                activeCategory === category.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}>
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ list */}
            <div className='divide-y rounded-md border'>
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                        <div key={faq.id} className='transition-all duration-200'>
                            <button
                                onClick={() => toggleItem(faq.id)}
                                className='focus:ring-ring/50 flex w-full items-center justify-between px-4 py-4 text-left font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none'
                                aria-expanded={expandedItems.includes(faq.id)}>
                                <span>{faq.question}</span>
                                <svg
                                    className={`h-5 w-5 transition-transform ${
                                        expandedItems.includes(faq.id) ? 'rotate-180' : ''
                                    }`}
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M19 9l-7 7-7-7'
                                    />
                                </svg>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    expandedItems.includes(faq.id) ? 'max-h-96' : 'max-h-0'
                                }`}>
                                <div className='bg-muted/50 text-muted-foreground px-4 py-3 text-sm'>{faq.answer}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='p-6 text-center'>
                        <p className='text-muted-foreground'>
                            No matching FAQs found. Please try a different search term or category.
                        </p>
                    </div>
                )}
            </div>

            <div className='mt-6 rounded-lg border p-4 text-center'>
                <p className='text-muted-foreground'>Can't find what you're looking for?</p>
                <p className='mt-1 font-medium'>
                    Contact our support team using the{' '}
                    <button onClick={() => (window.location.hash = '#contact')} className='text-primary underline'>
                        contact form
                    </button>
                </p>
            </div>
        </div>
    );
}
