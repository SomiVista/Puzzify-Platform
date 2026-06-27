import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const content = {
  en: {
    navHow:'How it works', navUses:'Use cases', navPricing:'Pricing', navCta:'Create free',
    themeBirthday:'Birthday', themeMystery:'Mystery',
    heroKicker:'You just played one. Now make one.',
    heroHeadline:'Turn any gift into a mini-escape room.',
    heroSub:'Puzzify turns a digital gift, message, or announcement into a personalized online quest. You build the mystery — they play to unlock their reward. No app, no login.',
    heroCta1:'Create your first quest — free', heroCta2:'See a live demo',
    playerKicker:'Quest · A Year of Us', puzzleType:'Password Lock', playerTitle:'The First Clue',
    playerPrompt:'Where did we first share a coffee? One word.', inputPlaceholder:'Type your answer', submit:'Unlock', watermark:'Made with Puzzify',
    trustLine:'Spend five minutes. Deliver something unforgettable.',
    trustStats:['120k+ quests played','No app · no login','Opens in any chat app'],
    howKicker:'How it works', howTitle:'Three steps to a surprise',
    howSub:'From blank canvas to a link worth opening — in the time it takes to wrap a present.',
    how:[
      { t:'Build a quest', d:'Stack puzzles in the Creator Studio. Pick a theme, add your clues and the reward at the end.' },
      { t:'Send one link', d:'Share a single link in WhatsApp, Telegram, Instagram — or print it on a card.' },
      { t:'They play & unlock', d:'No download. They solve each clue and watch the box open on their reward.' },
    ],
    howStepLabel:'Step',
    ptKicker:'Puzzle types', ptTitle:'Puzzles that feel personal',
    ptSub:'Mix and match modules per step. Each one reads the same theme tokens.',
    pt:[
      { tag:'Password Lock', title:'Ask something only they know', desc:'One word, a date, an inside joke — type it right and the next step opens.' },
      { tag:'Trivia', title:'Multiple choice with media', desc:'Pose a question with a photo, audio, or video clue. The right answer lights up green.' },
      { tag:'Image Hotspot', title:'Hide a clue in a scene', desc:'Drop a pulsing hotspot on any photo. They tap to find what you hid.', premium:'Premium' },
    ],
    ucKicker:'Use cases', ucTitle:'One engine, every occasion',
    ucSub:'Re-skin the same components — no holiday is ever hardcoded. Flip a theme and the whole quest changes mood.',
    uc:['Birthdays','Anniversaries','Inside jokes','Corporate onboarding','Product reveals','Proposals'],
    whyKicker:'Why Puzzify', whyTitle:'The delivery is the gift',
    whySub:'A surprise they unlock beats a link they ignore. Built to convert the moment of delight into the next quest.',
    why:[
      { t:'Unforgettable delivery', d:'The journey to the reward is the present. People screenshot the finale, not the gift card.' },
      { t:'Zero friction to receive', d:'No app, no login, no signup for recipients. They tap a link and start playing.' },
      { t:'Works where they already are', d:'Runs inside WhatsApp, Telegram, and Instagram in-app browsers on any phone.' },
      { t:'Multilingual & RTL', d:'English, Persian, and more — layouts mirror natively with no broken text.' },
    ],
    prKicker:'Pricing', prTitle:'Start free. Upgrade per surprise.',
    prSub:'Make your first quest for nothing. Pay once when you want the premium finish — or scale to a team.',
    recommended:'Most popular',
    pricing:[
      { name:'Freemium', price:'$0', period:'free forever', tagline:'For your first surprise', cta:'Create free',
        features:['Up to 3 steps','Base puzzle modules','Birthday & Mystery themes','Puzzify watermark'] },
      { name:'Premium Box', price:'$4', period:'one-time, per quest', tagline:'For the surprise that has to land', cta:'Build a premium quest', rec:true,
        features:['Unlimited steps','Premium themes, particles & audio','Image Hotspot module','No watermark'] },
      { name:'Corporate', price:'Custom', period:'billed annually', tagline:'For teams, events & launches', cta:'Talk to us',
        features:['Team dashboard & seats','White-label & custom domains','Analytics & play tracking','Priority support'] },
    ],
    finalKicker:'Your turn', finalLine:'Want to surprise someone else?', finalSub:'Create your first quest free — they will be asking how you did it.',
    finalCta:'Create your first quest — free',
    footTagline:'Turn any gift into a mini-escape room.',
    footCols:[
      { h:'Product', links:['How it works','Use cases','Pricing','Creator Studio'] },
      { h:'Company', links:['About','Blog','Careers','Press kit'] },
      { h:'Legal', links:['Privacy','Terms','Cookies','Security'] },
    ],
    footLang:'Language', footLegal:'© 2026 Puzzify · Made for delightful surprises',
  },
  fa: {
    navHow:'چطور کار می‌کند', navUses:'کاربردها', navPricing:'قیمت‌ها', navCta:'ساخت رایگان',
    themeBirthday:'تولد', themeMystery:'رمزآلود',
    heroKicker:'تو یکی‌اش را بازی کردی. حالا یکی بساز.',
    heroHeadline:'هر هدیه را به یک اتاق فرار کوچک تبدیل کن.',
    heroSub:'پازلیفای یک هدیه، پیام یا خبر دیجیتال را به یک کوئست شخصی آنلاین تبدیل می‌کند. تو معما را می‌سازی — او بازی می‌کند تا جایزه را باز کند. بدون اپ، بدون ورود.',
    heroCta1:'اولین کوئستت را بساز — رایگان', heroCta2:'نمونهٔ زنده ببین',
    playerKicker:'کوئست · یک سال با هم', puzzleType:'قفل رمز', playerTitle:'اولین سرنخ',
    playerPrompt:'اولین قهوه را کجا با هم خوردیم؟ یک کلمه.', inputPlaceholder:'پاسخت را بنویس', submit:'باز کن', watermark:'ساخته‌شده با پازلیفای',
    trustLine:'پنج دقیقه وقت بگذار. چیزی فراموش‌نشدنی هدیه بده.',
    trustStats:['۱۲۰هزار+ بازی انجام‌شده','بدون اپ · بدون ورود','در هر پیام‌رسانی باز می‌شود'],
    howKicker:'چطور کار می‌کند', howTitle:'سه قدم تا یک غافلگیری',
    howSub:'از یک بوم خالی تا لینکی که ارزش باز کردن دارد — در زمانی که یک کادو را کادوپیچ می‌کنی.',
    how:[
      { t:'یک کوئست بساز', d:'در استودیوی سازنده معماها را بچین. پوسته را انتخاب کن، سرنخ‌ها و جایزهٔ پایانی را اضافه کن.' },
      { t:'یک لینک بفرست', d:'یک لینک در واتساپ، تلگرام یا اینستاگرام بفرست — یا روی یک کارت چاپش کن.' },
      { t:'بازی می‌کند و باز می‌کند', d:'بدون دانلود. هر سرنخ را حل می‌کند و باز شدن جعبه را روی جایزه می‌بیند.' },
    ],
    howStepLabel:'قدم',
    ptKicker:'انواع معما', ptTitle:'معماهایی که شخصی به نظر می‌رسند',
    ptSub:'برای هر مرحله ماژول‌ها را ترکیب کن. همه از یک مجموعه توکن پوسته می‌خوانند.',
    pt:[
      { tag:'قفل رمز', title:'چیزی بپرس که فقط او می‌داند', desc:'یک کلمه، یک تاریخ، یک شوخی خصوصی — درست تایپ کن و قدم بعد باز می‌شود.' },
      { tag:'چهارگزینه‌ای', title:'چندگزینه‌ای با رسانه', desc:'سؤالی با سرنخ عکس، صدا یا ویدیو بپرس. پاسخ درست سبز می‌شود.' },
      { tag:'نقطهٔ پنهان', title:'یک سرنخ را در صحنه پنهان کن', desc:'یک نقطهٔ تپنده روی هر عکس بگذار. او لمس می‌کند تا چیزی که پنهان کردی پیدا کند.', premium:'ویژه' },
    ],
    ucKicker:'کاربردها', ucTitle:'یک موتور، برای هر مناسبت',
    ucSub:'همان کامپوننت‌ها را پوسته عوض کن — هیچ مناسبتی کدنویسی‌شده نیست. پوسته را عوض کن و حال‌وهوای کل کوئست تغییر می‌کند.',
    uc:['تولدها','سالگردها','شوخی‌های خصوصی','آنبوردینگ سازمانی','رونمایی محصول','خواستگاری'],
    whyKicker:'چرا پازلیفای', whyTitle:'خودِ تحویل، هدیه است',
    whySub:'غافلگیری‌ای که باز می‌کنند بهتر از لینکی است که نادیده می‌گیرند. ساخته‌شده تا لحظهٔ شادی را به کوئست بعدی تبدیل کند.',
    why:[
      { t:'تحویل فراموش‌نشدنی', d:'مسیر رسیدن به جایزه، خودِ هدیه است. مردم از پردهٔ پایانی اسکرین‌شات می‌گیرند، نه از کارت هدیه.' },
      { t:'بدون اصطکاک برای دریافت', d:'بدون اپ، بدون ورود، بدون ثبت‌نام برای دریافت‌کننده. یک لینک را لمس می‌کند و شروع می‌کند.' },
      { t:'همان‌جا که هستند کار می‌کند', d:'داخل مرورگرهای واتساپ، تلگرام و اینستاگرام روی هر گوشی اجرا می‌شود.' },
      { t:'چندزبانه و راست‌چین', d:'انگلیسی، فارسی و بیشتر — چیدمان به‌صورت بومی آینه می‌شود، بدون متن شکسته.' },
    ],
    prKicker:'قیمت‌ها', prTitle:'رایگان شروع کن. برای هر غافلگیری ارتقا بده.',
    prSub:'اولین کوئستت را رایگان بساز. وقتی فینیش ویژه خواستی یک‌بار پرداخت کن — یا برای یک تیم مقیاس بده.',
    recommended:'محبوب‌ترین',
    pricing:[
      { name:'رایگان', price:'۰', period:'برای همیشه رایگان', tagline:'برای اولین غافلگیری', cta:'ساخت رایگان',
        features:['تا ۳ مرحله','ماژول‌های پایه','پوسته‌های تولد و رمزآلود','واترمارک پازلیفای'] },
      { name:'جعبهٔ ویژه', price:'۴۹هزار', period:'یک‌بار، به‌ازای هر کوئست', tagline:'برای غافلگیری‌ای که باید بنشیند', cta:'یک کوئست ویژه بساز', rec:true,
        features:['مراحل نامحدود','پوسته، ذرات و صدای ویژه','ماژول نقطهٔ پنهان','بدون واترمارک'] },
      { name:'سازمانی', price:'سفارشی', period:'صورتحساب سالانه', tagline:'برای تیم‌ها، رویدادها و رونمایی‌ها', cta:'با ما صحبت کن',
        features:['داشبورد و صندلی تیمی','وایت‌لیبل و دامنهٔ اختصاصی','تحلیل و رهگیری بازی','پشتیبانی ویژه'] },
    ],
    finalKicker:'نوبت توست', finalLine:'می‌خواهی کس دیگری را غافلگیر کنی؟', finalSub:'اولین کوئستت را رایگان بساز — بعد می‌پرسند چطور انجامش دادی.',
    finalCta:'اولین کوئستت را بساز — رایگان',
    footTagline:'هر هدیه را به یک اتاق فرار کوچک تبدیل کن.',
    footCols:[
      { h:'محصول', links:['چطور کار می‌کند','کاربردها','قیمت‌ها','استودیوی سازنده'] },
      { h:'شرکت', links:['درباره ما','وبلاگ','فرصت‌های شغلی','رسانه'] },
      { h:'حقوقی', links:['حریم خصوصی','شرایط','کوکی‌ها','امنیت'] },
    ],
    footLang:'زبان', footLegal:'© ۲۰۲۶ پازلیفای · ساخته‌شده برای غافلگیری‌های دلنشین',
  }
}

export const useAppStore = defineStore('app', () => {
  // State
  const lang = ref('en')
  const theme = ref('birthday')
  const particlesOn = ref(true)

  // Actions
  const setLang = (newLang) => lang.value = newLang
  const toggleLang = () => lang.value = lang.value === 'en' ? 'fa' : 'en'
  const setTheme = (newTheme) => theme.value = newTheme
  const toggleParticles = () => particlesOn.value = !particlesOn.value

  // Getters
  const t = computed(() => content[lang.value])
  const isFa = computed(() => lang.value === 'fa')
  const isMystery = computed(() => theme.value === 'mystery')
  const dir = computed(() => isFa.value ? 'rtl' : 'ltr')
  
  return {
    lang, theme, particlesOn,
    setLang, toggleLang, setTheme, toggleParticles,
    t, isFa, isMystery, dir
  }
})
