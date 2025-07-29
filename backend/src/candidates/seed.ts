import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CandidatesService } from './candidates.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const candidatesService = app.get(CandidatesService);

  const candidates = [
    {
      name: 'وليد جنبلاط',
      area: 'الشوف',
      summary: 'سياسي مخضرم له دور هام في تاريخ لبنان الحديث...',
      party: 'الحزب التقدمي الاشتراكي',
      bio: 'ولد وليد جنبلاط عام 1949 وتولى رئاسة الحزب التقدمي الاشتراكي بعد اغتيال والده كمال جنبلاط.',
      image: 'https://randomuser.me/api/portraits/men/11.jpg',
    },
    {
      name: 'سمير جعجع',
      area: 'بشري',
      summary: 'رئيس حزب القوات اللبنانية وشخصية سياسية مؤثرة...',
      party: 'القوات اللبنانية',
      bio: 'شارك في الحرب الأهلية اللبنانية وأصبح لاحقاً رئيس حزب القوات اللبنانية.',
      image: 'https://randomuser.me/api/portraits/men/12.jpg',
    },
    {
      name: 'ميشال عون',
      area: 'كسروان',
      summary: 'رئيس الجمهورية السابق وله تاريخ طويل في السياسة اللبنانية...',
      party: 'التيار الوطني الحر',
      bio: 'تولى رئاسة الجمهورية اللبنانية بين 2016 و2022 وكان قائد الجيش اللبناني.',
      image: 'https://randomuser.me/api/portraits/men/13.jpg',
    },
    {
      name: 'سعد الحريري',
      area: 'بيروت الثانية',
      summary: 'رئيس الوزراء السابق وزعيم تيار المستقبل...',
      party: 'تيار المستقبل',
      bio: 'دخل السياسة بعد اغتيال والده رفيق الحريري وتولى رئاسة الحكومة عدة مرات.',
      image: 'https://randomuser.me/api/portraits/men/14.jpg',
    },
    {
      name: 'نبيه بري',
      area: 'الجنوب الثالثة',
      summary: 'رئيس مجلس النواب الحالي وشخصية سياسية ذات نفوذ...',
      party: 'حركة أمل',
      bio: 'يتولى رئاسة مجلس النواب اللبناني منذ عام 1992 ويعد من أبرز الشخصيات السياسية.',
      image: 'https://randomuser.me/api/portraits/men/15.jpg',
    },
    {
      name: 'سليمان فرنجية',
      area: 'زغرتا',
      summary: 'رئيس تيار المردة وشخصية سياسية بارزة في الشمال...',
      party: 'تيار المردة',
      bio: 'ينتمي لعائلة سياسية عريقة وكان وزيراً للداخلية في السابق.',
      image: 'https://randomuser.me/api/portraits/men/16.jpg',
    },
    {
      name: 'جبران باسيل',
      area: 'البترون',
      summary: 'رئيس التيار الوطني الحر ووزير سابق...',
      party: 'التيار الوطني الحر',
      bio: 'تقلد عدة مناصب وزارية أبرزها الطاقة والخارجية.',
      image: 'https://randomuser.me/api/portraits/men/17.jpg',
    },
    {
      name: 'طلال أرسلان',
      area: 'عاليه',
      summary: 'رئيس الحزب الديمقراطي اللبناني وشخصية درزية مؤثرة...',
      party: 'الحزب الديمقراطي اللبناني',
      bio: 'نجل الأمير مجيد أرسلان وأحد الزعماء الدروز في لبنان.',
      image: 'https://randomuser.me/api/portraits/men/18.jpg',
    },
    {
      name: 'ستريدا جعجع',
      area: 'بشري',
      summary: 'نائبة في البرلمان اللبناني ولها دور فعال في الحياة السياسية...',
      party: 'القوات اللبنانية',
      bio: 'زوجة سمير جعجع وناشطة سياسية واجتماعية بارزة.',
      image: 'https://randomuser.me/api/portraits/women/19.jpg',
    },
    {
      name: 'إلياس أبو صعب',
      area: 'المتن',
      summary: 'وزير سابق ونائب حالي...',
      party: 'التيار الوطني الحر',
      bio: 'تقلد منصب وزير الدفاع في حكومة لبنان.',
      image: 'https://randomuser.me/api/portraits/men/20.jpg',
    },
    {
      name: 'بولا يعقوبيان',
      area: 'بيروت الأولى',
      summary: 'إعلامية سابقة ونائبة مستقلة...',
      party: 'خط التغيير',
      bio: 'تشتهر بمواقفها المعارضة للأحزاب التقليدية.',
      image: 'https://randomuser.me/api/portraits/women/21.jpg',
    },
    {
      name: 'ملحم خلف',
      area: 'بيروت الثانية',
      summary: 'نقيب المحامين السابق ونائب عن قوى التغيير...',
      party: 'مستقل',
      bio: 'كان نقيباً للمحامين وله تاريخ طويل في النشاط المدني.',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    {
      name: 'أسامة سعد',
      area: 'صيدا',
      summary: 'رئيس التنظيم الشعبي الناصري...',
      party: 'التنظيم الشعبي الناصري',
      bio: 'نائب حالي وله جذور عائلية سياسية في صيدا.',
      image: 'https://randomuser.me/api/portraits/men/23.jpg',
    },
    {
      name: 'نعمة افرام',
      area: 'كسروان',
      summary: 'رجل أعمال ونائب سابق...',
      party: 'مستقل',
      bio: 'أحد أبرز رجال الأعمال في لبنان وله نشاطات سياسية.',
      image: 'https://randomuser.me/api/portraits/men/24.jpg',
    },
    {
      name: 'فيصل كرامي',
      area: 'طرابلس',
      summary: 'وزير سابق ونائب حالي...',
      party: 'تيار الكرامة',
      bio: 'ينتمي لعائلة كرامي السياسية في طرابلس.',
      image: 'https://randomuser.me/api/portraits/men/25.jpg',
    },
    {
      name: 'جورج عدوان',
      area: 'الشوف',
      summary: 'نائب عن القوات اللبنانية...',
      party: 'القوات اللبنانية',
      bio: 'محام ونائب في البرلمان عن دائرة الشوف.',
      image: 'https://randomuser.me/api/portraits/men/26.jpg',
    },
    {
      name: 'حسن فضل الله',
      area: 'الجنوب الثانية',
      summary: 'نائب عن حزب الله...',
      party: 'حزب الله',
      bio: 'إعلامي سابق ونائب بارز في كتلة حزب الله.',
      image: 'https://randomuser.me/api/portraits/men/27.jpg',
    },
    {
      name: 'فيوليت صفير',
      area: 'زحلة',
      summary: 'ناشطة اجتماعية وسياسية...',
      party: 'مستقل',
      bio: 'مرشحة جديدة في الانتخابات عن دائرة زحلة.',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
    {
      name: 'شربل مارون',
      area: 'جبيل',
      summary: 'محام ونائب سابق...',
      party: 'التيار الوطني الحر',
      bio: 'من الوجوه المعروفة في دائرة جبيل.',
      image: 'https://randomuser.me/api/portraits/men/29.jpg',
    },
    {
      name: 'جان طالوزيان',
      area: 'بيروت الأولى',
      summary: 'نائب عن بيروت وعضو لجنة المال والموازنة...',
      party: 'حزب الطاشناق',
      bio: 'ينشط في القضايا المالية والاقتصادية.',
      image: 'https://randomuser.me/api/portraits/men/30.jpg',
    },
  ];

  for (const c of candidates) {
    await candidatesService.create(c);
    console.log(`✅ Added candidate: ${c.name}`);
  }

  console.log('🎉 تم إضافة جميع المرشحين بنجاح');
  await app.close();
}

seed().catch((err) => {
  console.error('❌ Error seeding candidates:', err);
});
