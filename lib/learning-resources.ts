import type { IconName } from "@/components/Icon";

export type Subject = "Hindi" | "English" | "Mathematics" | "The World Around Us" | "Arts" | "Physical Education" | "Urdu";
export type SchoolClass = 1 | 2 | 3 | 4 | 5;
export const SUBJECTS: Record<Subject, { icon: IconName; color: string; symbol: string; description: string }> = {
  Hindi: { icon: "translate", color: "saffron", symbol: "अ आ", description: "Poems, stories, and the joy of expressing yourself." },
  English: { icon: "book", color: "blue", symbol: "Aa", description: "Discover new words through stories and conversation." },
  Mathematics: { icon: "chart", color: "green", symbol: "1 2 3", description: "Make sense of numbers, shapes, and everyday puzzles." },
  "The World Around Us": { icon: "globe", color: "leaf", symbol: "☀", description: "Explore nature, your neighbourhood, and our shared world." },
  Arts: { icon: "spark", color: "rose", symbol: "✿", description: "Imagine, draw, make music, dance, and tell stories." },
  "Physical Education": { icon: "students", color: "purple", symbol: "↟", description: "Learn through movement, traditional games, and yoga." },
  Urdu: { icon: "translate", color: "teal", symbol: "ا ب", description: "Explore the beauty of language through reading and writing." },
};
export interface SchoolBook { id: string; grade: SchoolClass; title: string; subject: Subject; language: string; url: string }
const book = (grade: SchoolClass, title: string, subject: Subject, language: string, query: string): SchoolBook => ({
  id: query.split("=")[0], grade, title, subject, language, url: `https://ncert.nic.in/textbook.php?${query}`,
});

// Official NCERT destinations. See docs/learning-resources.md for catalog sources.
// Keep edition-specific IDs explicit; do not infer chapter counts or fabricate books.
export const SCHOOL_BOOKS: SchoolBook[] = [
  book(1, "Sarangi", "Hindi", "Hindi", "ahsr1=0-19"),
  book(1, "Mridang", "English", "English", "aemr1=0-9"),
  book(1, "Joyful Mathematics", "Mathematics", "English", "aejm1=0-13"),
  book(1, "Anandmay Ganit", "Mathematics", "Hindi", "ahjm1=0-13"),
  book(1, "Shehnai", "Urdu", "Urdu", "aush1=0-18"),
  book(2, "Sarangi", "Hindi", "Hindi", "bhsr1=0-26"),
  book(2, "Mridang", "English", "English", "bemr1=0-13"),
  book(2, "Joyful Mathematics", "Mathematics", "English", "bejm1=0-11"),
  book(2, "Anandmay Ganit", "Mathematics", "Hindi", "bhjm1=0-11"),
  book(2, "Shehnai", "Urdu", "Urdu", "bush1=0-19"),
  book(3, "Veena", "Hindi", "Hindi", "chve1=0-18"),
  book(3, "Santoor", "English", "English", "cesa1=0-12"),
  book(3, "Maths Mela", "Mathematics", "English", "cemm1=0-14"),
  book(3, "Our Wondrous World", "The World Around Us", "English", "ceev1=0-12"),
  book(3, "Bansuri", "Arts", "English", "cebu1=0-20"),
  book(3, "Khel Yoga", "Physical Education", "English", "ceky1=0-7"),
  book(3, "Sitar", "Urdu", "Urdu", "cust1=0-19"),
  book(4, "Veena", "Hindi", "Hindi", "dhve1=0-13"),
  book(4, "Santoor", "English", "English", "desa1=0-12"),
  book(4, "Maths Mela", "Mathematics", "English", "demm1=0-14"),
  book(4, "Our Wondrous World", "The World Around Us", "English", "deev1=0-10"),
  book(4, "Bansuri", "Arts", "English", "debu1=0-18"),
  book(4, "Khel Yoga", "Physical Education", "English", "deky1=0-4"),
  book(4, "Sitar", "Urdu", "Urdu", "dust1=0-14"),
  book(5, "Veena", "Hindi", "Hindi", "ehve1=0-12"),
  book(5, "Santoor", "English", "English", "eesa1=0-10"),
  book(5, "Maths Mela", "Mathematics", "English", "eemm1=0-15"),
  book(5, "Our Wondrous World", "The World Around Us", "English", "eeev1=0-10"),
  book(5, "Bansuri", "Arts", "English", "eebu1=0-19"),
  book(5, "Khel Yoga", "Physical Education", "English", "eeky1=0-3"),
  book(5, "Sitar", "Urdu", "Urdu", "eust1=0-14"),
];

export type WordTopic = "Nature" | "Numbers & shapes" | "School" | "Everyday life";
export interface DictionaryWord { english: string; hindi: string; pronunciation: string; topic: WordTopic; meaning: string; example: string }
export const DICTIONARY: DictionaryWord[] = [
  { english: "Tree", hindi: "पेड़", pronunciation: "ped", topic: "Nature", meaning: "A tall plant with a woody trunk and branches.", example: "We sit in the shade of the mango tree." },
  { english: "Leaf", hindi: "पत्ता", pronunciation: "patta", topic: "Nature", meaning: "A usually flat, green part of a plant that helps it make food.", example: "A green leaf grows on the branch." },
  { english: "Root", hindi: "जड़", pronunciation: "jad", topic: "Nature", meaning: "The part of a plant that takes in water and holds it in place.", example: "The roots grow into the soil." },
  { english: "Flower", hindi: "फूल", pronunciation: "phool", topic: "Nature", meaning: "The part of a plant that can grow into fruit and seeds.", example: "A butterfly lands on the flower." },
  { english: "Seed", hindi: "बीज", pronunciation: "beej", topic: "Nature", meaning: "A small part of a plant from which a new plant can grow.", example: "We plant a seed and water it." },
  { english: "River", hindi: "नदी", pronunciation: "nadi", topic: "Nature", meaning: "A natural stream of water flowing across the land.", example: "The river flows past our village." },
  { english: "Rain", hindi: "बारिश", pronunciation: "baarish", topic: "Nature", meaning: "Drops of water that fall from clouds.", example: "Rain fills the pond with water." },
  { english: "Soil", hindi: "मिट्टी", pronunciation: "mitti", topic: "Nature", meaning: "The loose material on the ground in which plants grow.", example: "The farmer puts seeds in the soil." },
  { english: "Bird", hindi: "पक्षी", pronunciation: "pakshi", topic: "Nature", meaning: "An animal with feathers, two wings, and a beak.", example: "A small bird builds a nest." },
  { english: "Sun", hindi: "सूरज", pronunciation: "sooraj", topic: "Nature", meaning: "The star that gives Earth light and warmth.", example: "The sun rises in the morning." },
  { english: "Circle", hindi: "वृत्त", pronunciation: "vritt", topic: "Numbers & shapes", meaning: "A round, flat shape with no corners.", example: "Draw a circle around the right answer." },
  { english: "Square", hindi: "वर्ग", pronunciation: "varg", topic: "Numbers & shapes", meaning: "A flat shape with four equal sides and four right angles.", example: "This floor tile is a square." },
  { english: "Triangle", hindi: "त्रिभुज", pronunciation: "tribhuj", topic: "Numbers & shapes", meaning: "A flat shape with three straight sides and three corners.", example: "The flag has a triangle on it." },
  { english: "Number", hindi: "संख्या", pronunciation: "sankhya", topic: "Numbers & shapes", meaning: "A value used to count, measure, or tell a position.", example: "Five is the number of fingers on one hand." },
  { english: "Half", hindi: "आधा", pronunciation: "aadha", topic: "Numbers & shapes", meaning: "One of two equal parts of something.", example: "Share half of the roti with your friend." },
  { english: "Equal", hindi: "बराबर", pronunciation: "baraabar", topic: "Numbers & shapes", meaning: "The same in amount, size, or value.", example: "Both baskets have an equal number of mangoes." },
  { english: "Count", hindi: "गिनना", pronunciation: "ginna", topic: "Numbers & shapes", meaning: "To find how many things there are.", example: "Count the marbles in the bowl." },
  { english: "Add", hindi: "जोड़ना", pronunciation: "jodna", topic: "Numbers & shapes", meaning: "To put amounts together to find the total.", example: "Add two pencils to the three on the desk." },
  { english: "Book", hindi: "किताब", pronunciation: "kitaab", topic: "School", meaning: "Pages joined together with words or pictures to read.", example: "I read a story from my book." },
  { english: "Teacher", hindi: "शिक्षक", pronunciation: "shikshak", topic: "School", meaning: "A person who helps others learn.", example: "Our teacher explains the new word." },
  { english: "School", hindi: "विद्यालय", pronunciation: "vidyalaya", topic: "School", meaning: "A place where children learn with teachers and friends.", example: "We walk to school together." },
  { english: "Pencil", hindi: "पेंसिल", pronunciation: "pencil", topic: "School", meaning: "A tool used for writing or drawing that can usually be erased.", example: "Draw a leaf with your pencil." },
  { english: "Question", hindi: "प्रश्न", pronunciation: "prashn", topic: "School", meaning: "Words you use to ask about something.", example: "Ask a question when you want to know more." },
  { english: "Answer", hindi: "उत्तर", pronunciation: "uttar", topic: "School", meaning: "Something you say or write in reply to a question.", example: "Write your answer below the picture." },
  { english: "Story", hindi: "कहानी", pronunciation: "kahaani", topic: "School", meaning: "A telling of events that are real or imagined.", example: "Grandmother tells us a story about a clever rabbit." },
  { english: "Learn", hindi: "सीखना", pronunciation: "seekhna", topic: "School", meaning: "To gain knowledge or become able to do something.", example: "We learn a new word every day." },
  { english: "Friend", hindi: "मित्र", pronunciation: "mitra", topic: "Everyday life", meaning: "Someone you like, care about, and enjoy spending time with.", example: "I play with my friend after school." },
  { english: "Family", hindi: "परिवार", pronunciation: "parivaar", topic: "Everyday life", meaning: "People connected to you who share care and belonging.", example: "My family cooks a meal together." },
  { english: "Water", hindi: "पानी", pronunciation: "paani", topic: "Everyday life", meaning: "The liquid that living things need to survive.", example: "Fill your bottle with clean drinking water." },
  { english: "Food", hindi: "भोजन", pronunciation: "bhojan", topic: "Everyday life", meaning: "What people and animals eat to grow and get energy.", example: "Rice and dal are part of our food." },
  { english: "Village", hindi: "गाँव", pronunciation: "gaon", topic: "Everyday life", meaning: "A small place where people live, usually in the countryside.", example: "There is a school in our village." },
  { english: "Market", hindi: "बाज़ार", pronunciation: "baazaar", topic: "Everyday life", meaning: "A place where people buy and sell things.", example: "We buy vegetables at the market." },
  { english: "Share", hindi: "बाँटना", pronunciation: "baantna", topic: "Everyday life", meaning: "To give part of something to others or use it together.", example: "We share our crayons with each other." },
  { english: "Play", hindi: "खेलना", pronunciation: "khelna", topic: "Everyday life", meaning: "To take part in an activity for fun.", example: "We play kho-kho in the school playground." },
  { english: "Clean", hindi: "साफ़", pronunciation: "saaf", topic: "Everyday life", meaning: "Free from dirt or mess.", example: "Keep your hands clean before eating." },
  { english: "Morning", hindi: "सुबह", pronunciation: "subah", topic: "Everyday life", meaning: "The early part of the day before noon.", example: "I water the plants in the morning." },
];
