/**
 * Shared Expense Split Engine
 * Handles EQUAL, EXACT, and PERCENTAGE splits with precise rounding.
 */

// Helper to round to 2 decimal places safely
const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

exports.calculateEqualSplit = (totalAmount, participants) => {
  if (!participants || participants.length === 0) throw new Error('Participants array is required');
  
  const count = participants.length;
  // Base Share = Math.floor(totalAmount * 100 / count) / 100
  const baseShare = Math.floor((totalAmount * 100) / count) / 100;
  
  // Calculate remainder (leftover pennies)
  let remainder = roundToTwo(totalAmount - (baseShare * count));
  
  return participants.map((p, index) => {
    let share = baseShare;
    // Distribute the remainder penny by penny to the first few participants
    if (remainder > 0) {
      share = roundToTwo(share + 0.01);
      remainder = roundToTwo(remainder - 0.01);
    }
    return {
      userId: p.userId,
      shareAmount: share
    };
  });
};

exports.calculateExactSplit = (totalAmount, participants) => {
  if (!participants || participants.length === 0) throw new Error('Participants array is required');
  
  // Sum of exact shares must exactly equal totalAmount
  const totalExact = participants.reduce((sum, p) => sum + (p.exactAmount || 0), 0);
  
  if (roundToTwo(totalExact) !== roundToTwo(totalAmount)) {
    throw new Error(`Exact shares sum (${totalExact}) does not match total amount (${totalAmount})`);
  }
  
  return participants.map(p => ({
    userId: p.userId,
    shareAmount: roundToTwo(p.exactAmount)
  }));
};

exports.calculatePercentageSplit = (totalAmount, participants) => {
  if (!participants || participants.length === 0) throw new Error('Participants array is required');
  
  // Sum of percentages must exactly equal 100
  const totalPercentage = participants.reduce((sum, p) => sum + (p.sharePercentage || 0), 0);
  
  if (roundToTwo(totalPercentage) !== 100.00) {
    throw new Error(`Percentage shares sum (${totalPercentage}%) does not equal 100%`);
  }
  
  let calculatedSum = 0;
  const result = participants.map(p => {
    // Share = Truncate to 2 decimal places
    const exactShare = (totalAmount * p.sharePercentage) / 100;
    const baseShare = Math.floor(exactShare * 100) / 100;
    calculatedSum = roundToTwo(calculatedSum + baseShare);
    
    return {
      userId: p.userId,
      sharePercentage: p.sharePercentage,
      shareAmount: baseShare
    };
  });
  
  // Distribute any remainder due to rounding
  let remainder = roundToTwo(totalAmount - calculatedSum);
  if (remainder > 0) {
    for (let i = 0; remainder > 0 && i < result.length; i++) {
      result[i].shareAmount = roundToTwo(result[i].shareAmount + 0.01);
      remainder = roundToTwo(remainder - 0.01);
    }
  }
  
  return result;
};
