
// List of 100 recipient names including the specified ones
export const recipientList = [
  "James Smith",
  "Mary Johnson",
  "Robert Williams",
  "Patricia Brown",
  "John Jones",
  "Jennifer Garcia",
  "Michael Miller",
  "Linda Davis",
  "William Rodriguez",
  "Ellen Bataglia",
  "Ellen Delon",
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
  "Ellen Battaglia",
  "Judith Diaz",
  "Terry West",
  "Christina Cole"
];

// Enhanced function to find the best match for a name from OCR results
export const findBestRecipientMatch = (extractedText: string): string[] => {
  // Clean up the extracted text
  const cleanExtractedText = extractedText.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .trim();
  
  const extractedWords = cleanExtractedText.split(/\s+/)
    .filter(word => word.length > 1); // Filter out single characters that might be noise
  
  return recipientList
    .map(recipient => {
      // Parse the recipient name into components
      const recipientFull = recipient.toLowerCase();
      const recipientWords = recipientFull.split(/\s+/);
      
      // Assume the last word is the surname and the rest is the first name
      // This is a simplification - adjust if your naming conventions differ
      const surname = recipientWords[recipientWords.length - 1];
      const firstName = recipientWords.slice(0, -1).join(" ");
      
      let matchScore = 0;
      let matchType = "";
      
      // 1. Try for full name match - highest priority
      if (cleanExtractedText.includes(recipientFull)) {
        matchScore = 100; // Perfect match
        matchType = "full";
      } 
      // 2. Check if all words of the recipient name are in the extracted text (in any order)
      else if (recipientWords.every(word => extractedWords.includes(word))) {
        matchScore = 80; // All words present but maybe not in the exact order
        matchType = "all_words";
      }
      // 3. Look for first name + surname pattern
      else if (cleanExtractedText.includes(firstName) && cleanExtractedText.includes(surname)) {
        matchScore = 70; // Both first name and surname found separately
        matchType = "first_and_last";
      }
      // 4. Check for partial matches if no direct matches
      else {
        // Count how many recipient name words are in the extracted text
        const wordMatches = recipientWords.filter(word => extractedWords.includes(word));
        const matchRatio = wordMatches.length / recipientWords.length;
        
        if (wordMatches.length > 0) {
          // Base score depends on how many words matched
          matchScore = 30 * matchRatio;
          
          // 5. Bonus for surname match
          if (extractedWords.includes(surname)) {
            matchScore += 20;
            matchType = "surname";
          } 
          // 6. Bonus for first name match
          else if (cleanExtractedText.includes(firstName)) {
            matchScore += 15;
            matchType = "first_name";
          }
          // 7. Bonus for high proportion of match
          if (matchRatio > 0.5) {
            matchScore += 10;
          }
        }
        
        // 8. Look for similarity in case of OCR errors
        if (matchScore < 30) {
          for (const recipientWord of recipientWords) {
            for (const extractedWord of extractedWords) {
              if (recipientWord.length >= 4 && extractedWord.length >= 4) {
                const similarity = calculateSimilarity(recipientWord, extractedWord);
                if (similarity >= 0.8) { // Higher threshold for confidence
                  matchScore = Math.max(matchScore, 25 * similarity);
                  matchType = "similar";
                }
              }
            }
          }
        }
      }
      
      return {
        recipient,
        matchScore,
        matchType,
        details: {
          firstName,
          surname,
          fullName: recipientFull,
          recipientWords,
          extractedWords
        }
      };
    })
    // Filter out recipients with very low match scores
    .filter(match => match.matchScore > 10)
    // Sort by match score in descending order
    .sort((a, b) => b.matchScore - a.matchScore)
    // Take the top matches
    .slice(0, 10)
    .map(match => match.recipient);
};

// Helper function to calculate string similarity
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  // Don't compare strings with significant length differences
  if (longer.length === 0) return 1.0;
  if (shorter.length / longer.length < 0.5) return 0;
  
  let matches = 0;
  
  // Compare character by character, allowing for some errors
  for (let i = 0; i < shorter.length; i++) {
    // Check for exact character match
    if (shorter[i] === longer[i]) {
      matches++;
      continue;
    }
    
    // Check if character exists in similar position (allowing for small shifts)
    const searchRange = 2; // Look 2 characters forward and backward
    const startPos = Math.max(0, i - searchRange);
    const endPos = Math.min(longer.length - 1, i + searchRange);
    
    for (let j = startPos; j <= endPos; j++) {
      if (shorter[i] === longer[j]) {
        matches += 0.5; // Partial credit for character in similar position
        break;
      }
    }
  }
  
  return matches / longer.length;
}
