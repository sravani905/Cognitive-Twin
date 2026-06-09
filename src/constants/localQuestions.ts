export const LOCAL_QUESTION_SETS = {
  logic: [
    { set: 'logic', q: "If all A are B, and some B are C, are all A necessarily C?", a: ["Yes", "No", "Only if A is C"], correct: 1 },
    { set: 'logic', q: "A man is looking at a photograph. Someone asks him who the man in the photo is. He says: 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the photo?", a: ["Himself", "His son", "His father"], correct: 1 },
    { set: 'logic', q: "If 5 cats can catch 5 mice in 5 minutes, how long will it take 100 cats to catch 100 mice?", a: ["100 minutes", "5 minutes", "20 minutes"], correct: 1 },
    { set: 'logic', q: "Which number comes next in the series? 121, 144, 169, 196, ...", a: ["225", "256", "289"], correct: 0 },
    { set: 'logic', q: "If you have a drawer with 10 black socks and 10 white socks, how many must you pull out to ensure a pair?", a: ["3", "11", "21"], correct: 0 },
    { set: 'logic', q: "A, D, G, J, ... What letter comes next?", a: ["K", "M", "L"], correct: 1 },
    { set: 'logic', q: "If it takes 3 people 3 days to dig 3 holes, how long does it take 1 person to dig 1 hole?", a: ["1 day", "3 days", "9 days"], correct: 1 },
    { set: 'logic', q: "Which word is the odd one out?", a: ["Apple", "Orange", "Potato", "Banana"], correct: 2 },
    { set: 'logic', q: "If all Z are Y, and all Y are X, then all Z are X?", a: ["True", "False", "Cannot tell"], correct: 0 },
  ],
  verbal: [
    { set: 'verbal', q: "Select the synonym for 'Ephemeral':", a: ["Eternal", "Transient", "Beautiful"], correct: 1 },
    { set: 'verbal', q: "Which word does NOT belong with the others?", a: ["Tyre", "Steering wheel", "Engine", "Car"], correct: 3 },
    { set: 'verbal', q: "'Library' is to 'Books' as 'Gallery' is to:", a: ["Paintings", "Statues", "Artists"], correct: 0 },
    { set: 'verbal', q: "What is the meaning of 'Mitigate'?", a: ["To intensify", "To lessen", "To ignore"], correct: 1 },
    { set: 'verbal', q: "Select the antonym for 'Placid':", a: ["Calm", "Turbulent", "Deep"], correct: 1 },
  ],
  spatial: [
    { set: 'spatial', q: "If you fold a piece of paper in half 3 times, how many layers are there?", a: ["6", "8", "12"], correct: 1 },
    { set: 'spatial', q: "Which of these shapes has the most sides?", a: ["Hexagon", "Heptagon", "Octagon"], correct: 2 },
    { set: 'spatial', q: "If you look at a clock and it's 3:15, what is the angle between the hands?", a: ["0°", "7.5°", "15°"], correct: 1 },
    { set: 'spatial', q: "How many cubes are in a 3x3x3 grid?", a: ["9", "27", "81"], correct: 1 },
    { set: 'spatial', q: "Which shape can be formed by two identical right-angled triangles?", a: ["Square", "Rectangle", "Both"], correct: 2 },
  ],
  eq: [
    { set: 'eq', q: "You see a colleague looking frustrated with a task. Best approach?", a: ["Tell them to work faster", "Offer specific help or a break", "Ignore them to avoid awkwardness"], correct: 1 },
    { set: 'eq', q: "Someone criticizes your work in a meeting. Your internal reaction should be:", a: ["Defensiveness", "Curiosity about their perspective", "Anger"], correct: 1 },
    { set: 'eq', q: "A friend is going through a hard time. Most resilient support?", a: ["Giving advice immediately", "Listening and validating emotions", "Changing the subject to distract them"], correct: 1 },
    { set: 'eq', q: "You made a mistake that affected the team. Best resolution?", a: ["Blaming the system", "Taking ownership and proposing a fix", "Hoping no one notices"], correct: 1 },
    { set: 'eq', q: "Emotional intelligence (EQ) is primarily about:", a: ["Being nice to everyone", "Managing your own and others' emotions", "Suppressing feelings"], correct: 1 },
  ],
  numerical: [
    { set: 'numerical', q: "What is 12% of 50?", a: ["5", "6", "7"], correct: 1 },
    { set: 'numerical', q: "If a laptop is $800 and increases by 10%, then decreases by 10%, what is the final price?", a: ["$800", "$792", "$808"], correct: 1 },
    { set: 'numerical', q: "What is the result of 7 + 7 ÷ 7 + 7 × 7 - 7?", a: ["50", "0", "56"], correct: 0 },
    { set: 'numerical', q: "If you have $2.50 in quarters and dimes, and you have twice as many quarters as dimes, how many quarters do you have?", a: ["5", "8", "10"], correct: 1 },
    { set: 'numerical', q: "What is 111 / 3?", a: ["33", "37", "41"], correct: 1 },
  ]
};
