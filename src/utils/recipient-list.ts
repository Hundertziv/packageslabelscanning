
// List of 100 recipient names including the specified ones
export const recipientList = [
  "Ellen Bataglia",
  "Ellen Delon",
  "James Smith",
  "Mary Johnson",
  "Robert Williams",
  "Patricia Brown",
  "John Jones",
  "Jennifer Garcia",
  "Michael Miller",
  "Linda Davis",
  "William Rodriguez",
  "Elizabeth Martinez",
  "David Hernandez",
  "Barbara Lopez",
  "Richard Gonzalez",
  "Susan Wilson",
  "Joseph Anderson",
  "Jessica Taylor",
  "Thomas Moore",
  "Sarah Jackson",
  "Charles White",
  "Karen Harris",
  "Christopher Martin",
  "Nancy Thompson",
  "Daniel Garcia",
  "Lisa Robinson",
  "Matthew Lewis",
  "Betty Walker",
  "Anthony Perez",
  "Dorothy Hall",
  "Mark Allen",
  "Sandra Young",
  "Donald King",
  "Ashley Wright",
  "Steven Scott",
  "Kimberly Green",
  "Paul Adams",
  "Emily Baker",
  "Andrew Nelson",
  "Donna Hill",
  "Joshua Ramirez",
  "Michelle Campbell",
  "Kenneth Mitchell",
  "Carol Roberts",
  "Kevin Carter",
  "Amanda Phillips",
  "Brian Evans",
  "Melissa Turner",
  "George Torres",
  "Deborah Parker",
  "Edward Collins",
  "Stephanie Edwards",
  "Ronald Stewart",
  "Sharon Flores",
  "Timothy Morris",
  "Cynthia Nguyen",
  "Jason Murphy",
  "Kathleen Rivera",
  "Jeffrey Cook",
  "Helen Rogers",
  "Ryan Morgan",
  "Diane Peterson",
  "Jacob Cooper",
  "Christine Reed",
  "Gary Bailey",
  "Rebecca Bell",
  "Nicholas Gomez",
  "Laura Kelly",
  "Eric Howard",
  "Catherine Ward",
  "Stephen Cox",
  "Teresa Diaz",
  "Jonathan Richardson",
  "Maria Wood",
  "Sean Watson",
  "Heather Brooks",
  "Adam Bennett",
  "Diane Gray",
  "Nathan James",
  "Julia Sanders",
  "Jeremy Price",
  "Ann Barnes",
  "Patrick Ross",
  "Alice Henderson",
  "Gerald Perry",
  "Christina Powell",
  "Gregory Long",
  "Olivia Patterson",
  "Tyler Hughes",
  "Victoria Butler",
  "Dennis Simmons",
  "Lori Foster",
  "Raymond Bryant",
  "Joyce Gonzales",
  "Samuel Alexander",
  "Julie Russell",
  "Keith Griffin",
  "Ellen Richardson",
  "Ellen Johnson",
  "Ellen Williams",
  "Ellen Carter",
  "Judith Diaz",
  "Terry West",
  "Christina Cole"
];

// Function to find the best match for a name from OCR results
export const findBestRecipientMatch = (extractedText: string): string[] => {
  const extractedWords = extractedText.toLowerCase().split(/\s+/);
  
  // Calculate a score for each recipient based on word matches
  return recipientList
    .map(recipient => {
      const recipientWords = recipient.toLowerCase().split(/\s+/);
      let matchScore = 0;
      
      // Check each word of the recipient name
      for (const word of recipientWords) {
        if (extractedWords.includes(word)) {
          matchScore += 1;
        }
      }
      
      return { recipient, matchScore };
    })
    // Filter out recipients with no matches at all
    .filter(match => match.matchScore > 0)
    // Sort by match score in descending order
    .sort((a, b) => b.matchScore - a.matchScore)
    // Take the top 5 matches
    .slice(0, 5)
    .map(match => match.recipient);
};
