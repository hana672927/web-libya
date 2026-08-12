export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
}

export interface ContactInfo {
  facebook: string;
  instagram: string;
  tiktok: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    image: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
    features: string[];
  };
  portfolio: {
    title: string;
    subtitle: string;
    projects: PortfolioProject[];
  };
  contact: {
    title: string;
    subtitle: string;
    info: ContactInfo;
  };
  footer: {
    copyright: string;
  };
  adminPasscode: string;
}

export const defaultContent: SiteContent = {
  hero: {
    title: 'نصمم مواقع إلكترونية تُلهم وتُنجز',
    subtitle:
      'ويب ليبيا — وكالة متخصصة في تصميم وتطوير المواقع الإلكترونية العصرية في ليبيا. نبني تجارب رقمية سريعة، آمنة، ومتجاوبة تعكس هوية علامتك التجارية.',
    ctaText: 'تواصل معنا',
    image:
      'https://images.pexels.com/photos/326514/pexels-photo-326514.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  about: {
    title: 'من نحن',
    description:
      'ويب ليبيا وكالة رقمية تأسست لتقديم حلول ويب احترافية تناسب السوق الليبي والعربي. نجمع بين الإبداع في التصميم والخبرة في البرمجة لنقدّم مواقع تُحقق أهداف عملائنا. نؤمن أن كل مشروع فريد، لذلك نُصمم حلولاً مخصصة تناسب هويتك واحتياجاتك بدقة.',
    image:
      'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: [
      'تصميم عصري ومتجاوب مع جميع الأجهزة',
      'أداء عالٍ وسرعة تحميل فائقة',
      'تحسين محركات البحث (SEO)',
      'دعم فني متواصل بعد الإطلاق',
      'لوحة تحكم سهلة لإدارة المحتوى',
      'أمان وحماية متقدمة للبيانات',
    ],
  },
  portfolio: {
    title: 'أعمالنا السابقة',
    subtitle: 'مشاريع نفخر بتنفيذها لعملائنا في مختلف المجالات',
    projects: [
      {
        id: 'p1',
        title: 'موقع مطعم الذواقة',
        description: 'موقع إلكتروني متكامل لمطعم فاخر مع قائمة طعام رقمية ونظام حجز طاولة.',
        image:
          'https://images.pexels.com/photos/4921028/pexels-photo-4921028.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        link: '#',
        category: 'مطاعم',
      },
      {
        id: 'p2',
        title: 'متجر إلكتروني',
        description: 'منصة تجارة إلكترونية متكاملة مع سلة شراء وبوابة دفع آمنة.',
        image:
          'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        link: '#',
        category: 'تجارة إلكترونية',
      },
      {
        id: 'p3',
        title: 'هوية بصرية لشركة',
        description: 'تصميم هوية بصرية متكاملة تشمل الشعار والموقع الإلكتروني والمطبوعات.',
        image:
          'https://images.pexels.com/photos/7318941/pexels-photo-7318941.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        link: '#',
        category: 'هوية بصرية',
      },
      {
        id: 'p4',
        title: 'تطبيق توصيل',
        description: 'تصميم واجهة تطبيق توصيل مع تجربة مستخدم سلسة وتصميم عصري.',
        image:
          'https://images.pexels.com/photos/16052344/pexels-photo-16052344.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        link: '#',
        category: 'تطبيقات',
      },
      {
        id: 'p5',
        title: 'موقع شركة عقارات',
        description: 'موقع عقاري تفاعلي مع بحث متقدم وعرض ثلاثي الأبعاد للعقارات.',
        image:
          'https://images.pexels.com/photos/38519/macbook-laptop-ipad-apple-38519.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        link: '#',
        category: 'عقارات',
      },
      {
        id: 'p6',
        title: 'منصة تعليمية',
        description: 'منصة تعليم إلكتروني مع نظام إدارة طلاب ودورات تفاعلية.',
        image:
          'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        link: '#',
        category: 'تعليم',
      },
    ],
  },
  contact: {
    title: 'تواصل معنا',
    subtitle: 'جاهزون لتحويل فكرتك إلى واقع رقمي. أرسل طلبك اليوم!',
    info: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      tiktok: 'https://tiktok.com',
    },
  },
  footer: {
    copyright: '© 2026 ويب ليبيا. جميع الحقوق محفوظة.',
  },
  adminPasscode: 'admin1280',
};
