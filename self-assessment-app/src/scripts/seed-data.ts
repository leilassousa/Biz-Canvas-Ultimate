import { supabase } from '../lib/supabase';

const categories = [
  { name: 'Problem', order: 1 },
  { name: 'Audience', order: 2 },
  { name: 'Competitors', order: 3 },
  { name: 'Channels', order: 4 },
  { name: 'Elevator Pitch', order: 5 },
  { name: 'Differentiator', order: 6 },
  { name: 'Solution', order: 7 },
  { name: 'Costs', order: 8 },
  { name: 'Revenue', order: 9 },
  { name: 'Business Boosters', order: 10 },
  { name: 'Personal Fit', order: 11 }
];

const preambles = [
  { content: 'Every business solves problems, and understanding the challenges your customers face is key to serving them better.' },
  { content: 'Getting to know your ideal customers can help you connect with them more effectively.' },
  { content: 'Understanding your competition helps you see where you can stand out.' },
  { content: 'Knowing where your customers spend their time helps you reach them in the right places.' },
  { content: 'An elevator pitch is a quick way to introduce your business. Let\'s create a sentence that sums up what you do and why it matters.' },
  { content: 'Being unique is essential in a crowded market. Let\'s define what sets you apart.' },
  { content: 'Now, let\'s explore how your business solves customer problems.' },
  { content: 'Running a business comes with costs. It\'s helpful to think about them now so you can plan accordingly.' },
  { content: 'Let\'s think about how you\'ll make money from your business.' },
  { content: 'Every business has strengths. Let\'s identify yours.' },
  { content: 'Building a business is a big commitment, so it\'s essential to make sure it feels like the right fit for you.' }
];

const questions = [
  // Problem
  { content: 'What are the biggest frustrations or obstacles your customers deal with regularly? Think about what might keep them up at night or make their day harder.', order: 1 },
  { content: 'Are there problems they\'re currently paying someone else to help them solve? If so, what are they?', order: 2 },
  
  // Audience
  { content: 'Who do you imagine your typical customer is? Consider their age, location, and profession, if that applies.', order: 1 },
  { content: 'What do they care deeply about or value most?', order: 2 },
  { content: 'What are their future goals or aspirations? What are they working towards?', order: 3 },
  
  // Competitors
  { content: 'Who else is serving your audience? Can you name a few companies or brands your customers might also turn to?', order: 1 },
  { content: 'What do these competitors do well that you admire? And where do they fall short?', order: 2 },
  
  // Channels
  { content: 'Where does your ideal customer typically spend their time? Are they mostly online or offline?', order: 1 },
  { content: 'What social media platforms or websites do they use regularly?', order: 2 },
  { content: 'How do you keep in touch with your audience? For example, through newsletters or other forms of communication?', order: 3 },
  
  // Elevator Pitch
  { content: 'If you had to explain your business in one sentence, how would you describe who you help, what problem you solve, and how you do it differently than others?', order: 1 },
  
  // Differentiator
  { content: 'What is unique or different about your approach, product, or service?', order: 1 },
  { content: 'How does your business stand out from your competitors?', order: 2 },
  
  // Solution
  { content: 'Imagine your solution working perfectly for your customer. What does that look like?', order: 1 },
  { content: 'How does your solution address the main issues your customers face?', order: 2 },
  { content: 'What benefits do customers gain from using your product or service?', order: 3 },
  
  // Costs
  { content: 'What are some of the main costs you expect for building and delivering your solution? Will these be monthly, yearly, or one-time expenses?', order: 1 },
  { content: 'Do you plan to hire contractors or employees to help you?', order: 2 },
  
  // Revenue
  { content: 'What will you be selling to your customers to solve their problems?', order: 1 },
  { content: 'How much do you plan to charge for it?', order: 2 },
  
  // Business Boosters
  { content: 'What advantages does your business have over others? These could be relationships, resources, or skills that are hard to copy.', order: 1 },
  
  // Personal Fit
  { content: 'Does this business align with the kind of lifestyle you want? Does it excite and energize you, or do you feel it might wear you down over time?', order: 1 }
];

async function seedData() {
  try {
    console.log('Starting data seeding...');

    // Insert categories
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .insert(categories)
      .select();

    if (categoryError) throw categoryError;
    console.log('Categories inserted:', categoryData);

    // Insert preambles with category relationships
    const preambleData = preambles.map((preamble, index) => ({
      ...preamble,
      category_id: categoryData[index].id
    }));

    const { data: preambleResult, error: preambleError } = await supabase
      .from('preambles')
      .insert(preambleData)
      .select();

    if (preambleError) throw preambleError;
    console.log('Preambles inserted:', preambleResult);

    // Insert questions with category relationships
    let currentCategoryIndex = 0;
    let questionOrder = 1;
    const questionData = questions.map(question => {
      const result = {
        ...question,
        category_id: categoryData[currentCategoryIndex].id
      };
      
      if (questionOrder >= questions.filter(q => q.order === questionOrder).length) {
        currentCategoryIndex++;
        questionOrder = 1;
      } else {
        questionOrder++;
      }
      
      return result;
    });

    const { data: questionResult, error: questionError } = await supabase
      .from('questions')
      .insert(questionData)
      .select();

    if (questionError) throw questionError;
    console.log('Questions inserted:', questionResult);

    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Execute the seeding
seedData(); 