import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const { t } = useI18n();

  const quickLinks = [
    { href: '/courses', label: t('nav.courses') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const supportLinks = [
    { href: '/faq', label: t('footer.faq') },
    { href: '/contact', label: t('footer.contact') },
  ];

  const legalLinks = [
    { href: '/privacy', label: t('footer.privacy') },
    { href: '/terms', label: t('footer.terms') },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                <span className="text-xl font-bold text-primary-foreground">E</span>
              </div>
              <span className="text-xl font-bold">
                Edu<span className="text-primary">Vaza</span>
              </span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              {t('footer.aboutText')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="h-4 w-4 text-primary" />
                hello@eduvaza.com
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4 text-primary" />
                +254 700 000 000
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="h-4 w-4 text-primary" />
                Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-background/10">
          <p className="text-center text-sm text-background/50">
            © {new Date().getFullYear()} EduVaza. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
