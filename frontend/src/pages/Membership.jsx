import { motion } from 'framer-motion';
import { Check, Star, Gift, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Membership = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Starter',
            price: 'Free',
            description: 'Perfect for discovering stories',
            features: [
                'Read unlimited stories',
                'Basic profile',
                'Like and comment on stories',
                'Save favorite stories',
            ],
            icon: Star,
            recommended: false
        },
        {
            name: 'Creator',
            price: '$9.99',
            period: '/month',
            description: 'Perfect for storytellers',
            features: [
                'Everything in Starter',
                'Create and publish unlimited stories',
                'Advanced analytics',
                'Custom story templates',
                'Priority support',
                'Ad-free reading experience',
            ],
            icon: TrendingUp,
            recommended: true
        },
        {
            name: 'Premium',
            price: '$19.99',
            period: '/month',
            description: 'For power users',
            features: [
                'Everything in Creator',
                'Monetize your stories',
                'Exclusive premium content',
                'Advanced SEO tools',
                'Custom domain',
                'Team collaboration',
                'Direct author support',
            ],
            icon: Gift,
            recommended: false
        },
    ];

    const handleUpgrade = (planName) => {
        if (!user) {
            toast.error('Please login first');
            navigate('/login');
            return;
        }
        toast.success(`Welcome to ${planName} plan! 🎉`);
    };

    return (
        <div className="relative min-h-screen pt-24 pb-20 bg-gradient-to-b from-slate-50 to-white dark:from-dark dark:to-slate-900">
            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl sm:text-6xl font-bold font-display text-slate-900 dark:text-white mb-6">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Start free and upgrade anytime. No hidden fees, cancel anytime.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {plans.map((plan, index) => {
                        const IconComponent = plan.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                                    plan.recommended
                                        ? 'ring-2 ring-primary-500 shadow-2xl shadow-primary-500/20 scale-105'
                                        : 'ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-primary-500'
                                }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-bold py-2 text-center">
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className={`p-8 ${
                                    plan.recommended
                                        ? 'bg-gradient-to-b from-primary-50 to-white dark:from-primary-900/20 dark:to-slate-900'
                                        : 'bg-white dark:bg-slate-800'
                                }`}>
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className={`p-3 rounded-lg ${
                                            plan.recommended
                                                ? 'bg-primary-100 dark:bg-primary-900/30'
                                                : 'bg-slate-100 dark:bg-slate-700'
                                        }`}>
                                            <IconComponent className={`w-6 h-6 ${
                                                plan.recommended
                                                    ? 'text-primary-600'
                                                    : 'text-slate-600 dark:text-slate-300'
                                            }`} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {plan.name}
                                        </h3>
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                                        {plan.description}
                                    </p>

                                    <div className="mb-8">
                                        <div className="flex items-baseline">
                                            <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                                {plan.price}
                                            </span>
                                            {plan.period && (
                                                <span className="text-slate-600 dark:text-slate-400 ml-2">
                                                    {plan.period}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleUpgrade(plan.name)}
                                        className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 mb-8 ${
                                            plan.recommended
                                                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/30 hover:scale-105'
                                                : 'border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-primary-500 hover:text-primary-600'
                                        }`}
                                    >
                                        {plan.price === 'Free' ? 'Get Started' : 'Upgrade Now'}
                                    </button>

                                    <div className="space-y-4">
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-start space-x-3">
                                                <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        {[
                            {
                                q: 'Can I change my plan anytime?',
                                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
                            },
                            {
                                q: 'Do you offer refunds?',
                                a: 'We offer a 7-day money-back guarantee for all paid plans. No questions asked.'
                            },
                            {
                                q: 'What payment methods do you accept?',
                                a: 'We accept all major credit cards, PayPal, and Apple Pay for your convenience.'
                            },
                            {
                                q: 'Is there a free trial?',
                                a: 'Yes! Start with our free Starter plan and try Creator features with a 14-day free trial.'
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            >
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                    {item.q}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Membership;
