export interface WishCardContent {
  id: number;
  icon: 'heart' | 'star' | 'flower' | 'sparkle';
  frontText: string;
  backText: string;
}

export interface GalleryPhotoContent {
  id: number;
  imageUrl: string;
  caption: string;
  rotation: number; // angle in degrees for polaroid scatter
}

export interface TimelineMilestoneContent {
  id: number;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export const GREETINGS = {
  title: "Happy Birthday, Goluu! 🎂",
  subtitle: "A special melody and message for you...",
  message: `
Thank you bebdu meri life me aane ke liye ,meri tete sunne ke liye, mujhe hansane ke liye aur meri life ko itna better banane ke liye.
ek ye chota sa gift tere liye shayd tumhe psnd aaye !
hamesha aise hi rhena khikhi krti khati piti dhol mera motu 
I love you sooo muchhh moreeee. Always. ❤️`,
};

export interface Song {
  id: number;
  title: string;
  artist: string;
  file: string;
}

export const songs: Song[] = [
  { id: 1, title: "Ehsaas (Acoustic)", artist: "Faheem Abdullah", file: "/audio/ehsaas.mp3" },
  { id: 2, title: "Jahaan (Acoustic)", artist: "Jai Dhir", file: "/audio/jahaan-acoustic.mp3" },
  { id: 3, title: "Krish Kapoor", artist: "Saiyaara", file: "/audio/krish-kapoor-saiyaara.mp3" },
  { id: 4, title: "Barbaad (Female Reprise)", artist: "Shilpa Rao (Saiyaara)", file: "/audio/barbaad-saiyaara.mp3" },
  { id: 5, title: "Gone, Gone, Gone", artist: "Phillip Phillips", file: "/audio/gone-gone-gone.mp3" },
  { id: 6, title: "Her", artist: "JVKE", file: "/audio/her.mp3" },
  { id: 7, title: "Ye Fitoor Mera", artist: "Arijit Singh", file: "/audio/ye-fitoor-mera.mp3" },
  { id: 8, title: "Main Dour Hoon Magar", artist: "Piyush Bhisekar", file: "/audio/main-dour-hoon-magar.mp3" },
];

export const GALLERY_PHOTOS: GalleryPhotoContent[] = [
  {
    id: 1,
    imageUrl: "/images/gallery/couple_selfie.jpg",
    caption: "",
    rotation: -4,
  },
  {
    id: 2,
    imageUrl: "/images/gallery/priya_green_night.jpg",
    caption: "",
    rotation: 3,
  },
  {
    id: 3,
    imageUrl: "/images/gallery/girls_maroon_night.jpg",
    caption: "",
    rotation: -2,
  },
  {
    id: 4,
    imageUrl: "/images/gallery/girls_rooftop.jpg",
    caption: "",
    rotation: 5,
  },
  {
    id: 5,
    imageUrl: "/images/gallery/priya_saree_college.jpg",
    caption: "",
    rotation: -3,
  },
];

export const WISH_CARDS: WishCardContent[] = [
  {
    id: 1,
    icon: 'heart',
    frontText: "Tap to reveal a wish",
    backText: "I wish hum dono ekdusre ko hamesha itna hi pyaar krte rahe aur tum hamesha khush raho mere sath! ❤️",
  },
  {
    id: 2,
    icon: 'star',
    frontText: "Tap to reveal a wish",
    backText: "I wish terko jo bhi chayie life me jaldi se mile aur apan jaldi se bas ab eksath aajaye 😚🌟",
  },
  {
    id: 3,
    icon: 'flower',
    frontText: "Tap to reveal a wish",
    backText: "I wish apan jaldi se firse mile or iss bar 1 ghante ke liye ni bht der ke liye sathme apan milke bht masti karein bht sara karun me tumhe 🌸😚",
  },
  {
    id: 4,
    icon: 'sparkle',
    frontText: "Tap to reveal a wish",
    backText: "I wish jaldi se bas ab time jaye aur shadi krle 😚💗",
  },
];

export const REASONS_I_LOVE_YOU: string[] = [
  "kyuki tumhe me kitna bhi udas kyun na hou mujhe hasana aata hai",
  "vaise to tumhari hansi sunke hi mera din ban jaata hai",
  "tumhare vo gaal ek to sbse phle bht cute hai yaar sachme golmatol",
  "kyuki tum itna dur se hi mera bht dhyan rkhti ho ",
  "kyuki tumhe hug krke mujhe bht sukoon milta hai ek hi baar kiya hai but still",
  "kyuki tumhare sath lagta hai mera normal room pe pada hua din bhi special hai",
  "kyuki tum mujhpe andha trust krti ho aur me bhi tumpe aur me vo kabhi thodna ni chahta hu",
  "tumahra vo mere gande jokes ya bully krta hu tb vo massom sa muh banana pyaar hi aaajata hai mujhe",
  "tumhari vo pyaari si awaaz pyari si hansi sunke uthna se meri morning good hojati h morning chrdo pura din good hojata hai tumhari awaz sunke sona tumhe vc pr dekhke sona kaise na pyaar karun ",
  "aur ek to tum vc par mujhe kitne pyaar se dekhti ho na kaise na phasu me aur pyaar me tumhare ",
  "Maine khudko kabhi eisa nahi dekha jaise me tumhare sath hu thankyou mujhe itna khush itna open rakhne ke liye :)",
  "ye to kuch eshie gini ghuni wajah thi bs warna wajahein kam pad jayeygi tumhe pyaar krne ke liye i love you so much golu "
];

export const TIMELINE_MILESTONES: TimelineMilestoneContent[] = [
  {
    id: 1,
    date: "August 13, 2022",
    title: "Discord ☕",
    description: "Movie dekhne ke bahane discord par kabhi socha ni tha lifetime movie partner mil jayega :)",
  },
  {
    id: 2,
    date: "December 12, 2025",
    title: "Relationship?❤️ ",
    description: "Bht hi khtrnk phase tha yaar bht ro ro ke nikala tha tum han karogi ya na bht mushkil tha pr jo bhi tha chalo finally par aapne sab theek krdiya ",
  },
  {
    id: 3,
    date: "April 15, 2026",
    title: "Delhi Airport ✈️",
    description: "haan hone ke baad laga ni tha itna jaldi mil lenge par mil liye the and bht acha tha 1 ghanta bhi bht acha tha jitna mile utna kam h still fir bhi jo tha jitna tha khush tha me",
  },
  {
    id: 4,
    date: "Today 💫",
    title: "Happy Birthday 🎂",
    description: "golu ka birthday , me bht aana chahta tha pr aa to ni paya tumhare paas , to bas ek baari bas isse hi kaam chala lo , jisse tumhe shyd meri kami thodi kam mehsus ho  ,sorry ni aa paane ke liye baaki to i love you soo much enjoy karo !",
  }
];

export const LETTER_CONTENT = {
  heading: "Dearest Priya (Golu) ❤️,",
  paragraphs: [
    "Chalo final message hai abhi ke liye tujhe likh raha hu. Sabse pehle, I love you soo much! Kaise randomly hum Discord waale din mile the, sachme laga nahi tha aisa kuch hoga aur itni achi thi tu. Sachme yaar, me tbh tujhe dekhe bina hi tere liye pagal sa ho gaya tha day 1 par bhi! Aisa tha apna, jaise pata nahi kitne time se jante hai ek dusre ko. Jo connection hota hai na, mera to wo day 1 par hi ban gaya tha. Uske baad to fir mera badhta hi raha sab kuch roz be roz. Jo mujhe aaj tak koi saalon mahino me jaise feel nahi karwa gaya, tune to kuch dino me hi karwa diya. Ab chahe wo tu mere sath normal hi hogi starting me, obv but apna to ho gaya tha. Apan ko to itna hi chahiye tha shuru se. Starting se me kuch selective nahi tha ki nahi mujhe to aise ladki chahiye ye wo kuch type nahi tha. Tumse milne ke baad samjha mujhe ki tum ho mera type! Yahi chahiye mujhe, aise ladki ekdum mast mazak wali, mujhe chedne wali. Mujhe day 1 bhi yaad hai apan ne day 1 hi itni baatein kari thi na, tumhe maine nahane me late karwa di thi mujhe yaad hai ache se. Aur shayad day 1 ya 2 par hi chipkali naam ho gaya tha tera kyuki tu darti thi aur mujhe bohot maza aata tha terko kilasne me. Badi cute tha wo sab bhi. Bas fir time mast jaata raha, ache dost bane, bohot saara ghost bhi hua me wo bhi theek hai ab jo tha so tha. Important part hi tha ghost hone ke baad message milta tha tab usse bhi mujhe pyaar hi aata tha... aur haan gussa bhi, wo to chal tu janti hai hi ache se! Wo raat raat bhar baatein karna call par, apna wo video calls par betuki baatein karna, chahe kuch matlab ho ya na ho bas ek dusre ko pareshan karna — maza hi aa jaata tha mujhe to! Kabhi kabhi jab mujhe jaana padta tha call se kyuki me ghar me rehta tha, me raatko baatein nahi kar sakta tha tab, par Ayush kar sakta tha tujhse — mujhe tab thodi jalan hoti thi ki kaash me bhi tumse aur baat kar pata aur sun pata. Thoda sa khoon jalta tha mera par theek hai chordo ab wo ❤️",
    "To ye sab bohot acha chalta raha jaisa chalna chahiye tha. Tum bohot flirt karti thi mujhse ekdum wholesome memes, reels aur bhi, par me hi thoda sa bhondu hu samjha nahi tha hints aur na tum sure thi to theek hai. Ab maanta hu me bhondu hu warna kabka hi sath me hote! Par koi na wo bhi time tha, wo bhi acha tha <3. Chalo theek hai yahi bata deta hu, VC par bhi bata dunga chinta mat karo — 2 cheezein jo me tumhe bata raha tha, aisa kuch jyada special nahi hai but jo tha wahi bata raha hu.",
    "Around mere 11-12th class ki baat hai, shayad se apni baatein bohot kam ho gayi thi like tum ghost karti thi ya ignore karti thi, wo to ab tum hi jaano jo bhi tha. Aur jab me tumse pucha karta tha, tumhara fix hota tha — ya to book padh rahi thi, dhyan nahi diya, ya fir series dekh rahi thi Friends falana dhimkana jo bhi thi. To mujhe hoti thi chull tumse baat karne ki, 'karo mujhse bhi baat ye wo'. To maine tumhare kuch posts wgaera par likes wagera dekhe the jispe ek book hoti thi like 'It Ends With Us'. Aur bas tumse baat karne ka bahana mil gaya aur chupke se kar di ye order! 'Chalo ab to calls par book ke baare me discuss karunga yayaya baatein hogi', par unfortunately me wo book padhne 5-7 baar try kiya, me 10-15 pages ke aage ja hi nahi paya pata nahi kyun. Books wala insan nahi hu dekho me itna tumhare jitna. To fir na maine kabhi zikr kiya na bataya hoga tumhe, but theek hai thodi thodi aadat dalunga abse book bhi padhne ki. Ek to tum series aur bhi itni badi badi dekhti ho na yaar jo ki me sirf tumhari baahon me soke hi complete kar sakta hu warna pata nahi kab tak hogi mujhse.",
    "Second cheez hai apni ek photo jo ki shayad maine banwayi thi around 20 May 2025 ya 18 May — exactly date yaad nahi, bas itna pata hai inke beech me se hi thi kabhi. Apan kabhi mile to the hi nahi aur terko yaad hoga uss time ek trend chala tha jab log AI se apni photos bana rahe the Ghibli wagera se ya koi aur design me, aisa kuch yaad hi hoga. To maine apan dono ki single single photo ko merge karke ek apni bhi banayi thi. Tumne wo yellow top pehna hua tha jo shayad tumhe Supriya ne diya tha bday par jispe alien bana hua tha. To maine ek photo banwake apne paas rakhi thi. Aur mudda maine tujhe kyun nahi bataya tha... kyuki obv si baat hai tujhe kuch nahi hi tha mere liye to tu kya hi sochegi fir kya hi ajeeb harkatein karta hu me and all. Rakhta me photo mere paas kyuki uss beech me kabhi tu bohot baat karti thi, kabhi bohot ignore/ghost wahi tera, aur terse wo khushi se baat karke me bhi khush ho jaata tha aur me aur phas jaata tha. Badi chalak nikli yaar tu to! To ye photo maine mere paas rakhi thi kyuki mujhe uss time sahi laga, aur wahi cheez hai na jo jitna hurt karti hai utna hi pyaar badhta hai. But ab mat karna sachme bohot marunga me! Maine tbh kaise to accept kar liya tha ki tu meri nahi ho sakti, mera one sided hai rahega chalta jo bhi hai. Jab tak ab baat wo nahi hoti ki me underconfident ya aur kuch, bas mujhe pata tha nahi mil sakti tum, bohot fark hai bohot si cheezein hai... tum kaha me kaha. To agar me tumhe sath nahi rakh sakta to tumhari photo to rakh hi sakta hu na! To bas isliye maine rakhi thi. If you weren't into me, wo galat tha, but chinta mat kar ab to tu pat hi gayi! Waise bhi me kisi aur ke sath try karta hi nahi tha, mera kisi aur ke sath try karne ka man hi nahi karta tha... dimaag se pata leta par dil to tumpe atka hua tha na! Bas yahi wajah thi book ki aur photo ki — kahi to sath me ho mere. Bas itna hi tha. Baaki MANIFESTATION to hai yaar, tum jo mil gayi... I LOVE YOU SO MUCH PRIYA! ❤️",
    "Thank you so much mujhe itna pyaar dene ke liye, itna samajhne ke liye, itna jhelne ke liye. Laga nahi tha kabhi koi itna karega mere liye, sachme bohot grateful hu me ISTG. Fir aagaya December 2025 😭😭😭 Kisi aur ki wajah se jo me saalon se hold karke baitha tha wo nikal gaya. Sabse pehle to uska bhala! Aur me bohot kilasta tha pehle to ki usse itni achi samajhdaar ladki mili hai, itna pyaar karne wali, aur kya chahiye bhadwe ko fir bhi ghost karna hai! But ab wo kehte hai na jo hota hai ache ke liye hi hota hai, aur hua bhi. Meri jyada kilas gayi, jal gayi ki aise kaise koi kar raha hai tumhare sath, aur fisal gayi zubaan aur to kya ho gaya kaand! Aur iss kaand ke baad itna sab kuch ho raha tha tumhare sath, fir bhi tumne sab ache se handle kiya... proud of u meri motu! Fir tumhare sure na sure wala jo bhi tha, bohot ganda phase tha wo sachme. Bahar bahar se dono kitna hi bol le 'koi baat nahi, koi baat nahi', par tha wo bohot dard wala phase sachi! But end me jo chahiye tha mujhe wo mil gaya. Mujhe sachme bohot time tak kahin na kahin lagta tha ki tune bas daya karke haan bhar di hai ki 'ye kitna pyaar karta hai aur loyal bhi rahega'. And tbh mujhe hamesha ek chota sa doubt tha... ki kya ye sachme mujhe pasand karegi bhi kal ko? Par ek baar mujhe yaad hoga Riddhi ne tere videos bheje the, tab maine dekha teri khushi bas mere VN aur text dekhke — tab ho gaya mera ki ab kahin nahi jaa rahi hai ye, ab ho gayi meri, phas gayi ab ye bhi chalo mere pyaar me yayaya! Bohot acha din tha wo, aur tum bohot cute hasnti ho jab mujhse baat karti ho. Fir to kya hai, sab ka sab kuch clear ho gaya, dono khush, dono aa gaye finally relationship me!",
    "Fir aata hai mera fav day, best day, kuch bhi kaho — 15 April 2026 💗 Socha nahi tha itna jaldi tujhse mil lunga! Aur jitna comfortable me kahin nahi hota utna mujhe karwane ke liye thank you... teri baat hi alag thi. Aur sachme mujhe laga tha tu bhi aayegi sharmaegi wagera, dono thode to awkward honge hi, par sachme jo me itna travel karke metro me idhar udhar pura Delhi ghum ke yaha waha ruk ke aaya, sab worth it tha EVERY SECOND! Jaise hi tu mujhe dekhke bhaag ke hug karne aayi thi, me waha literally blank ho gaya tha pagal sa hi ki 'ye mere sath ho raha hai, itni khush ho rahi ho tum!' Sachme mujhe bohot acha laga tha. Hug, baatein, tera mujhe pakadke baithna, mera hath pakad ke chalna, same straw se coffee pilana, jaate time hug karna — ye sab hi to chahiye mujhe zindagi me! Kaafi hai yaar, itna pyaar karogi to me khushi khushi puri zindagi nikal du! Aur wo randomly jo tumne kiss ki thi wo kaise bhool sakta hu me? Laal ho gaya tha me! Pehli baar me kiss kaun karta hai, lo ji dikh gaya kaun karta hai! Laal pad gaya tha me, sunn ho gaya tha mera pura sharir. Starting ka wo tera pagalon jaisa bhaag ke mujhe hug karne se lekar end me ek last hug karna ache se, fir wo jaate jaate flying kiss karke jaana — everything from start to end, sab bohot acha tha. Finally mil liye the 💗😭 Tumhare gifts bhi cute the bohot ache, thank you firse unke liye <3",
    "Milna julna ho gaya sab, ab to abhi ka time aa gaya hai almost. IK me kabhi kabhi bohot gussa karta hu tumpe, sidhe muh baat bhi nahi karta, but me koshish karunga itna na kara karun. Me kya karun ab, mujhe bhi moodswings ho jaate hai, thoda kabhi tum bhi kilasti rehti ho, but me tumhare liye sudhar raha hu. Mujhe kuch fark nahi padta, me tumhare liye hamesha sudharne ko taiyar hu. Tum bas batao 'ye cheez Anmol sahi nahi hai tumhare liye', pakka me tumhare liye hamesha sudharne ko taiyar hu aur sudhrunga bhi. Aur tumhe bhi pata hai bohot cheezon me sudhra hu! Hahaha aare gandi baatein kaise bhool gaya ruko ruko! Bohot maza aata hai tumhare sath mujhe gandi baatein karne me 😜 (koi dekh liya to hawwww! Tumhe to pata hai hi bas fir).",
    "Chalo theek hai fir end karte hai ab ye letter. I wish, I pray, I hope apna relationship ab sidha shadi par hi end ho! Me genuinely tumhare sath future dekhta hu, kuch timepass nahi, kuch bakwas nahi, saaf sidha meri biwi jaisa. Tumhe bohot pyaar karna hai, fir ek din tum biwi banongi, fir haq se mere sath rahogi — sochke hi acha lagta hai bohot! Chalo yaar ab bas khatam karta hu bohot ho gaya, tum pagal ho jaogi padh padh ke. Theek hai baby, once again Happy Birthday! I love you soo much, soo much! Itna padhke mujhe abhi hi pata hai teri aankhein bhar gayi hongi ya tera chehra thoda utar gaya hoga chahe khushi se hi ho, par baby aaj apka birthday hai na, aisa nahi karte, khush ho jao 💗. Mujhe tumhara reaction aaj bhi yaad hai jab tumne mera likha letter padha tha... wo aankhon me aansu, itna pure reaction, itna pure tumhara pyaar mere liye... cute! Bas hamesha apan dono aise hi rahe sath me, pyaar karte. Thode up downs to khair aate rehte hai. Me firse bak bak karne lag gaya yaar... chalo theek hai, agar maine tumhe raatko diya hai to Good Night baby, warna Good Morning baby! I LOVEEEEE YOUUUUUUU SOOOO MUCH. Thank you meri life me aane ke liye aur mujhe itna saara pyaar karne ke liye aur mujhe better banane ke liye. Forever grateful! Chalo bas end karta hu ab, aur bhi kaam hai mujhe... website nahi banegi warna! Pagal kaheki bohot bolwati hai. Bye bye golu, apna hamesha dhyan rakhna aur hamesha khush rehna kyuki tum khush rahongi to me khush rahunga 💗",
    "ye dekho kitna pyaar jiss ladke ko ye ni bolna aata tha ki vo sachme kasia hai mood krab hai aur aaj itna sab ek flow me likhdoya sirf tumhari wajah se meri bebdu bye bye bht sara pyaar aur bht saari kissiyan tumhe 🩷"
  ],
  closing: "With all my love,",
  sender: "Anmol ❤️",
};

export interface ShowcasePhotoContent {
  id: number;
  imageUrl: string;
  title: string;
  subtitle?: string;
  tag?: string;
}

export const SHOWCASE_PHOTOS: ShowcasePhotoContent[] = [
  { id: 1, imageUrl: "/images/showcase/showcase_14.jpeg", title: "" },
  { id: 2, imageUrl: "/images/showcase/showcase_1.jpg", title: "" },
  { id: 3, imageUrl: "/images/showcase/showcase_2.jpg", title: "" },
  { id: 4, imageUrl: "/images/showcase/showcase_3.jpg", title: "" },
  { id: 5, imageUrl: "/images/showcase/showcase_4.jpg", title: "" },
  { id: 6, imageUrl: "/images/showcase/showcase_5.jpg", title: "" },
  { id: 7, imageUrl: "/images/showcase/showcase_6.jpg", title: "" },
  { id: 8, imageUrl: "/images/showcase/showcase_7.jpg", title: "" },
  { id: 9, imageUrl: "/images/showcase/showcase_8.jpg", title: "" },
  { id: 10, imageUrl: "/images/showcase/showcase_9.jpeg", title: "" },
  { id: 11, imageUrl: "/images/showcase/showcase_10.jpeg", title: "" },
  { id: 12, imageUrl: "/images/showcase/showcase_11.jpeg", title: "" },
  { id: 13, imageUrl: "/images/showcase/showcase_12.jpeg", title: "" },
  { id: 14, imageUrl: "/images/showcase/showcase_13.jpeg", title: "" },
  { id: 15, imageUrl: "/images/showcase/showcase_15.jpeg", title: "" },
  { id: 16, imageUrl: "/images/showcase/showcase_16.jpeg", title: "" },
  { id: 17, imageUrl: "/images/showcase/showcase_17.jpeg", title: "" },
  { id: 18, imageUrl: "/images/showcase/showcase_18.jpeg", title: "" },
  { id: 19, imageUrl: "/images/showcase/showcase_19.jpeg", title: "" },
  { id: 20, imageUrl: "/images/showcase/showcase_20.jpeg", title: "" },
  { id: 21, imageUrl: "/images/showcase/showcase_21.jpg", title: "" },
  { id: 22, imageUrl: "/images/showcase/showcase_22.jpg", title: "" },
  { id: 23, imageUrl: "/images/showcase/showcase_23_v2.jpg", title: "" },
  { id: 24, imageUrl: "/images/showcase/showcase_24_v2.jpg", title: "" },
];

export const STORY_CONTINUES = {
  heading: "Itna hi tha chalo ❤️",
  subheading: "I hope tumhe ye pasand aya hoga , chehre par ek achi si smile aayi hogi , chalo theek hai ab bye bye , i love you so much more ❤️",
};
