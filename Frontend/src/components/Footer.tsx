import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Features', href: '/features' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Documentation', href: '/docs' },
            { name: 'Updates', href: '/updates' },
        ],
        support: [
            { name: 'Help Center', href: '/help' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Status', href: '/status' },
        ],
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Blog', href: '/blog' },
            { name: 'Careers', href: '/careers' },
            { name: 'Contact', href: '/contact' },
        ],
        social: [
            { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
            { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
            { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
            { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
            { name: 'GitHub', href: 'https://github.com', icon: Github },
        ],
    };

    return (
        <footer className="relative bg-[#030303] pt-24 pb-12 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 opacity-50" />
                <div className="absolute h-[200px] w-[200px] rounded-full bg-purple-500/30 blur-3xl -bottom-20 -left-20" />
                <div className="absolute h-[200px] w-[200px] rounded-full bg-blue-500/20 blur-3xl -top-20 -right-20" />
            </div>

            <div className="relative max-w-7xl mx-auto px-8">
                {/* Main footer content */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    {/* Logo and description */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                            Course Guider
                        </h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                            AI-powered education guidance to help shape your academic future.
                        </p>
                    </div>

                    {/* Links sections */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Copyright */}
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Course Guider. All rights reserved.
                        </p>

                        {/* Social links */}
                        <div className="flex space-x-6">
                            {footerLinks.social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
